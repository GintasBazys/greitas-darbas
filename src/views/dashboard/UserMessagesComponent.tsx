import React from "react";
import UserNavBarComponent from "./UserNavbarComponent";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";

const UserMessagesComponent = () => {

    const image = useSelector(selectImage);

    return (
        <div>
            <UserNavBarComponent profileImage={image} />

        </div>
    )
}

export default UserMessagesComponent;