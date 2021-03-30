import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectWorker} from "../../features/worker/workerSlice";
import {Button, Image, Navbar, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";

// @ts-ignore
const ClientManagerNavbarComponent = ({profileImage}) => {

    const dispatch = useDispatch();
    const user = useSelector(selectWorker);

    return (
        <div>
            <Navbar bg="dark" expand="lg" className=" py-0 sticky-top dashboard-nav-width" variant="dark">
                <Navbar.Brand><Link to="/darbuotojai" className="admin-navbar-brand">Pradžia</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">

                    <Link to="/darbuotojai/paslauga" className="admin-navbar-link">Siūlomų paslaugų peržiūra </Link>
                    <Link to="/darbuotojai/pasiulymai" className="admin-navbar-link">Siūlomų darbų peržiūra </Link>
                    <Link to="/darbuotojai/mokejimai" className="admin-navbar-link">Mokėjimų peržiūra </Link>
                    <Link to="/darbuotojai/statstika" className="admin-navbar-link">Statistika </Link>

                    <NavDropdown
                        title={<div><Image src={profileImage} alt="user pic" roundedCircle className="dashboard-profile-image"/>
                            <span className="dashboard-user-margin">{user}</span>
                        </div>
                        }
                        id="basic-nav-dropdown">
                        <Link to="/darbuotojai/profilis" className="dropdown-menu-item">Profilis</Link>
                        <Button variant="link" type="submit" className="dropdown-menu-item" onClick={() => dispatch(logout())}>
                            Atsijungti
                        </Button>
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default ClientManagerNavbarComponent;