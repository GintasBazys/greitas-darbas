import React from "react";
import {Button, Modal} from "react-bootstrap";

interface Props {
    show: boolean,
    onHide: () => void,
}

const FilterOffersInProgressModalComponent = (props: Props) => {
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
                    <p>Statusas:</p>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FilterOffersInProgressModalComponent