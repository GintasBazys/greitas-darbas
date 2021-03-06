import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage, selectUserEmail} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import axios from "axios";
import Payments from "../administratorDashboard/Payments";
import PaymentPaginationComponent from "../administratorDashboard/PaymentPaginationComponent";

const UserPaymentComponent = () => {

    const image = useSelector(selectImage)
    const email = useSelector(selectUserEmail);

    const [payments, setPayments] = useState([]);

    const config = {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}` },

    };

    const [userID, setUserID] = useState("");

    const renderPayments = async () => {

        let lastPayment = "";

        await axios.get(`https://api.stripe.com/v1/customers?email=${email}`,config)
            .then((res) => {
                // console.log(res.data.data[0].id);
                // setUserID(res.data.data[0].id);
                // console.log(userID)
                if(res.data.data[0] !== undefined) {
                    axios.get(`https://api.stripe.com/v1/payment_intents?limit=10&customer=${res.data.data[0].id}`, config)
                        .then((res) => {
                            const allPayments = res.data.data;
                            setPayments(allPayments)
                            // @ts-ignore
                            lastPayment = allPayments[9].id
                            //console.log(lastPayment);
                        }).catch((error) => {
                    })
                }
                else{

                }

            })



        // await axios.get(`https://api.stripe.com/v1/payment_intents?customer=${userID}&limit=10&starting_after=${lastPayment}`, config)
        //     .then((resp) => {
        //         //console.log(resp)
        //         // @ts-ignore
        //         setPayments(payments => [...payments, ...resp.data.data])
        //         // @ts-ignore
        //         //console.log(payments)
        //     })



    }

    useEffect(() => {
        setLoading(true);
        renderPayments().then(r => setLoading(false))
        //setLoading(false);
    }, [])

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // @ts-ignore
    const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: React.SetStateAction<number>) => {setCurrentPage(pageNumber)}

    return (
        <div>
            <UserNavBarComponent profileImage={image} />

            <div>
                <Payments items={currentItems} loading={loading} />
                {/*@ts-ignore*/}
                <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={payments.length} paginate={paginate}/>
                <div style={{marginTop: "2rem", width: "40%"}} className="alert alert-warning" role="alert">
                    <p>*Succeeded - S??kmingas mok??jimas</p>
                    <p>*Processing - Vykdomas mok??jimas</p>
                    <p>*Payment failed - Nes??kmingas mok??jimas</p>
                </div>
            </div>
        </div>
    )
}

export default UserPaymentComponent;