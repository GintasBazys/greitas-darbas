import React from "react";
import {useSelector} from "react-redux";
import {selectWorkerImage} from "../../features/worker/workerSlice";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import statistics from "../../assets/statistics.svg";
import ClientManagerNavbarComponent from "./ClientManagerNavbarComponent";

const ClientManagerStatisticsComponent = () => {
    const image = useSelector(selectWorkerImage);

    return (
        <div>
            <ClientManagerNavbarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={3}>
                        <h1 className="center-element">Paslaugos</h1>
                        <div className="center-element">
                            <Button variant="outline-dark">Generuoti paslaugų ataskaitą</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Darbai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark">Generuoti darbų ataskaitą</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Mokėjimai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark">Generuoti mokėjimų ataskaitą</Button>
                        </div>
                    </Col>
                    <Col md={3}>
                        <h1 className="center-element">Naudotojai</h1>
                        <div className="center-element">
                            <Button variant="outline-dark">Generuoti naudotojų ataskaitą</Button>
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