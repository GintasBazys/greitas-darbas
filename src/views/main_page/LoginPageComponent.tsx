import React from "react";
import {Button, Container, Form, Row, Col} from "react-bootstrap";
import {changeRemember, selectError} from "../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import NotificationComponent from "./NotificationComponent";
import NavbarComponent from "./NavbarComponent";
import login from "../../assets/login.svg";
import FooterComponent from "./FooterComponent";

const LoginPageComponent = (props: any) => {
    const dispatch = useDispatch();
    let errorMessage = useSelector(selectError);

    return (
        <div className="content-show">
            <NavbarComponent/>
            <Container fluid>
                <div>
                    <Row>
                        <Col md={6} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <img src={login} style={{width: "calc(100vh - 96px)", marginTop: "100px"}} alt="login picture"/>
                        </Col>
                        <Col md={6} className="login-form">
                            <Form onSubmit={props.handleSubmit}>
                                <NotificationComponent message={errorMessage} />
                                <Form.Group controlId="email">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" value={props.email} autoComplete="on"
                                                  onChange={props.handleEmailChange}/>
                                    <Form.Text className="text-muted">
                                        We'll never share your email with anyone else.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" autoComplete="on" value={props.password}
                                                  onChange={props.handlePasswordChange}/>
                                </Form.Group>
                                <Form.Group controlId="checkbox">
                                    <Form.Check type="checkbox" label="Keep me logged in" checked={props.checkedUser}
                                                onChange={() => dispatch(changeRemember(!props.checkedUser))}/>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Login
                                </Button>
                                <Button variant="link">
                                    Dont have an account?
                                </Button>
                                <Button variant="link">
                                    Forgot password?
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Container>
            <FooterComponent/>
        </div>
    )
}

export default LoginPageComponent;