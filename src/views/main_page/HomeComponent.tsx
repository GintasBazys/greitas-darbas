import React from "react";
import {Button} from "react-bootstrap";
import main2 from "../../assets/main_2.svg";
import FooterComponent from "./FooterComponent";
import NavbarComponent from "./NavbarComponent";
import history from "../../history";

const HomeComponent = () => {

    const handleChangePage = () => {
        history.push("/prisijungti")
    }

    return <div className="content-show">
        <NavbarComponent />
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>Sveiki atvykę į paslaugų dalijimosi platformą - Greitos paslaugos</h1>
            <img style={{marginTop: "1.5rem", height: "auto", maxWidth: "100%"}} src={main2} alt="Main picture"/>
            <h3 style={{textAlign: "center", marginTop: "30px", marginBottom: "30px"}}>Ieškokite įvairių sričių profesionalų, sūlykite savo paslaugas. Visi mokėjimai atliekami tik sistemoje.</h3>
            <Button variant="outline-dark" className="btn-lg" onClick={() => handleChangePage()}> Pradeti</Button>
        </div>
        <div>
        </div>
        <FooterComponent />
    </div>

}

export default HomeComponent;