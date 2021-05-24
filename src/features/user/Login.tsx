import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginAsync, selectCheckedUser, sendError} from "./userSlice";
import LoginPageComponent from "../../views/main_page/LoginPageComponent";
import {db} from "../../firebase";

const Login = () => {

    let checkedUser = useSelector(selectCheckedUser);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        if(event.target.value.length >= 101) {
            dispatch(sendError("Ne daugiau nei 100 simboliu"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);
        }else{
            setEmail(event.target.value)
        }

    }

    const handlePasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {

        if(email === "" && password === "") {
            dispatch(sendError("Negali būti tuščių laukų"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 5000)
        } else

        db.collection("users").where("email", "==", email).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.data());
                    if(doc.data()?.status !== "administratorius" || doc.data()?.status !== "darbuotojas") {
                        dispatch(loginAsync({email: email, password: password, checkedRemember: checkedUser}))
                    } else {
                        dispatch(sendError("Netinkami paskyros duomenys"));
                        setTimeout(() => {
                            dispatch(sendError(""));
                        }, 5000)

                    }
                })
            }).catch((error) => {
                console.log(error.errorMessage)
        })

        event.preventDefault();
        dispatch(loginAsync({email: email, password: password, checkedRemember: checkedUser}))
        setEmail("");
        setPassword("");

    }

    return (
        <div>
            <LoginPageComponent
                handleEmailChange={handleEmailChange}
                handlePasswordChange={handlePasswordChange}
                handleSubmit={handleSubmit}
                email={email}
                checkedUser={checkedUser}
                password={password}
            />
        </div>
    )
}

export default Login;