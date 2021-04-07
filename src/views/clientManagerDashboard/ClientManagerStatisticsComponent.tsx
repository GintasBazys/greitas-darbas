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

const ClientManagerStatisticsComponent = () => {
    const image = useSelector(selectWorkerImage);

    const [offerItems, setOfferItems] = useState([]);

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
                            <Button variant="outline-dark" onClick={() => RequestsStatisticsComponent(offerItems)}>Generuoti darbų ataskaitą</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Mokėjimai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => PaymentStatisticsComponent(offerItems)}>Generuoti mokėjimų ataskaitą</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Naudotojai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={() => UserStatisticsComponent(offerItems)}>Generuoti naudotojų ataskaitą</Button>
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