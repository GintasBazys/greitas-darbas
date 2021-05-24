import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchWorkerAsync, selectWorker, selectWorkerError, selectWorkerImage} from "../../features/worker/workerSlice";
import {auth, db, emailProvider} from "../../firebase";
import * as firebase from "../../firebase";
import {sendWorkerError} from "../../features/worker/workerSlice"
import history from "../../history";
import {Button, Col, Container, Form, Row, Image} from "react-bootstrap";
import ClientManagerNavbarComponent from "./ClientManagerNavbarComponent";
import {fetchPictureAsync} from "../../features/user/userSlice";

const ClientManagerProfileComponent = () => {
    let image = useSelector(selectWorkerImage);
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const user = firebase.auth.currentUser;
    const [username, setUsername] = useState("");
    const userId = firebase.auth.currentUser?.uid;

    useEffect( () => {
        db.collection("workers").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                //@ts-ignore
                setEmail(user?.email);
                setAboutMe(doc.data()?.aboutMe);
                setUsername(doc.data()?.username);
            })
        ;
    }, [user])

    const handleUsernameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsername(event.target.value);
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
        }

    }

    const changeUsername = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if (username === "") {
            dispatch(sendWorkerError("Naudotojo vardo laukas negali būti tuščias"));
            setTimeout(() => {
                dispatch(sendWorkerError(""))
            }, 2000);

        } else {

            await db.collection("workers").get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if(doc.data()?.username === username) {
                            dispatch(selectWorkerError("Darbuotojas tokiu vardu jau egzistuoja"));
                            setTimeout(() => {
                                dispatch(sendWorkerError(""))
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

    return (
        <div>
            <ClientManagerNavbarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <div style={{marginTop: "2rem"}}>
                        </div>
                    </Col>
                    <Col md={8}>

                        <Form>
                            <Form.Group>
                                {/*@ts-ignore*/}
                                <Image src={image} className="dashboard-profile-image" roundedCircle alt="profilio nuotrauka" />
                                <input accept="image/png,image/jpeg, image/jpg" type="file" onChange={handleImageChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Pakeisti vartotojo vardą</Form.Label>
                                <Form.Control type="text" value={username} onChange={handleUsernameChange} />
                            </Form.Group>
                            <div className="text-center">
                                <Button style={{textAlign: "center"}} variant="outline-dark" onClick={(e) => changeUsername(e)}>Atnaujinti</Button>
                            </div>
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
                    <Col md={2}>
                        <div>

                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default ClientManagerProfileComponent;


