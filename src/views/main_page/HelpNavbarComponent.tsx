import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import history from "../../history";

const HelpNavbarComponent = () => {
    return (
        <div>
            <Navbar bg="dark" expand="lg" className="sticky-top nav-position" variant="dark">
                <Navbar.Brand><Link to="/" style={{color: "white", textDecoration: "none", marginLeft: "0.5rem"}}>Greitos paslaugos</Link></Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="ml-auto">
                        {history.location.pathname === "/" ? <Link className="nav-link" to="/prisijungti">Prisijungti</Link> : <Link className="nav-link" to="/">Pradžia</Link>}
                        <Link className="nav-link" to="/prisijungti">Registracija</Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default HelpNavbarComponent;