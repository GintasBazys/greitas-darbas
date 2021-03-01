import React from "react";
import {useSelector} from "react-redux";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {selectWorkerImage} from "../../features/worker/workerSlice";

const AdministratorDashboardComponent = () => {

    let image = useSelector(selectWorkerImage);

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