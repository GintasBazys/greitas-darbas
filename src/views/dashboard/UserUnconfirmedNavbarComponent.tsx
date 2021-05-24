import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectUser} from "../../features/user/userSlice";
import {Button, Image, Navbar, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";

// @ts-ignore
const UserUnconfirmedNavbarComponent = ({profileImage}) => {

    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    return (
        <div>
            <Navbar bg="dark" expand="lg" className=" py-0 sticky-top dashboard-nav-width" variant="dark">
                <Navbar.Brand ><Link to="/pradzia" className="admin-navbar-brand" style={{color: "white", fontWeight: "bold"}}>Pradžia</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">

                    <NavDropdown
                        title={<div><Image src={profileImage} alt="user pic" roundedCircle className="dashboard-profile-image"/>
                            <span className="dashboard-user-margin" style={{color: "white", fontWeight: "bold"}}>{user}</span>
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

export default UserUnconfirmedNavbarComponent;