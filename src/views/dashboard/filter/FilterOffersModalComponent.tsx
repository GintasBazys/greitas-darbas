import React from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {locations} from "../locations";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";

interface Props {
    show: boolean,
    onHide: () => void,
}

const FilterOffersModalComponent = (props: Props) => {
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
                 <p>Kategorija: </p>
                 <p>Patirtis: </p>
                 <p>Reitingas: </p>
                 <p>Kaina: </p>
                 <p>Vietovė:</p>
             </div>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FilterOffersModalComponent;