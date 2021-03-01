import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectWorkerImage, signUpWorkerAsync} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import history from "../../history";
import EmployeeListComponent from "./EmplyeeListComponent";

const AdministratorWorkerManagementComponent = () => {

    const image = useSelector(selectWorkerImage);
    const dispatch = useDispatch();

    const [newUserEmail, setnewUserEmail] = useState("");
    const [newPassword, setNewPassword] = useState("")
    const [newUsername, setNewUsername] = useState("")
    const handleNewEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setnewUserEmail(event.target.value)
    }

    const handleNewPasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewPassword(event.target.value)
    }

    const handleNewUserNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewUsername(event.target.value)
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if(newUsername !== "" || newPassword !== "" || newUserEmail !== "") {
            await dispatch(signUpWorkerAsync({username: newUsername, email: newUserEmail, password: newPassword}))
            await history.push("/administracija");
        }

    }

    const [employeeList, setEmployeeList] = useState(false);

    const handleShowEmployeeList = () => {
        setEmployeeList(!employeeList);
    }

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={2}></Col>
                    <Col md={8}>
                        <Form style={{justifyContent: "center"}}>
                            <Form.Group controlId="newusername">
                                <Form.Label>Vartotojo vardas</Form.Label>
                                <Form.Control type="text" value={newUsername} autoComplete="on" autoFocus placeholder="Įveskite vartotojo vardą" onChange={handleNewUserNameChange}/>
                            </Form.Group>

                            <Form.Group controlId="newemail">
                                <Form.Label>El. pašto adresas</Form.Label>
                                <Form.Control type="text" value={newUserEmail} autoComplete="on" placeholder="Įveskite el. pašto adresą" autoFocus onChange={handleNewEmailChange} />
                            </Form.Group>

                            <Form.Group controlId="newpassword">
                                <Form.Label>Slaptažodis</Form.Label>
                                <Form.Control type="password" value={newPassword} autoComplete="on" placeholder="Įveskite slaptažodį" autoFocus onChange={handleNewPasswordChange}/>
                            </Form.Group>

                            <div className="text-center">
                                <Button variant="outline-dark" type="submit" onClick={(e) => handleSubmit(e)}>
                                    Sukurti naują darbuotojo paskyrą
                                </Button>
                            </div>
                        </Form>
                            <div className="text-center">
                                <Button style={{marginTop: "2rem"}} variant="outline-dark" type="submit" onClick={() => handleShowEmployeeList()}>
                                    Rodyti darbuotojų sąrašą
                                </Button>
                            </div>
                        {
                            employeeList ? <EmployeeListComponent employees={employeeList} setEmployees={setEmployeeList}/> : <div></div>
                        }
                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default AdministratorWorkerManagementComponent;