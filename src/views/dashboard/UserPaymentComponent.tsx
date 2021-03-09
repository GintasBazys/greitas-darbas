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

    const renderPayments = () => {
        axios.get("https://api.stripe.com/v1/payment_intents", config)
            .then((res) => {
                const allPayments = res.data.data;
                setPayments(allPayments)
            }).catch((error) => {

        })
    }

    useEffect(() => {
        setLoading(true);
        renderPayments()
        setLoading(false);
    }, [])

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // @ts-ignore
    const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: React.SetStateAction<number>) => {setCurrentPage(pageNumber)}

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            {

                    payments.length > 0 ? <div className="center">
                        <Payments items={currentItems} loading={loading} />
                        {/*@ts-ignore*/}
                        <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={payments.length} paginate={paginate}/>
                    </div> : <LoadingComponent />

            }
            <Stripe />
        </div>
    )
}

export default UserPaymentComponent;