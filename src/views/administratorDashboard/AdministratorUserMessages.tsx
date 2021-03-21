import React from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";

const AdministratorUserMessages = () => {
    const image = useSelector(selectWorkerImage);

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />

        </div>
    )
}

export default AdministratorUserMessages;