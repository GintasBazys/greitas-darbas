import {
    fetchWorkerPictureAsync,
    selectWorkerError,
    sendWorkerError,
    selectWorkerImage,
    selectWorker,
} from "../../features/worker/workerSlice";
import history from "../../history";
import {auth, db, emailProvider} from "../../firebase";
import {Button, Form, Image, Container, Row, Col} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as firebase from "../../firebase";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import NotificationComponent from "../main_page/NotificationComponent";

const AdministratorProfileComponent = () => {
    const dispatch = useDispatch();
    let image = useSelector(selectWorkerImage);
    let errorMessage = useSelector(selectWorkerError);

    const [email, setEmail] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const user = firebase.auth.currentUser;
    const userBeforeChange = useSelector(selectWorker);
    useEffect(() => {
        db.collection("workers").doc(auth.currentUser?.uid).get()
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

                dispatch(fetchWorkerPictureAsync(image))
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
            dispatch(sendWorkerError("Laukas negali būti tuščias"));
            setTimeout(() => {
                dispatch(sendWorkerError(""))
            }, 5000);

        } else {
            await db.collection("workers").doc(auth.currentUser?.uid).update({
                aboutMe: aboutMe
            })
            //await dispatch(fetchUserAsync({uid: userId}));
            await history.push("/administracija");
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
                    await db.collection("workers").doc(auth.currentUser?.uid).update({
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
                            await db.collection("workers").doc(auth.currentUser?.uid).update({
                                email: email
                            })
                            history.push("administracija");
                        })
                }).catch((error) => {
                    console.log(error.message);
                })
                console.log(error.message);
            })
        }


    }

    return <div>
        <AdministratorDashboardNavbar profileImage={image}/>
        <Container fluid>
            <Row>
                <Col md={2}></Col>
                <Col md={8}>

                    <Form>
                        <Form.Group>
                            <Image src={image} className="dashboard-profile-image" roundedCircle alt="profilio nuotrauka" />
                            <input accept="image/png,image/jpeg, image/jpg" type="file" onChange={handleImageChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Pakeisti el. pašto adresą</Form.Label>
                            <Form.Control type="email" value={email} onChange={handleEmailChange}/>
                        </Form.Group>

                        <div className="text-center">
                            <Button variant="outline-dark" onClick={(e) => changeEmail(e)}>Atnaujinti</Button>
                        </div>

                        <Form.Group>
                            <Form.Label>Papildyti profilio informaciją</Form.Label>
                            <Form.Control as="textarea" rows={6} value={aboutMe} onChange={handleAboutMeChange} />
                        </Form.Group>

                        <div className="text-center">
                            <Button style={{textAlign: "center"}} variant="outline-dark" onClick={(e) => changeAboutMe(e)}>Atnaujinti</Button>
                        </div>

                    </Form>
                </Col>
                <Col md={2}></Col>
            </Row>
        </Container>
    </div>
}

export default AdministratorProfileComponent;