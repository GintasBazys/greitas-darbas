import React from "react";
import "filepond/dist/filepond.min.css";
import "filepond/dist/filepond.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import {auth, storageRef} from "../../firebase";
import {useDispatch, useSelector} from "react-redux";
import {
    logout,
    selectError,
    selectImage,
} from "../../features/user/userSlice";
import history from "../../history";
import welcome from "../../assets/sveiki_atvyke.svg";
import {Link} from "react-router-dom";
import NotificationComponent from "../main_page/NotificationComponent";

const DashboardComponent = () => {

    const dispatch = useDispatch();

    const error = useSelector(selectError);

    const image = useSelector(selectImage);

    window.addEventListener('popstate', function(event) {
        history.go(1);
    });

    const handleWorkerRegister = () => {
        history.push("/pradzia/darbuotojas")
    }

    const handleUserRegister = () => {
        history.push("/pradzia/naudotojas")
    }

    return (
        <div>
            <Container fluid>

                <Row>
                    <Col md={3}>
                        <div className="center">
                            <Link to="/pradzia/profilis"><h1>Peržiūrėti profilį</h1></Link>
                            <Image src={image} alt="profilis" />
                        </div>

                    </Col>

                    <Col md={6} style={{textAlign: "center"}}>
                        <Image src={welcome} alt="Sveiki atvyke" height="40%" />
                        <NotificationComponent message={error} />
                        <div style={{marginTop: "2rem"}} className="center-element">
                            <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={handleWorkerRegister}>Noriu teikti paslaugas</Button>
                            <Button variant="outline-primary" onClick={handleUserRegister}>Šiuo metu nenoriu teikti paslaugų</Button>
                        </div>
                        <Button style={{marginTop: "2rem"}} variant="outline-info" className="btn-lg center-element" onClick={() => dispatch(logout())}> Atsijungti</Button>
                    </Col>

                    <Col md={3}>
                        <div className="center">
                            <Link to="/pagalba"><h1>Pagalba</h1></Link>
                        </div>

                    </Col>

                </Row>
            </Container>
        </div>
    )
}

export default DashboardComponent;