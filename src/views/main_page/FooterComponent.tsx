import React from "react";
import {Container, Navbar} from "react-bootstrap";

const FooterComponent = () => {
    return (
        <div>
            <Navbar className="footer-copyright fixed-bottom" style={{justifyContent: "center"}}>
                <Container fluid className="footer-text">
                    © {new Date().getFullYear()} | By Gintas Bazys
                </Container>
            </Navbar>
        </div>
    )
}

export default FooterComponent