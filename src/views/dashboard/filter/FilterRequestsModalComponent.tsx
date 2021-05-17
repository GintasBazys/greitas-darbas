import React, {useState} from "react";
import store from "../../../app/store";
import {
    setFilteredCategory,
    setFilteredExperience, setFilteredLocation,
    setFilteredPrice, setFilteredRating
} from "../../../features/filter/offersInProgressFilterSlice";
import history from "../../../history";
import {Button, Form, Modal} from "react-bootstrap";
import {activities2} from "../registration/activities2";
import {experienceLevels2} from "../registration/experienceLevel2";
import {locations2} from "../locations2";
import ModalNotificationComponent from "../../main_page/ModalNotificationComponent";
import {selectModalError, sendModalError} from "../../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";

interface Props {
    show: boolean,
    onHide: () => void,
}

const FilterRequestsModalComponent = (props: Props) => {
    const [category, setCategory] = useState("-");
    const [rating, setRating] = useState("-");
    const [budget, setBudget] = useState("-");
    const [location, setLocation] = useState("-");

    const handleCategoryChange = (event: any) => {
        setCategory(event.target.value)
    }
    const handleRatingChange = (event: any) => {
        setRating(event.target.value)
    }
    const handlePriceChange = (event: any) => {
        setBudget(event.target.value)
    }
    const handleLocationChange = (event: any) => {
        setLocation(event.target.value)
    }
    const dispatch = useDispatch();
    const error = useSelector(selectModalError);

    const filter = async () => {
        if(category !== "-" && budget !== "-" && location !== "-" && rating !== "-") {
            await store.dispatch(setFilteredCategory(category));
            await store.dispatch(setFilteredPrice(budget));
            await store.dispatch(setFilteredLocation(location));
            await store.dispatch(setFilteredRating(rating));
            await history.push("/darbas/filtravimas");
        } else {
                dispatch(sendModalError("Nepasirinkote visų kriterijų"));
                setTimeout(() => {
                    dispatch(sendModalError(""))
                }, 2000);
            }
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
                        <ModalNotificationComponent message={error} />
                        <Form.Group controlId="activity">
                            <label style={{marginRight: "1rem"}} htmlFor="location">Veikla:</label>
                            <select name="activity" value={category} onChange={handleCategoryChange} required>
                                {activities2.map((item: React.ReactNode) => <option>{item}</option>)}
                            </select>
                        </Form.Group>
                        <Form.Group controlId="rating">
                            <label style={{marginRight: "1rem"}} htmlFor="rating">Reitingas:</label>
                            <select name="rating" value={rating} onChange={handleRatingChange} required>
                                <option>-</option>
                                <option>-</option>
                                <option>Mažesnis nei 5</option>
                                <option>Didesnis nei 5</option>
                                <option>Didesnis nei 8</option>
                                <option>Bet koks vertinimas</option>
                            </select>
                        </Form.Group>
                        <Form.Group controlId="price">
                            <label style={{marginRight: "1rem"}} htmlFor="price">Biudžetas:</label>
                            <select name="location" value={budget} onChange={handlePriceChange} required>
                                <option>-</option>
                                <option>Kaina (didėjančiai)</option>
                                <option>Kaina (mažėjančiai)</option>
                            </select>
                        </Form.Group>
                        <Form.Group controlId="location">
                            <label htmlFor="location" style={{marginRight: "1rem"}}>Vietovė:</label>
                            <select name="location" value={location} onChange={handleLocationChange} required>
                                {locations2.map((item: React.ReactNode) => <option>{item}</option>)}
                            </select>
                        </Form.Group>
                        <div className="center-element">
                            <Button variant="outline-dark" onClick={filter}>Filtruoti</Button>
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

export default FilterRequestsModalComponent;