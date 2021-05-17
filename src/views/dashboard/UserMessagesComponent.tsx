import React, {useEffect, useState} from "react";
import UserNavBarComponent from "./UserNavbarComponent";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import {auth, db} from "../../firebase";
import {Button} from "react-bootstrap";
import PaymentPaginationComponent from "../administratorDashboard/PaymentPaginationComponent";
import ReceivedMessages from "./ReceivedMessages";

const UserMessagesComponent = () => {

    const image = useSelector(selectImage);

    const [receivedMessages, setReceivedMessages] = useState([]);

   useEffect(() => {
       db.collection("users").doc(auth.currentUser?.uid).get()
           .then((doc) => {
               setReceivedMessages(doc.data()?.receivedMessages)
           })
   }, [])

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // @ts-ignore
    const currentItems = receivedMessages.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: React.SetStateAction<number>) => {setCurrentPage(pageNumber)}

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            {
                <React.Fragment>
                    <ReceivedMessages items={currentItems} loading={loading} />
                    {/*@ts-ignore*/}
                    <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={receivedMessages.length} paginate={paginate}/>
                    <div style={{display: "flex", marginTop: "2rem", justifyContent: "center"}}>
                        <Button variant="outline-dark">Peržiūrėti visas žinutes</Button>
                    </div>
                </React.Fragment>
            }
        </div>
    )
}

export default UserMessagesComponent;