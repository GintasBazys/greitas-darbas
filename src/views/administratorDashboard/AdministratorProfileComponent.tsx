import {
    fetchWorkerPictureAsync,
    selectWorkerImage,
    selectWorker, fetchWorkerAsync,
} from "../../features/worker/workerSlice";
import history from "../../history";
import {auth, db, emailProvider} from "../../firebase";
import {Button, Form, Image, Container, Row, Col} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as firebase from "../../firebase";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {sendError} from "../../features/user/userSlice";

const AdministratorProfileComponent = () => {
    const dispatch = useDispatch();
    let image = useSelector(selectWorkerImage);

    const [email, setEmail] = useState("");
    const user = firebase.auth.currentUser;
    useEffect(() => {
        db.collection("workers").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                //@ts-ignore
                setEmail(user?.email);
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


    const changeEmail = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();

        if(email !== "") {
            user?.updateEmail(email)
                .then(async () => {
                    await db.collection("workers").doc(auth.currentUser?.uid).update({
                        email: email
                    })
                }).catch((error) => {
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
                        })
                }).catch((error) => {
                    console.log(error.message);
                })
                console.log(error.message);
            })
        }


    }

    const [username, setUsername] = useState("");
    const userId = firebase.auth.currentUser?.uid;

    useEffect(() => {
        firebase.workerCollection.doc(auth.currentUser?.uid).get()
            .then((doc) => {
                //@ts-ignore
                setUsername(doc.data()?.username);
            })
    }, [user])

    const handleUsernameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsername(event.target.value);
    }

    const changeUsername = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if (username === "") {
            dispatch(sendError("Darbuotojo vardo laukas negali būti tuščias"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);

        } else {

            await db.collection("workers").get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if(doc.data()?.username === username) {
                            dispatch(sendError("Darbuotojas tokiu vardu jau egzistuoja"));
                            setTimeout(() => {
                                dispatch(sendError(""))
                            }, 2000);
                            return
                        }
                    })
                })

            await db.collection("workers").doc(auth.currentUser?.uid).update({
                username: username
            })
            await dispatch(fetchWorkerAsync({uid: userId}));
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
                            <Form.Label>Pakeisti vartotojo vardą</Form.Label>
                            <Form.Control type="text" value={username} onChange={handleUsernameChange} />
                        </Form.Group>
                        <div className="text-center">
                            <Button style={{textAlign: "center"}} variant="outline-dark" onClick={(e) => changeUsername(e)}>Atnaujinti</Button>
                        </div>
                    </Form>
                </Col>
                <Col md={2}></Col>
            </Row>
        </Container>
    </div>
}

export default AdministratorProfileComponent;