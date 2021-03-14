import React from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button} from "react-bootstrap";

const UserOffersInProgressComponent = () => {
    const image = useSelector(selectImage);

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
        </div>
    )
}

export default UserOffersInProgressComponent;