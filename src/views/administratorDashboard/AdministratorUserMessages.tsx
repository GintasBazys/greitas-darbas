import React from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
import {Button} from "react-bootstrap";
const AdministratorUserMessages = () => {
    const image = useSelector(selectWorkerImage);

    const worker = auth.currentUser?.uid

    let {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        //@ts-ignore
        db.collection("messages").where("sender", "==", worker), {
            limit: 10
        }
    );

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            {
                // @ts-ignore
                     <React.Fragment>
                         <div style={{ display: "flex", justifyContent: "center"}}>
                             <div style={{marginTop: "2rem", width: "50%", borderStyle: "solid", borderRadius: "1rem"}}>
                             <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                             </div>
                                 <div style={{ display: "flex", justifyContent: "center"}}>
                                     <Button style={{marginRight: "2rem"}} variant="outline-dark">Peržiūrėti visas žinutes</Button>
                                 </div>
                            </div>
                         </div>
                     </React.Fragment>
            }
        </div>
    )
}

export default AdministratorUserMessages;