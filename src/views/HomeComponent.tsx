import React from "react";
import {Button} from "react-bootstrap";
import history from "../history";
import main2 from "../assets/main_2.svg";

const HomeComponent = () => {


    const handleChangePage = () => {
        history.push("/login")
    }

    return <div className="content-show">
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h1>
            {/*<img style={{marginTop: "1.5rem"}} src={mainPicture}/>*/}
            <img style={{marginTop: "1.5rem", width: "700px"}} src={main2} alt="Main picture"/>
            <h3 style={{textAlign: "center", marginTop: "30px", marginBottom: "30px"}}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h3>
            <Button variant="outline-dark" className="btn-lg" onClick={() => handleChangePage()}> Get started</Button>
        </div>
    </div>

}

export default HomeComponent;