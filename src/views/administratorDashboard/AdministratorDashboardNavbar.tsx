import React from "react";
import {Button, Navbar, NavDropdown, Image, DropdownButton, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectWorker, logout} from "../../features/worker/workerSlice";
import history from "../../history";

// @ts-ignore
const AdministratorDashboardNavbar = ({profileImage}) => {

    const dispatch = useDispatch();
    const user = useSelector(selectWorker);

    return (
        <div>
            <Navbar bg="light" expand="lg" className=" py-0 sticky-top dashboard-nav-width" variant="light">
                <Navbar.Brand><Link to="/administracija" className="admin-navbar-brand">Pradžia</Link></Navbar.Brand>
                <DropdownButton style={{marginLeft: "10rem"}} variant="outline-primary" id="dropdown-basic-button" title="Naudotojų valdymas">
                    <Dropdown.Item onClick={() => history.push("/administracija/teikejai")}>Paslaugų teikėjų tvirtinimas</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/administracija/naudotojai")}>Paprastų naudotojų tvirtinimas</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/administracija/naudotojai/sarasas")}>Naudotojų sąrašas</Dropdown.Item>
                </DropdownButton>
                <DropdownButton style={{marginLeft: "10rem"}} variant="outline-dark" id="dropdown-basic-button2" title="Darbuotojų valdymas">
                    <Dropdown.Item onClick={() => history.push("/administracija/darbuotojai")}>Naujo darbuotojo pridėjimas</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/administracija/darbuotojai/sarasas")}>Darbuotojų peržiūra</Dropdown.Item>
                </DropdownButton>
                <DropdownButton style={{marginLeft: "10rem"}} variant="outline-info" id="dropdown-basic-button3" title="Papildomi pasirinkimai">
                    <Dropdown.Item onClick={() => history.push("/administracija/mokejimai")}>Mokėjimai</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/administracija/ataskaitos")}>Ataskaitos</Dropdown.Item>
                </DropdownButton>
                <NavDropdown
                    style={{marginLeft: "10rem"}} title={<div><Image src={profileImage} alt="user pic" roundedCircle className="dashboard-profile-image"/>
                    <span className="dashboard-user-margin">{user}</span>
                </div>
                }
                    id="basic-nav-dropdown">
                    <Link to="/administracija/profilis" className="dropdown-menu-item">Profilis</Link>
                    <a className="dropdown-menu-item" onClick={() => dispatch(logout())}>
                        Atsijungti
                    </a>
                </NavDropdown>
            </Navbar>
        </div>
    )
}

export default AdministratorDashboardNavbar;