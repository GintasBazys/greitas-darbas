import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {locations} from "../locations";
import history from "../../../history";
import store from "../../../app/store";
import {
    setFilteredCategory,
    setFilteredExperience,
    setFilteredLocation,
    setFilteredPrice,
    setFilteredStatus
} from "../../../features/filter/offersInProgressFilterSlice";
import {activities2} from "../registration/activities2";
import {experienceLevels2} from "../registration/experienceLevel2";
import {useDispatch, useSelector} from "react-redux";
import {selectModalError, sendModalError} from "../../../features/user/userSlice";
import ModalNotificationComponent from "../../main_page/ModalNotificationComponent";

interface Props {
    show: boolean,
    onHide: () => void,
}

const FilterOffersInProgressModalComponent = (props: Props) => {

    const [category, setCategory] = useState("Klientų aptarnavimas");
    const [experience, setExperience] = useState("Pradedantysis");
    const [price, setPrice] = useState("Kaina (didėjančiai)");
    const [location, setLocation] = useState("Akmenė");
    const [status, setStatus] = useState("rezervuotas");

    const handlePriceChange = (event: any) => {
        setPrice(event.target.value)
    }
    const handleLocationChange = (event: any) => {
        setLocation(event.target.value)
    }
    const handleStatusChange = (event: any) => {
        setStatus(event.target.value)
    }
    const handleCategoryChange = (event: any) => {
        setCategory(event.target.value)
    }

    const handleExperienceChange = (event: any) => {
        setExperience(event.target.value)
    }
    const error = useSelector(selectModalError);
    const dispatch = useDispatch();

    const filter = async () => {
        if(category !== "-" && experience !== "-" && price !== "-" && location !== "-" && status !== "-") {
            await store.dispatch(setFilteredCategory(category));
            await store.dispatch(setFilteredExperience(experience));
            await store.dispatch(setFilteredPrice(price));
            await store.dispatch(setFilteredLocation(location));
            await store.dispatch(setFilteredStatus(status));
            await history.push("/paslauga/progresas/filtravimas");
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
                        <Form.Group controlId="experience">
                            <label style={{marginRight: "1rem"}} htmlFor="location">Patirtis:</label>
                            <select name="experience" value={experience} onChange={handleExperienceChange} required>
                                {experienceLevels2.map((item: React.ReactNode) => <option>{item}</option>)}
                            </select>
                        </Form.Group>
                        <Form.Group controlId="price">
                            <label style={{marginRight: "1rem"}} htmlFor="price">Kaina:</label>
                            <select name="location" value={price} onChange={handlePriceChange} required>
                                <option>Kaina (didėjančiai)</option>
                                <option>Kaina (mažėjančiai)</option>
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
                            <select name="status" value={status} onChange={handleStatusChange} required>
                                <option>rezervuotas</option>
                                <option>Vykdomas</option>
                                <option>Atliktas</option>
                                <option>Atidėtas</option>
                                <option>Laukiama mokėjimo</option>
                                <option>Atšauktas naudotojo</option>
                                <option>Atšauktas teikėjo</option>
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

export default FilterOffersInProgressModalComponent