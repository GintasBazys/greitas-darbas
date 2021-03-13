import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchPictureAsync, fetchUserAsync, selectImage, sendError} from "../../features/user/userSlice";
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import * as firebase from "../../firebase";
import {auth, db} from "../../firebase";
import history from "../../history";
import UserUnconfirmedNavbarComponent from "./UserUnconfirmedNavbarComponent";

const UserUnconfirmedProfileComponent = () => {
    let image = useSelector(selectImage);

    const [email, setEmail] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [username, setUsername] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        firebase.usersCollection.doc(auth.currentUser?.uid).get()
            .then((doc) => {
                //@ts-ignore
                setEmail(doc.data()?.email);
                setAboutMe(doc.data()?.aboutMe);
                setUsername(doc.data()?.username);
            })
    }, [])

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

    const handleUsernameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsername(event.target.value);
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
            await history.push("/pradzia");
            //console.log(username);
        }

    }

    const handleAboutMeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setAboutMe(event.target.value);
    }

    const changeUsername = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if (username === "") {
            dispatch(sendError("Naudotojo vardo laukas negali būti tuščias"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);

        } else {

            await db.collection("users").get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if(doc.data()?.username === username) {
                            dispatch(sendError("Naudotojas tokiu vardu jau egzistuoja"));
                            setTimeout(() => {
                                dispatch(sendError(""))
                            }, 2000);
                            return
                        }
                    })
                })

            await db.collection("users").doc(auth.currentUser?.uid).update({
                username: username
            })
            await dispatch(fetchUserAsync({uid: auth.currentUser?.uid}));
        }
    }

    return (
        <div>
            <UserUnconfirmedNavbarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={2}></Col>
                    <Col md={8}>

                        <Form>
                            <Form.Group>
                                <Image src={image} className="dashboard-profile-image" roundedCircle alt="profilio nuotrauka" />
                                <input accept="image/png,image/jpeg, image/jpg" type="file" onChange={handleImageChange}/>
                            </Form.Group>
                            <p>Paskyra dar nepatvirtinta. Negalima keisti el. pašto adreso, kol paskyra nėra patvirtinta</p>
                            <Form.Group>
                                <Form.Label>Pakeisti vartotojo vardą</Form.Label>
                                <Form.Control type="text" value={username} onChange={handleUsernameChange}/>
                            </Form.Group>
                            <div className="text-center">
                                <Button style={{textAlign: "center"}} variant="outline-dark"  onClick={(e) => changeUsername(e)}>Atnaujinti</Button>
                            </div>
                            <Form.Group>
                                <Form.Label>Pakeisti el. pašto adresą</Form.Label>
                                <Form.Control type="email" value={email} disabled={true}/>
                            </Form.Group>
                            <div className="text-center">
                                <Button variant="outline-dark"  disabled={true}>Atnaujinti</Button>
                            </div>

                            <Form.Group>
                                <Form.Label>Papildyti profilio informaciją</Form.Label>
                                <Form.Control as="textarea" rows={6} value={aboutMe} onChange={handleAboutMeChange}/>
                            </Form.Group>

                            <div className="text-center">
                                <Button style={{textAlign: "center"}} onClick={(e) => changeAboutMe(e)} variant="outline-dark" >Atnaujinti</Button>
                            </div>



                        </Form>
                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserUnconfirmedProfileComponent;