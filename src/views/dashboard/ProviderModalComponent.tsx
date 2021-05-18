import React, {useState} from "react";
import {Button, Form, Image, Modal} from "react-bootstrap";
import {activities} from "./registration/activities";
import {experienceLevels} from "./registration/experienceLevel";
import {auth, db} from "../../firebase";
import history from "../../history";

interface Props {
    show: boolean,
    onHide: () => void,
}

const ProviderModalComponent = (props: Props) => {

    const [activity, setActivity] = useState("Klientų aptarnavimas");
    const [experienceLevel, setExperienceLevel] = useState("Pradedantysis");

    const handleActivityChange = (event: any) => {
        setActivity(event.target.value)
    }

    const handleExperienceChange = (event: any) => {
        setExperienceLevel(event.target.value)
    }

    const confirmProviderAccountCreation = async () => {
        const response = window.confirm("Patvirtinti?");
        if (response) {
            await db.collection("users").doc(auth.currentUser?.uid).update({
                status: "nepatvirtintas_darbuotojas",
                activity: activity,
                experienceLevel: experienceLevel
            })
            await history.go(0);
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
                    Įvesti papildomą informaciją reikalingą paslaugų teikėjo paskyrai
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="activity">
                        <label htmlFor="activity" style={{marginRight: "1rem"}}>Veikla:</label>
                        <select name="activity" value={activity} onChange={handleActivityChange} required>
                            {activities.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="experience">
                        <label htmlFor="experience" style={{marginRight: "1rem"}}>Patirtis:</label>
                        <select name="location" value={experienceLevel} onChange={handleExperienceChange} required>
                            {experienceLevels.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                    <div className="center-element">
                        <Button variant="outline-dark" onClick={confirmProviderAccountCreation}>Patvirtinti teikimą?</Button>
                    </div>
                    <div style={{marginTop: "2rem"}} className="alert alert-danger center-element" role="alert">
                        <p>Kol duomenys bus tvirtinami, negalėsite naudotis paskyra</p>
                    </div>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ProviderModalComponent;