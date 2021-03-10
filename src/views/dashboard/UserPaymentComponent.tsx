import React, {useEffect, useState} from "react";
import Stripe from "../../Stripe";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import axios from "axios";
import Payments from "../administratorDashboard/Payments";
import PaymentPaginationComponent from "../administratorDashboard/PaymentPaginationComponent";
import LoadingComponent from "../LoadingComponent";

const UserPaymentComponent = () => {

    const image = useSelector(selectImage)

    const [payments, setPayments] = useState([]);

    const config = {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}` },

    };

    const renderPayments = async () => {

        let lastPayment = "";
        //TODO checkPayment, axios get customers id by email
        await axios.get("https://api.stripe.com/v1/payment_intents?limit=10&customer=cus_J5MpPew9wOl3De", config)
            .then((res) => {
                const allPayments = res.data.data;
                setPayments(allPayments)
                // @ts-ignore
                lastPayment = allPayments[9].id
                console.log(lastPayment);
            }).catch((error) => {

            })
        await axios.get(`https://api.stripe.com/v1/payment_intents?customer=cus_J5MpPew9wOl3De&limit=10&starting_after=${lastPayment}`, config)
            .then((resp) => {
                console.log(resp)
                // @ts-ignore
                setPayments(payments => [...payments, ...resp.data.data])
                // @ts-ignore
                console.log(payments)
            })

    }

    useEffect(() => {
        setLoading(true);
        renderPayments()
        setLoading(false);
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

            <div className="center">
                <Payments items={currentItems} loading={loading} />
                {/*@ts-ignore*/}
                <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={payments.length} paginate={paginate}/>
            </div>
        </div>
    )
}

export default UserPaymentComponent;