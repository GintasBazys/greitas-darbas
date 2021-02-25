import React, {useState} from "react";
import {Button, Container, Form, Row, Col} from "react-bootstrap";
import {changeRemember, selectError} from "../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import NotificationComponent from "./NotificationComponent";
import NavbarComponent from "./NavbarComponent";
import login from "../../assets/login.svg";
import FooterComponent from "./FooterComponent";
import PasswordResetComponent from "./PasswordResetComponent";
import SignUpModalComponent from "./SignUpModalComponent";

const LoginPageComponent = (props: any) => {
    const dispatch = useDispatch();
    let errorMessage = useSelector(selectError);

    const [modalShow, setModalShow] = useState(false);
    const [passwordResetModalShow, setPasswordResetModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow)
    }

    const handleResetPasswordModalShow = () => {
        setPasswordResetModalShow(!passwordResetModalShow)
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
                            <Form onSubmit={props.handleSubmit}>
                                <NotificationComponent message={errorMessage} />
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
                                                onChange={() => dispatch(changeRemember(!props.checkedUser))}/>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Prisijungti
                                </Button>
                                <Button variant="link" onClick={() => handleModalShow()}>
                                    Neturite paskyros?
                                </Button>
                                <Button variant="link" onClick={() => handleResetPasswordModalShow()}>
                                    Pamiršote slaptažodį?
                                </Button>
                            </Form>
                            <PasswordResetComponent show={passwordResetModalShow} onHide={() => handleResetPasswordModalShow()} />
                            <SignUpModalComponent show={modalShow} onHide={() => handleModalShow()} />
                        </Col>
                    </Row>
                </div>
            </Container>
            <FooterComponent/>
        </div>
    )
}

export default LoginPageComponent;