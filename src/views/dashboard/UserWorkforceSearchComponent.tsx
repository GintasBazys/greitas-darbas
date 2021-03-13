import React from "react";
import UserNavBarComponent from "./UserNavbarComponent";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import {Col, Container, Row, Image} from "react-bootstrap";
import {Link} from "react-router-dom";

const UserWorkforceSearchComponent = () => {

    const image = useSelector(selectImage);

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <div>
                            <h1>Nuorodos:</h1>
                            <ul className="list-unstyled">
                                <li><Link to="/paieska/siulymai">Ieškomų darbuotojų peržiūra</Link></li>
                                <li><Link to="/paieka/kurimas">Ieškoti darbuotojų</Link></li>
                            </ul>
                            <Link to="/profilis"><Image style={{marginTop: "2rem"}} fluid src={image} alt="profilio nuotrauka"/></Link>
                        </div>
                    </Col>
                    <Col md={8}>
                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserWorkforceSearchComponent;