import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginWorkerAsync, selectCheckedWorker, selectWorkerError, sendWorkerError,} from "./workerSlice";
import WorkerLoginPageComponent from "../../views/main_page/WorkerLoginPageComponent";
import {db} from "../../firebase";
import {loginAsync, sendError} from "../user/userSlice";

const WorkerLogin = () => {

    let checkedUser = useSelector(selectCheckedWorker);
    const errorMessage = useSelector(selectWorkerError);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        if(event.target.value.length >= 101) {
            dispatch(sendWorkerError("Ne daugiau nei 100 simboliu"));
            setTimeout(() => {
                dispatch(sendWorkerError(""))
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

        if(email === "" && password === "") {
            dispatch(sendWorkerError("Negali būti tuščių laukų"));
            setTimeout(() => {
                dispatch(sendWorkerError(""))
            }, 5000)
        } else {
            dispatch(loginWorkerAsync({email: email, password: password, checkedRemember: checkedUser}))
            }
            // dispatch(loginWorkerAsync({email: email, password: password, checkedRemember: checkedUser}))
            // setEmail("");
            // setPassword("");
    }

    return (
        <div>
            <WorkerLoginPageComponent
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

export default WorkerLogin;