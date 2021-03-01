import React from "react";
import {Button, Navbar, NavDropdown, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectWorker, logout} from "../../features/worker/workerSlice";

// @ts-ignore
const AdministratorDashboardNavbar = ({profileImage}) => {

    const dispatch = useDispatch();
    const user = useSelector(selectWorker);

    return (
        <div>
            <Navbar bg="dark" expand="lg" className=" py-0 sticky-top dashboard-nav-width" variant="dark">
                <Navbar.Brand><Link to="/administracija" className="admin-navbar-brand">Pradžia</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">

                    <Link to="/administracija/naudotojai" className="admin-navbar-link">Naudotojų valdymas</Link>
                    <Link to="/administracija/darbuotojai" className="admin-navbar-link">Darbuotojų valdymas</Link>
                    <Link to="/administracija/pasiulymai" className="admin-navbar-link">Darbo pasiūlymų peržiūra </Link>
                    <Link to="/administracija/mokejimai" className="admin-navbar-link">Mokėjimų peržiūra </Link>

                    <NavDropdown
                        title={<div><Image src={profileImage} alt="user pic" roundedCircle className="dashboard-profile-image"/>
                            <span className="dashboard-user-margin">{user}</span>
                        </div>
                        }
                        id="basic-nav-dropdown">
                        <Link to="/administracija/profilis" className="dropdown-menu-item">Profilis</Link>
                        <Button variant="link" type="submit" className="dropdown-menu-item" onClick={() => dispatch(logout())}>
                            Atsijungti
                        </Button>
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default AdministratorDashboardNavbar;