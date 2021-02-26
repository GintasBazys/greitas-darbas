import React from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";

const AdministratorDashboardComponent = () => {

    let image = useSelector(selectImage);

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />

        </div>
    )
}

export default AdministratorDashboardComponent;