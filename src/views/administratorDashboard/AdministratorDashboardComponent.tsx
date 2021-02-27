import React from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";

const AdministratorDashboardComponent = () => {

    let image = useSelector(selectImage);

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <div className="center">
                <h1>Paskyrų nepatvirtinta: 0</h1>
                <h1>Darbuotojų kiekis: </h1>
            </div>
        </div>
    )
}

export default AdministratorDashboardComponent;