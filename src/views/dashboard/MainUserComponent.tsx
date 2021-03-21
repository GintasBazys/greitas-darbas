import React, {useState} from "react";
import UserNavBarComponent from "./UserNavbarComponent";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import Stripe from "../../Stripe";

const MainUserComponent = () => {

    const image = useSelector(selectImage);

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <div className="center">
                <h1>Siūlomų paslaugų:</h1>
                <h1>Ieškomų darbuotojų:</h1>
                <h1>Atlikta mokėjimų:</h1>
                <h1>Neperskaityta žinučių:</h1>
            </div>
            <div style={{width: "20%"}}>
                <Stripe />
            </div>
        </div>
    )
}

export default MainUserComponent;