import React, { useState} from "react";

import {useSelector, useDispatch} from "react-redux";
import {signUpAsync, sendModalError, selectModalError} from "./userSlice";
import {Button, Form} from "react-bootstrap";
import {db} from "../../firebase";
import ModalNotificationComponent from "../../views/main_page/ModalNotificationComponent";

const SignUp = () => {
    let errorMessage = useSelector(selectModalError);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")


    const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value)
    }

    const handlePasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(event.target.value)
    }

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if(username === "" || password === "" || email === ""){
            dispatch(sendModalError("laukai negali būti tušti"));
            setTimeout(() => {
                dispatch(sendModalError(""))
            }, 2000);

        }
        if(username !== "" || password !== "" || email !== "") {
            let isResolved = false;
            await db.collection("users").where("username", "==", username).limit(1)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        if (doc.data().username === username) {
                            console.log(doc.data())
                            isResolved = true;
                            return false;
                        }
                    });

                }).catch((error) => {
                });
            if(isResolved) {
                dispatch(sendModalError("vartotojas tokiu vardu jau egzistuoja"));
                setTimeout(() => {
                    dispatch(sendModalError(""))
                }, 5000);
            } else {
                dispatch(signUpAsync({username: username, email: email, password: password}))
            }
        }

    }

    const handleUserNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsername(event.target.value)
    }

    return (
        <div>
            <ModalNotificationComponent message={errorMessage} />
            <Form>
                <Form.Group controlId="username">
                    <Form.Label>Vartotojo vardas</Form.Label>
                    <Form.Control type="text" value={username} autoComplete="on" autoFocus placeholder="Įveskite vartotojo vardą" onChange={handleUserNameChange}/>
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>El. pašto adresas</Form.Label>
                    <Form.Control type="text" value={email} autoComplete="on" placeholder="Įveskite el. pašto adresą" autoFocus onChange={handleEmailChange} />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Slaptažodis</Form.Label>
                    <Form.Control type="password" value={password} autoComplete="on" placeholder="Įveskite slaptažodį" autoFocus onChange={handlePasswordChange}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
                    Pateikti
                </Button>
            </Form>

        </div>
    )
}

export default SignUp;