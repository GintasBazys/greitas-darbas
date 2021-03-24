import React from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";

const OfferPaidComponent = () => {

    const image = useSelector(selectImage)

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
        </div>
    )
}

export default OfferPaidComponent;