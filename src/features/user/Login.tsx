import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginAsync, selectCheckedUser, selectError, sendError} from "./userSlice";
import LoginPageComponent from "../../views/main_page/LoginPageComponent";

const Login = () => {

    let checkedUser = useSelector(selectCheckedUser);
    const errorMessage = useSelector(selectError);
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