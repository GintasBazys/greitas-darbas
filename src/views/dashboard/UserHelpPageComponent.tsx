import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import help from "../../assets/help.svg";
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap";
import HelpPageInformationModal from "./HelpPageInformationModal";

const UserHelpPageComponent = () => {

    const image = useSelector(selectImage);

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow)
    }

    const email = "pagalba@greitas.lt";

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={3} className="d-flex align-items-center justify-content-center">
                        {/*@ts-ignore*/}
                        <Card bg={"dark"} text={"white"} style={{ width: '18rem', marginLeft: "5px"}}>
                            <Card.Body>
                                <Card.Title className="center-element">Informacija ir D.U.K</Card.Title>
                                <Card.Text>
                                    <Button className="center-element" onClick={() => handleModalShow()}>Peržiūrėti</Button>
                                    <HelpPageInformationModal show={modalShow} onHide={() => handleModalShow()} />
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <h1 className="center-element">Pagalba</h1>
                        <Image className="center-element" width="60%" height="60%" src={help} />
                    </Col>
                    <Col md={3} className="d-flex align-items-center justify-content-center">
                        <Card bg={"dark"} text={"white"} style={{ width: '18rem', marginLeft: "5px"}}>
                            <Card.Body>
                                <Card.Title className="center-element">Kontaktai</Card.Title>
                                <Card.Text>
                                    <a href={`mailto:${email}`} className="btn btn-primary center-element">Susisiekti</a>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserHelpPageComponent;