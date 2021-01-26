import React from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";
import history from "../../history";

const NavbarComponent = () => {

    return (
        <div>
            <Navbar bg="dark" expand="lg" className="sticky-top nav-position" variant="dark">
                <Navbar.Brand><Link to="/" style={{color: "white", textDecoration: "none", marginLeft: "0.5rem"}}>Greitas darbas</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="ml-auto">
                        {history.location.pathname === "/" ? <Link className="nav-link" to="/login">Login</Link> : <Link className="nav-link" to="/">Home</Link>}
                        <NavDropdown title="More" id="basic-nav-dropdown">
                            <Link to="/help" className="dropdown-menu-item">Help</Link>
                            <Link to="/about" className="dropdown-menu-item">About</Link>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default NavbarComponent;