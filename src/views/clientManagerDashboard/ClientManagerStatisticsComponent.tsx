import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import statistics from "../../assets/statistics.svg";
import ClientManagerNavbarComponent from "./ClientManagerNavbarComponent";
import OfferStatisticsComponent from "../statistics/OfferStatisticsComponent";
import OfferStatisticsPartTwo from "../statistics/OfferStatisticsPartTwo";
import RequestsStatisticsComponent from "../statistics/RequestStatisticsComponent";
import PaymentStatisticsComponent from "../statistics/PaymentStatisticsComponent";
import UserStatisticsComponent from "../statistics/UserStatisticsComponet";
import {db} from "../../firebase";
import RequestsStatisticsComponentPartTwo from "../statistics/RequestsStatisticsComponentPartTwo";
import axios from "axios";

const ClientManagerStatisticsComponent = () => {
    const image = useSelector(selectWorkerImage);

    const [offerItems, setOfferItems] = useState([]);
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);

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

    useEffect(() => {
        setLoading(true);
        renderPayments();
        setLoading(false);
    }, [])


    return (
        <div>
            <ClientManagerNavbarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={3}>
                        <h1 className="center-element">Paslaugos</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => OfferStatisticsComponent(offerItems)}>Generuoti pirmą ataskaitų dalį</Button>
                        </div>
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button variant="outline-dark" onClick={() => OfferStatisticsPartTwo(offerItems)}>Generuoti antrą ataskaitų dalį</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Darbai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => RequestsStatisticsComponent(requests)}>Generuoti darbų ataskaitos pirmą dalį</Button>
                        </div>
                        <div className="center-element" style={{marginTop: "2rem"}}>
                            <Button variant="outline-dark" onClick={() => RequestsStatisticsComponentPartTwo(requests)}>Generuoti darbų ataskaitos antrą dalį</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Mokėjimai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => PaymentStatisticsComponent(payments)}>Generuoti mokėjimų ataskaitą</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Naudotojai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => UserStatisticsComponent(users)}>Generuoti naudotojų ataskaitą</Button>
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
export default ClientManagerStatisticsComponent;