import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {experienceLevels} from "../registration/experienceLevel";
import {activities} from "../registration/activities";
import {locations} from "../locations";

interface Props {
    show: boolean,
    onHide: () => void,
}

const FilterOffersInProgressModalComponent = (props: Props) => {

    const [category, setCategory] = useState("-");
    const [experience, setExperience] = useState("-");
    const [rating, setRating] = useState("-");
    const [price, setPrice] = useState("-");
    const [location, setLocation] = useState("-");

    const handleExperienceChange = (event: any) => {
        setExperience(event.target.value)
    }
    const handleCategoryChange = (event: any) => {
        setCategory(event.target.value)
    }
    const handleRatingChange = (event: any) => {
        setRating(event.target.value)
    }
    const handlePriceChange = (event: any) => {
        setPrice(event.target.value)
    }
    const handleLocationChange = (event: any) => {
        setLocation(event.target.value)
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            animation={true}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Filtruoti
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form>
                        <Form.Group controlId="activity">
                            <label style={{marginRight: "1rem"}} htmlFor="location">Veikla:</label>
                            <select name="activity" value={category} onChange={handleCategoryChange} required>
                                {activities.map((item: React.ReactNode) => <option>{item}</option>)}
                            </select>
                        </Form.Group>
                        <Form.Group controlId="experience">
                            <label style={{marginRight: "1rem"}} htmlFor="location">Patirtis:</label>
                            <select name="experience" value={experience} onChange={handleExperienceChange} required>
                                {experienceLevels.map((item: React.ReactNode) => <option>{item}</option>)}
                            </select>
                        </Form.Group>
                        <Form.Group controlId="rating">
                            <label style={{marginRight: "1rem"}} htmlFor="rating">Reitingas:</label>
                            <select name="rating" value={rating} onChange={handleRatingChange} required>
                                <option>Mažesnis nei 5</option>
                                <option>Didesnis nei 5</option>
                                <option>Didesnis nei 8</option>
                                <option>Bet koks vertinimas</option>
                            </select>
                        </Form.Group>
                        <Form.Group controlId="price">
                            <label style={{marginRight: "1rem"}} htmlFor="price">Kaina:</label>
                            <select name="location" value={price} onChange={handlePriceChange} required>
                                <option>Pradžiai mažiausia kaina</option>
                                <option>Pradžiai dižiausia kaina</option>
                            </select>
                        </Form.Group>
                        <Form.Group controlId="location">
                            <label htmlFor="location" style={{marginRight: "1rem"}}>Vietovė:</label>
                            <select name="location" value={location} onChange={handleLocationChange} required>
                                {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                            </select>
                        </Form.Group>
                        <Form.Group controlId="status">
                            <label style={{marginRight: "1rem"}} htmlFor="price">Statusas:</label>
                            <select name="status" value={price} onChange={handlePriceChange} required>
                                <option>Vykdomas</option>
                                <option>Atliktas</option>
                                <option>Atidėtas</option>
                            </select>
                        </Form.Group>
                        <div className="center-element">
                            <Button variant="outline-dark" >Filtruoti</Button>
                        </div>

                    </Form>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FilterOffersInProgressModalComponent