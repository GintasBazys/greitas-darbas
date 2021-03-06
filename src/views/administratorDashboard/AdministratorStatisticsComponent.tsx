import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {Button, Col, Container, Row, Image} from "react-bootstrap";
import statistics from "../../assets/statistics.svg";
import {db} from "../../firebase";
import OfferStatisticsComponent from "../statistics/OfferStatisticsComponent";
import OfferStatisticsPartTwo from "../statistics/OfferStatisticsPartTwo";
import RequestsStatisticsComponent from "../statistics/RequestStatisticsComponent";
import PaymentStatisticsComponent from "../statistics/PaymentStatisticsComponent";
import UserStatisticsComponent from "../statistics/UserStatisticsComponet";
import RequestsStatisticsComponentPartTwo from "../statistics/RequestsStatisticsComponentPartTwo";
import axios from "axios";

const AdministratorStatisticsComponent = () => {

    const image = useSelector(selectWorkerImage);

    const [offerItems, setOfferItems] = useState([]);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);

    const [payments, setPayments] = useState([]);

    const config = {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}` },
    };
    const [loading, setLoading] = useState(false);

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
        renderPayments();
        setLoading(false);
    }, [])

    useEffect( () => {
        const items: any[] = [];
        db.collection("users").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const item = doc.data();
                    items.push(item);
                })
            }).then(() => {
            // @ts-ignore
            setUsers(items);
        })
    }, [])

    useEffect( () => {
        const items: any[] = [];
        db.collection("offers").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const item = doc.data();
                    items.push(item);
                })
            }).then(() => {
                // @ts-ignore
            setOfferItems(items);
        })
    }, [])

    useEffect( () => {
        const items: any[] = [];
        db.collection("requests").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const item = doc.data();
                    items.push(item);
                })
            }).then(() => {
            // @ts-ignore
            setRequests(items);
        })
    }, [])

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={3}>
                        <h1 className="center-element">Paslaugos</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => OfferStatisticsComponent(offerItems)}>Generuoti pirm?? ataskait?? dal??</Button>
                        </div>
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button variant="outline-dark" onClick={() => OfferStatisticsPartTwo(offerItems)}>Generuoti antr?? ataskait?? dal??</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Darbai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => RequestsStatisticsComponent(requests)}>Generuoti darb?? ataskaitos pirm?? dal??</Button>
                        </div>
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button variant="outline-dark" onClick={() => RequestsStatisticsComponentPartTwo(requests)}>Generuoti darb?? ataskaitos antr?? dal??</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Mok??jimai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => PaymentStatisticsComponent(payments)}>Generuoti mok??jim?? ataskait??</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Naudotojai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => UserStatisticsComponent(users)}>Generuoti naudotoj?? ataskait??</Button>
                        </div>

                    </Col>
                </Row>
                <Row>
                    <div style={{marginTop: "2rem"}} className="center-element">
                        <Image src={statistics} />
                    </div>

                </Row>
            </Container>
        </div>
    )
}

export default AdministratorStatisticsComponent;