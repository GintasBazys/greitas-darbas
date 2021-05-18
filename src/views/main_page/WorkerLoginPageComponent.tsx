import React from "react";
import {Button, Container, Form, Row, Col} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import NavbarComponent from "./NavbarComponent";
import login from "../../assets/login.svg";
import FooterComponent from "./FooterComponent";
import history from "../../history";
import {selectWorkerError, changeWorkerRemember} from "../../features/worker/workerSlice";
import WorkerNotificationComponent from "./WorkerNotificationComponent";

const WorkerLoginPageComponent = (props: any) => {
    const dispatch = useDispatch();
    let errorMessage = useSelector(selectWorkerError);


    const handleLoginPageChange = () => {
        history.go(-1);
    }

    return (
        <div className="content-show">
            <NavbarComponent/>
            <Container fluid>
                <div>
                    <Row>
                        <Col md={6} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <img src={login} style={{width: "calc(100vh - 96px)", marginTop: "100px", height: "auto", maxWidth: "100%"}} alt="login picture"/>
                        </Col>
                        <Col md={6} className="login-form">
                            <Form onSubmit={props.handleSubmit} style={{width: "75%"}}>
                                <WorkerNotificationComponent message={errorMessage} />
                                <Form.Group controlId="email">
                                    <Form.Label>El. pašto adresas</Form.Label>
                                    <Form.Control type="email" placeholder="Įveskite el. pašto adresą" value={props.email} autoComplete="on"
                                                  onChange={props.handleEmailChange}/>
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Slaptažodis</Form.Label>
                                    <Form.Control type="password" placeholder="Įveskite slaptažodį" autoComplete="on" value={props.password}
                                                  onChange={props.handlePasswordChange}/>
                                </Form.Group>
                                <Form.Group controlId="checkbox">
                                    <Form.Check type="checkbox" label="Išlikti prisijungus" checked={props.checkedUser}
                                                onChange={() => dispatch(changeWorkerRemember(!props.checkedUser))}/>
                                </Form.Group>
                                <Button variant="outline-dark" type="submit" style={{marginRight: "2rem"}}>
                                    Prisijungti
                                </Button>
                                <Button variant="outline-dark" onClick={() => handleLoginPageChange()}>Grįžti atgal</Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Container>
            <FooterComponent/>
        </div>
    )
}

export default WorkerLoginPageComponent;