import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {auth, db} from "../../firebase";
import history from "../../history";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";

import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from  "react-datepicker";
import lt from 'date-fns/locale/lt';
import {useDispatch, useSelector} from "react-redux";
import {selectModalError, selectUserEmail, sendModalError} from "../../features/user/userSlice";
import {locations} from "./locations";
// @ts-ignore
import {v4 as uuid} from "uuid";
import ModalNotificationComponent from "../main_page/ModalNotificationComponent";
registerLocale('lt', lt)

interface Props {
    show: boolean,
    onHide: () => void,
    item: any
}

const ComfirmReservationModalComponent = (props: Props) => {

    const [reservedTimeDay, setReservedTimeDay] = useState(new Date());
    const [reservedTimeHour, setReservedTimeHour] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [timeForOffer, setTimeForOffer] = useState(0);
    const [docId, setDocId] = useState("");
    const userEmail = useSelector(selectUserEmail);

    useEffect( () => {
        db.collection("users").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                    setDocId(doc.id);
                    setName(doc.data()?.nameAndSurname);
                    setPhoneNumber(doc.data()?.phoneNumber);
            })
    }, []);

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

    const [location, setLocation] = useState("Akmen??");

    const handleLocationChange = (event: any) => {
        setLocation(event.target.value)
    }

    const [address, setAddress] = useState("");

    const handleAddressChange = (event: any) => {
        setAddress(event.target.value)
    }
    const error = useSelector(selectModalError);
    const dispatch = useDispatch();

    const sendConfirmationForOffer = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if(address !== "" && location !== "" && reservedTimeDay !== null && reservedTimeHour !== null) {
            const confirm = window.confirm("Patvirtinti?");
            if (confirm) {
                const id = uuid();
                await db.collection("reservedOffers").add({
                    status: "rezervuotas",
                    price: props.item.price,
                    user: props.item.user,
                    userMail: props.item.userMail,
                    username: props.item.username,
                    profileImage: props.item.profileImage,
                    title: props.item.title,
                    description: props.item.description,
                    reservedDay: reservedTimeDay.toISOString(),
                    reservedHour: reservedTimeHour,
                    reservedUser: auth.currentUser?.uid,
                    reservedUserEmail: userEmail,
                    paymentStatus: "Neatliktas",
                    reservedUserNameAndSurname: name,
                    reservedUserPhoneNumber: phoneNumber,
                    phoneNumber: props.item.phoneNumber,
                    nameAndSurname: props.item.nameAndSurname,
                    location: location,
                    address: address,
                    id: id,
                    experienceLevel: props.item.experienceLevel,
                    activity: props.item.activity,

                }).then(async (docRef) => {
                    await db.collection("offerReview").doc(docRef.id).set({
                        progressRating: 0,
                        comments: []
                    })
                })
                await history.go(0);
            }
        } else {
                dispatch(sendModalError("Nepalikite tu????i?? lauk??"));
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
                    Nurodyti norim?? laik??
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <ModalNotificationComponent message={error} />
                    <Form.Group controlId="Select3">
                        <label htmlFor="location2" style={{marginRight: "1rem"}}>Paslaugos atlikimo vieta:</label>
                        <select name="location2" value={location} onChange={handleLocationChange} required>
                            {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="address">
                        <Form.Label>Adresas</Form.Label>
                        <Form.Control type="text" placeholder="??veskite tiksl?? vietov??s adres??" value={address} onChange={handleAddressChange}/>
                    </Form.Group>
                    {/*@ts-ignore*/}
                    <DatePicker locale="lt" selected={reservedTimeDay} onChange={(date):any => setReservedTimeDay(date)} />
                    {/*@ts-ignore*/}
                    <TimePicker locale="sv-sv" disableClock={true} hourPlaceholder="hh" minutePlaceholder={"mm"} value={reservedTimeHour} onChange={setReservedTimeHour} />

                    <Button variant="outline-dark" onClick={(event) => sendConfirmationForOffer(event)}>Patvirtinti</Button>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>U??daryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ComfirmReservationModalComponent;