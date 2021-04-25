import React from "react";
import {Button, Navbar, NavDropdown, Image, DropdownButton, Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, logout} from "../../features/user/userSlice";
import history from "../../history";

// @ts-ignore
const UserNavBarComponent = ({profileImage}) => {

    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    return (
        <div>
            <Navbar bg="light" expand="lg" className=" py-0 sticky-top dashboard-nav-width" variant="light">
                <Navbar.Brand><Link to="/pagrindinis" className="admin-navbar-brand">Pradžia</Link></Navbar.Brand>
                <DropdownButton style={{marginLeft: "10rem"}} variant="outline-primary" id="dropdown-basic-button" title="Darbuotojų paieška">
                    <Dropdown.Item onClick={() => history.push("/paieska/kurimas")}>Kurti darbuotojų paieškos skelbimą</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/paieska/siulymai")}>Darbo pasiūlymų peržiūra</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/paieska/valdymas")}>Darbų valdymas</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/paieska/darbas/mano")}>Mano darbų pasiūlymai</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/paslauga/mano")}>Ginčai</Dropdown.Item>
                </DropdownButton>
                <DropdownButton style={{marginLeft: "10rem"}} variant="outline-dark" id="dropdown-basic-button2" title="Paslaugų paieška">
                    <Dropdown.Item onClick={() => history.push("/siulymas")}>Kurti paslaugos skelbimą</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/paslauga")}>Paslaugų užsakymas</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/vykdymas")}>Vykdomos paslaugos</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/paslauga/mano")}>Mano paslaugos</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/paslauga/mano")}>Ginčai</Dropdown.Item>
                </DropdownButton>
                <DropdownButton style={{marginLeft: "10rem"}} variant="outline-info" id="dropdown-basic-button3" title="Papildomi pasirinkimai">
                    <Dropdown.Item onClick={() => history.push("/zinutes/gauta")}>Gautos žinutės</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/zinutes/issiusta")}>Išsiųstos žinutės</Dropdown.Item>
                    <Dropdown.Item onClick={() => history.push("/mokejimai")}>Mokėjimai</Dropdown.Item>
                </DropdownButton>
                <div style={{marginLeft: "10rem"}}>
                    <Image src={profileImage} alt="user pic" roundedCircle className="dashboard-profile-image"/>
                </div>
                <DropdownButton variant="outline-success" id="dropdown-basic-button4" title="Profilis">
                    <Dropdown.Item onClick={() => history.push("/profilis")}>Profilis</Dropdown.Item>
                    <Dropdown.Item onClick={() => dispatch(logout())}>Atsijungti</Dropdown.Item>
                </DropdownButton>
            </Navbar>
        </div>
    )
}

export default UserNavBarComponent;