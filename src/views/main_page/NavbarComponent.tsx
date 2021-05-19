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
                        {history.location.pathname === "/" ? <Link className="nav-link" to="/prisijungti">Prisijungti</Link> : <Link className="nav-link" to="/">Pradžia</Link>}
                        <Link className="nav-link" to="/pagalba">Pagalba</Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default NavbarComponent;