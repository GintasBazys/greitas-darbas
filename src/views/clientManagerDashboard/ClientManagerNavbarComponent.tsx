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
                <DropdownButton style={{marginLeft: "10rem"}} variant="outline-primary" id="dropdown-basic-button" title="Paslaugos ir darbai">
                    <Dropdown.Item onClick={() => history.push("/darbuotojas/paslauga")}>Paslaugoss</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/darbuotojas/pasiulymai")}>Darbų skelbimai</Dropdown.Item>
                </DropdownButton>
                <DropdownButton style={{marginLeft: "10rem"}} variant="outline-info" id="dropdown-basic-button3" title="Papildomi pasirinkimai">
                    <Dropdown.Item onClick={() => history.push("/darbuotojas/mokejimai")}>Mokėjimai</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/darbuotojas/ataskaitos")}>Ataskaitos</Dropdown.Item>
                </DropdownButton>
                <NavDropdown
                    style={{marginLeft: "10rem"}} title={<div><Image src={profileImage} alt="user pic" roundedCircle className="dashboard-profile-image"/>
                    <span className="dashboard-user-margin">{user}</span>
                </div>
                }
                    id="basic-nav-dropdown">
                    <Link to="/darbuotojas/profilis" className="dropdown-menu-item">Profilis</Link>
                    <a className="dropdown-menu-item" onClick={() => dispatch(logout())}>
                        Atsijungti
                    </a>
                </NavDropdown>
            </Navbar>
        </div>
    )
}

export default ClientManagerNavbarComponent;