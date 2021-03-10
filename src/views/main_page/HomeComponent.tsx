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
        {/*{items.map((item) => {*/}
        {/*    return <div>{item.username}</div>*/}
        {/*})}*/}
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h1>
            {/*<img style={{marginTop: "1.5rem"}} src={mainPicture}/>*/}
            <img style={{marginTop: "1.5rem", height: "auto", maxWidth: "100%"}} src={main2} alt="Main picture"/>
            <h3 style={{textAlign: "center", marginTop: "30px", marginBottom: "30px"}}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h3>
            <Button variant="outline-dark" className="btn-lg" onClick={() => handleChangePage()}> Pradeti</Button>
        </div>
        <div>
            {/*<Stripe />*/}
        </div>
        <FooterComponent />
    </div>

}

export default HomeComponent;