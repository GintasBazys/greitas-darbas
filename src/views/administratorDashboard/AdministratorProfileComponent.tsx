import {
    fetchPictureAsync,
    selectError,
    sendError,
    selectImage,
    selectUser,
    signUpWorkerAsync
} from "../../features/user/userSlice";
import history from "../../history";
import {auth, db, emailProvider} from "../../firebase";
import {Button, Form, Image} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as firebase from "../../firebase";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import NotificationComponent from "../main_page/NotificationComponent";

const AdministratorProfileComponent = () => {
    const dispatch = useDispatch();
    let image = useSelector(selectImage);
    let errorMessage = useSelector(selectError);

    const [email, setEmail] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const user = firebase.auth.currentUser;
    const userBeforeChange = useSelector(selectUser);
    console.log(userBeforeChange);
    useEffect(() => {
        db.collection("users").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                //@ts-ignore
                setEmail(user?.email);
                setAboutMe(doc.data()?.aboutMe)
            })
    }, [user])


    const handleImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                // @ts-ignore
                image = e.target.result;

                dispatch(fetchPictureAsync(image))
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
    }

    const changeAboutMe = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if (aboutMe === "") {
            dispatch(sendError("Laukas negali būti tuščias"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 5000);

        } else {
            await db.collection("users").doc(auth.currentUser?.uid).update({
                aboutMe: aboutMe
            })
            //await dispatch(fetchUserAsync({uid: userId}));
            await history.push("/administracija/");
            //console.log(username);
        }

    }

    const handleAboutMeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setAboutMe(event.target.value);
    }


    const changeEmail = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();

        if(email !== "") {
            user?.updateEmail(email)
                .then(async () => {
                    await db.collection("users").doc(auth.currentUser?.uid).update({
                        email: email
                    })
                    history.push("/administracija");
                }).catch((error) => {
                //TODO veliau padaryti langa o ne prompt
                const password = prompt("Re-enter password");
                const cred = emailProvider.credential(
                    //@ts-ignore
                    user?.email,
                    //@ts-ignore
                    password
                );
                user?.reauthenticateWithCredential(cred).then(() => {
                    user?.updateEmail(email)
                        .then(async () => {
                            await db.collection("users").doc(auth.currentUser?.uid).update({
                                email: email
                            })
                            history.push("administratorius/");
                        })
                }).catch((error) => {
                    console.log(error.message);
                })
                console.log(error.message);
            })
        }


    }

    const [newUserEmail, setnewUserEmail] = useState("");
    const [newPassword, setNewPassword] = useState("")
    const [newUsername, setNewUsername] = useState("")


    const handleNewEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setnewUserEmail(event.target.value)
    }

    const handleNewPasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewPassword(event.target.value)
    }

    const handleNewUserNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewUsername(event.target.value)
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if(newUsername !== "" || newPassword !== "" || newUserEmail !== "") {
            await dispatch(signUpWorkerAsync({username: newUsername, email: newUserEmail, password: newPassword}))
            await history.push("/administracija");
        }

    }

    return <div>
        <AdministratorDashboardNavbar profileImage={image}/>
        <Form>
            <NotificationComponent message={errorMessage} />
            <Form.Group>
                <Image src={image} className="dashboard-profile-image" roundedCircle alt="profile picture" />
                <input accept="image/png,image/jpeg, image/jpg" type="file" onChange={handleImageChange}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Pakeisti el. pašto adresą</Form.Label>
                <Form.Control type="email" value={email} onChange={handleEmailChange}/>
            </Form.Group>
            <Button type="primary" onClick={(e) => changeEmail(e)}>Atnaujinti</Button>
            <Form.Group>
                <Form.Label>Papildyti profilio informaciją</Form.Label>
                <Form.Control as="textarea" rows={6} value={aboutMe} onChange={handleAboutMeChange} />
            </Form.Group>
            <Button type="primary" onClick={(e) => changeAboutMe(e)}>Atnaujinti</Button>
        </Form>

        <Form style={{justifyContent: "center"}}>
            <Form.Group controlId="newusername">
                <Form.Label>Vartotojo vardas</Form.Label>
                <Form.Control type="text" value={newUsername} autoComplete="on" autoFocus placeholder="Įveskite vartotojo vardą" onChange={handleNewUserNameChange}/>
            </Form.Group>

            <Form.Group controlId="newemail">
                <Form.Label>El. pašto adresas</Form.Label>
                <Form.Control type="text" value={newUserEmail} autoComplete="on" placeholder="Įveskite el. pašto adresą" autoFocus onChange={handleNewEmailChange} />
            </Form.Group>

            <Form.Group controlId="newpassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={newPassword} autoComplete="on" placeholder="Įveskite slaptažodį" autoFocus onChange={handleNewPasswordChange}/>
            </Form.Group>
            <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
                Sukurti naują darbuotojo paskyrą
            </Button>
        </Form>
    </div>
}

export default AdministratorProfileComponent;