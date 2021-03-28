import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {auth, db} from "../../firebase";
import history from "../../history";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import lt from 'date-fns/locale/lt';
registerLocale('lt', lt)

interface Props {
    show: boolean,
    onHide: () => void,
    item: any
}

const ComfirmReservationModalComponent = (props: Props) => {

    const [reservedTimeDay, setReservedTimeDay] = useState(new Date());
    const [reservedTimeHour, setReservedTimeHour] = useState("");
    const [timeForOffer, setTimeForOffer] = useState(0);
    const [docId, setDocId] = useState("");

    useEffect( () => {
        db.collection("offers").where("title", "==", props.item.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setDocId(doc.id);
                })
            })
    }, []);

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow)
    }

    const sendConfirmationForOffer = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        const confirm = window.confirm("Patvirtinti?");
        if (confirm) {
            await db.collection("offers").doc(docId).update({
                status: "patvirtintasTeikejo",
                reservedTimeDay: reservedTimeDay.toISOString(),
                reservedTimeHour: reservedTimeHour,
                timeForOffer: timeForOffer,
                reservedUser: auth.currentUser?.uid
            })
            await props.onHide();
            //await history.go(0);
        }

    }

    // const handleReservedTimeDayChange = (event: any) => {
    //     setReservedTimeDay(event.target.value)
    // }

    const handleChangeTimeForOffer = (event: { target: { value: React.SetStateAction<number>; }; }) => {
        setTimeForOffer(event.target.value);
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
                    Nurodyti paslaugos atlikimo laiką
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="timeOffer">
                        <Form.Label>Laikas, reikalingas paslaugai atlikti. Įveskite valandas(sveikojo skaičio formatu)</Form.Label>
                        {/*@ts-ignore*/}
                        <Form.Control type="number" placeholder="0" value={timeForOffer} onChange={handleChangeTimeForOffer}/>
                    </Form.Group>
                    {/*@ts-ignore*/}
                    <DatePicker locale="lt" selected={reservedTimeDay} onChange={(date):any => setReservedTimeDay(date)} />
                    {/*@ts-ignore*/}
                    <TimePicker locale="sv-sv" disableClock={true} hourPlaceholder="hh" minutePlaceholder={"mm"} value={reservedTimeHour} onChange={setReservedTimeHour} />

                    <Button variant="outline-dark" onClick={(event) => sendConfirmationForOffer(event)}>Patvirtinti</Button>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ComfirmReservationModalComponent;