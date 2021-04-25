import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectWorker} from "../../features/worker/workerSlice";
import {Button, Dropdown, DropdownButton, Image, Navbar, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import history from "../../history";

// @ts-ignore
const ClientManagerNavbarComponent = ({profileImage}) => {

    const dispatch = useDispatch();
    const user = useSelector(selectWorker);

    return (
        <div>
            <Navbar bg="light" expand="lg" className=" py-0 sticky-top dashboard-nav-width" variant="light">
                <Navbar.Brand><Link to="/darbuotojas/pagrindinis" className="admin-navbar-brand">Pradžia</Link></Navbar.Brand>
                <DropdownButton style={{marginLeft: "10rem"}} variant="outline-info" id="dropdown-basic-button3" title="Papildomi pasirinkimai">
                    <Dropdown.Item onClick={() => history.push("/darbuotojas/paslauga")}>Paslaugos</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/darbuotojas/pasiulymai")}>Darbo skelbimai</Dropdown.Item>
                </DropdownButton>
                <div style={{marginLeft: "20rem"}}>
                    <Image src={profileImage} alt="user pic" roundedCircle className="dashboard-profile-image"/>
                </div>
                <DropdownButton variant="outline-success" id="dropdown-basic-button4" title="Profilis">
                    <Dropdown.Item onClick={() => history.push("/darbuotojas/profilis")}>Profilis</Dropdown.Item>
                    <Dropdown.Item onClick={() => dispatch(logout())}>Atsijungti</Dropdown.Item>
                </DropdownButton>
            </Navbar>
        </div>
    )
}

export default ClientManagerNavbarComponent;