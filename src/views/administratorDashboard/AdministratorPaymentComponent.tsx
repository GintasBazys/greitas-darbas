import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import axios from "axios";
import PaymentPaginationComponent from "./PaymentPaginationComponent";
import Payments from "./Payments";

const AdministratorPaymentComponent = () => {

    const image = useSelector(selectWorkerImage);

    const [payments, setPayments] = useState([]);

    const config = {
        headers: { Authorization: `Bearer sk_test_51IEDvEJIin4U4oiGASk92FsbExcjn60sdsraDxd5XER9LH4YUF2HcODYBtSAd8OPBMNeOMNGzuBiBdK42G69dOLC00x2a35IUF` }
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

    //atkerta paymentu dali
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // @ts-ignore
    const currentItems = payments.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: React.SetStateAction<number>) => {setCurrentPage(pageNumber)}

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <div className="center">
                <Payments items={currentItems} loading={loading} />
                {/*@ts-ignore*/}
                <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={payments.length} paginate={paginate}/>
            </div>

        </div>
    )
}

export default AdministratorPaymentComponent;