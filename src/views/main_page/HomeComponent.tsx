import React from "react";
import {Button} from "react-bootstrap";
import history from "../../history";
import main2 from "../../assets/main_2.svg";
import FooterComponent from "./FooterComponent";
import NavbarComponent from "./NavbarComponent";
import {db} from "../../firebase";
import {usePagination} from "use-pagination-firestore";

const HomeComponent = () => {

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("users")
            .orderBy("username", "asc"),
        {
            limit: 15
        }
    );

    const handleChangePage = () => {
        history.push("/login")
    }

    const nextPage = () => {
        getNext()
        console.log(items)
    }

    const prevPage = () => {
        getPrev()
    }

    return <div className="content-show">
        {

        }
        <NavbarComponent />
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h1>
            {/*<img style={{marginTop: "1.5rem"}} src={mainPicture}/>*/}
            <img style={{marginTop: "1.5rem", width: "700px"}} src={main2} alt="Main picture"/>
            <h3 style={{textAlign: "center", marginTop: "30px", marginBottom: "30px"}}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h3>
            <Button variant="outline-dark" className="btn-lg" onClick={() => handleChangePage()}> Get started</Button>
            <Button variant="outline-dark" className="btn-lg" onClick={() => nextPage()}> Next page</Button>
        </div>
        <FooterComponent />
    </div>

}

export default HomeComponent;