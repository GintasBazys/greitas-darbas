import React from "react";
import {Button, Navbar, NavDropdown, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, logout} from "../../features/user/userSlice";

// @ts-ignore
const UserNavBarComponent = ({profileImage}) => {

    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    return (
        <div>
            <Navbar bg="dark" expand="lg" className=" py-0 sticky-top dashboard-nav-width" variant="dark">
                <Navbar.Brand><Link to="/pagrindinis" className="admin-navbar-brand">Pradžia</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">

                    <Link to="/pasiulymai" className="admin-navbar-link">Darbo pasiūlymų peržiūra </Link>
                    <Link to="/paieska" className="admin-navbar-link">Darbuotojų paieška </Link>
                    <Link to="/paslauga" className="admin-navbar-link">Siūlomų paslaugų peržiūra </Link>
                    <Link to="/siulymas" className="admin-navbar-link">Siūlomos paslaugos valdymas</Link>
                    <Link to="/mokejimai" className="admin-navbar-link">Mokėjimų peržiūra </Link>
                    <Link to="/zinutes" className="admin-navbar-link">Žinučių peržiūra </Link>
                    <Link to="/atsiliepimai" className="admin-navbar-link">Atsiliepimų peržiūra</Link>

                    <NavDropdown
                        title={<div><Image src={profileImage} alt="user pic" roundedCircle className="dashboard-profile-image"/>
                            <span className="dashboard-user-margin">{user}</span>
                        </div>
                        }
                        id="basic-nav-dropdown">
                        <Link to="/profilis" className="dropdown-menu-item">Profilis</Link>
                        <Button variant="link" type="submit" className="dropdown-menu-item" onClick={() => dispatch(logout())}>
                            Atsijungti
                        </Button>
                    </NavDropdown>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default UserNavBarComponent;