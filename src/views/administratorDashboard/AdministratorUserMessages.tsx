import React from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {usePagination} from "use-pagination-firestore";
import {auth, db} from "../../firebase";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

const AdministratorUserMessages = () => {
    const image = useSelector(selectWorkerImage);

    const worker = auth.currentUser?.uid;

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
            <Link style={{marginRight: "3rem", marginTop: "4rem"}} to="/administracija/zinutes/gauta">Gautos žinutės</Link>
            {
                // @ts-ignore
                 items.map((item) => (
                     <React.Fragment>
                         <div style={{ display: "flex", justifyContent: "center"}}>
                             <div style={{marginTop: "2rem", width: "50%", borderStyle: "solid", borderRadius: "1rem"}}>
                             <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                                 <p>Paskutine žinutė išsiųsta naudotojui {item.username} - {item.messages[0]}</p>
                                 <p>Paskutinės 5 žinutės:</p>
                                 {
                                     item.messages.map((message: any) => {
                                         return <p>{message}</p>
                                     })
                                 }
                             </div>
                                 <div style={{ display: "flex", justifyContent: "center"}}>
                                     <Button style={{marginRight: "2rem"}} variant="outline-dark">Peržiūrėti visas žinutes</Button>
                                 </div>
                            </div>
                         </div>



                     </React.Fragment>

                 ))
            }
            {
                items.length === 0 ? <div style={{marginTop: "2rem"}}>Daugiau žinučių nėra <Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Grįžti atgal</Button></div> :
                    <div className="center-element" style={{marginTop: "2rem"}}>
                        <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                        <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                    </div>
            }
        </div>
    )
}

export default AdministratorUserMessages;