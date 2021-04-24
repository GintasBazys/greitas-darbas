import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectWorkerImage, signUpWorkerAsync} from "../../features/worker/workerSlice";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {Container, Row, Col, Form, Button} from "react-bootstrap";
import history from "../../history";
import {locations} from "../dashboard/locations";
import {sendError} from "../../features/user/userSlice";

const AdministratorWorkerManagementComponent = () => {

    const image = useSelector(selectWorkerImage);
    const dispatch = useDispatch();

    const [newUserEmail, setnewUserEmail] = useState("");
    const [newPassword, setNewPassword] = useState("")
    const [newUsername, setNewUsername] = useState("")
    const [nameAndSurname, setNameAndSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("+3706");
    const [location, setLocation] = useState("");


    const handleNewEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setnewUserEmail(event.target.value)
    }

    const handleNewPasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewPassword(event.target.value)
    }

    const handleNewUserNameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewUsername(event.target.value)
    }

    const handleNameAndSurnameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNameAndSurname(event.target.value)
    }

    const handlePhoneNumberChange = (event: any) => {
        if(isNaN(Number(event.target.value))) {
            dispatch(sendError("Iveskite tik skaičius"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);
        }else{
            setPhoneNumber(event.target.value)
        }

    }

    const handleLocationChange = (event: any) => {
        setLocation(event.target.value)
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if(newUsername !== "" || newPassword !== "" || newUserEmail !== "") {
            await dispatch(signUpWorkerAsync({username: newUsername, email: newUserEmail, password: newPassword, nameAndSurname: nameAndSurname, location: location, phoneNumber: phoneNumber}))
            await history.push("/administracija");
        }

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
                            <Form.Group controlId="newName">
                                <Form.Label>Vardas Pavardė</Form.Label>
                                <Form.Control type="text" value={nameAndSurname} autoComplete="on" autoFocus placeholder="Įveskite darbuotojo vardą ir pavardę" onChange={handleNameAndSurnameChange}/>
                            </Form.Group>

                            <Form.Group controlId="newemail">
                                <Form.Label>El. pašto adresas</Form.Label>
                                <Form.Control type="text" value={newUserEmail} autoComplete="on" placeholder="Įveskite el. pašto adresą" autoFocus onChange={handleNewEmailChange} />
                            </Form.Group>

                            <Form.Group controlId="newpassword">
                                <Form.Label>Slaptažodis</Form.Label>
                                <Form.Control type="password" value={newPassword} autoComplete="on" placeholder="Įveskite slaptažodį" autoFocus onChange={handleNewPasswordChange}/>
                            </Form.Group>
                            <Form.Group controlId="tel">
                                <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                                <Form.Control type="tel" value={phoneNumber} onChange={handlePhoneNumberChange}/>
                            </Form.Group>
                            <Form.Group controlId="Select3">
                                <label htmlFor="location2" style={{marginRight: "1rem"}}>Miestas:</label>
                                <select name="location2" value={location} onClick={handleLocationChange}>
                                    {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                                </select>
                            </Form.Group>

                            <div className="text-center">
                                <Button variant="outline-dark" type="submit" onClick={(e) => handleSubmit(e)}>
                                    Sukurti naują darbuotojo paskyrą
                                </Button>
                            </div>
                        </Form>
                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default AdministratorWorkerManagementComponent;