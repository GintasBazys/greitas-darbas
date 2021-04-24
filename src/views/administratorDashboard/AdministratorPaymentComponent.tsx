import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import axios from "axios";
import PaymentPaginationComponent from "./PaymentPaginationComponent";
import Payments from "./Payments";
import Stripe from "../../Stripe";
import LoadingComponent from "../LoadingComponent";

const AdministratorPaymentComponent = () => {

    const image = useSelector(selectWorkerImage);

    const [payments, setPayments] = useState([]);

    const config = {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}` },
    };

    const renderPayments = () => {
            axios.get("https://api.stripe.com/v1/payment_intents?limit=100", config)
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
    const [itemsPerPage] = useState(10);

    //atkerta paymentu dali
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // @ts-ignore
    const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: React.SetStateAction<number>) => {setCurrentPage(pageNumber)}

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            {
                payments.length > 0 ? <div>
                    <div>
                        <Payments items={currentItems} loading={loading} />
                        {/*@ts-ignore*/}
                        <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={payments.length} paginate={paginate}/>
                        <div style={{marginTop: "2rem", width: "40%"}} className="alert alert-warning" role="alert">
                            <p>*Succeeded - Sėkmingas mokėjimas</p>
                            <p>*Processing - Vykdomas mokėjimas</p>
                            <p>*Payment failed - Nesėkmingas mokėjimas</p>
                        </div>
                    </div>
                    {/*@ts-ignore*/}
                </div> : <LoadingComponent />
            }

        </div>
    )
}

export default AdministratorPaymentComponent;