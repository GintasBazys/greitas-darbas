import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {db} from "../../firebase";
import {selectError, sendError} from "../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {updateOffer} from "../../features/offers/offersSlice";
import history from "../../history";
import ModalNotificationComponent from "../main_page/ModalNotificationComponent";
import {locations} from "./locations";
import {days} from "./days";

interface Props {
    show: boolean,
    onHide: () => void,
    item: any
}

const OffersUpdateModalComponent = (props: Props) => {

    const [activityType, setActivityType] = useState("Veikla nenurodyta");
    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [isRemote, setIsRemote] = useState(false);
    const [title, setTitle] = useState("");
    const previousTitle = props.item.title;
    const [availability, setAvailability] = useState([]);

    const dispatch = useDispatch();

    useEffect( () => {
        db.collection("offers").where("title", "==", props.item.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setActivityType(doc.data()?.activityType);
                    setDescription(doc.data()?.description);
                    setPhoneNumber(doc.data()?.phoneNumber);
                    setLocation(doc.data()?.location);
                    setPrice(doc.data()?.price)
                    setTitle(doc.data()?.title);
                    setAvailability(doc.data()?.availability)
                })
            })
    }, [])

    const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        if(event.target.value.length >= 101) {
            dispatch(sendError("Ne daugiau 500 simboliu"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);
        }else{
            setDescription(event.target.value)
        }

    }

    const handlePhoneNumberChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        if(isNaN(Number(event.target.value))) {
            dispatch(sendError("Iveskite tik skaičius"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);
        }else{
            setPhoneNumber(event.target.value)
        }

    }

    const handleLocationChange = (event: any) => {
        setLocation(event.target.value)
    }

    const handlePriceChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPrice(event.target.value)
    }

    const handleTitleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(event.target.value)
    }

    const handleAvailabilityChange = (event: any) => {
        // @ts-ignore
        let value = Array.from(event.target.selectedOptions, option => option.value);
        // @ts-ignore
        setAvailability(value)
        console.log(value)
    }

    const errorMessage = useSelector(selectError);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        //todo istestuoti laukus kad nepraleistu netinkamo formato
            event.preventDefault();
        if(description !== "" && phoneNumber !== "" && location !== "" && price !== "" && title !== "") {

            await dispatch(updateOffer({
                activityType: activityType,
                description: description,
                phoneNumber: phoneNumber,
                location: location,
                price: price,
                isRemote: isRemote,
                title: title,
                availability: availability,
                previousTitle: previousTitle
            }))
            props.onHide();
        }
        else {
            dispatch(sendError("Nepalikite tuščių laukų"))
            setTimeout(() => {
                dispatch(sendError(""))
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
                    Atnaujinti informaciją
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalNotificationComponent message={errorMessage} />
                <Form>
                <Form.Group controlId="title">
                    <Form.Label>Pavadinimas</Form.Label>
                    <Form.Control type="text" placeholder="Įveskite paslaugos pavadinima" value={title} onChange={handleTitleChange}/>
                </Form.Group>
                <Form.Group controlId="textarea">
                    <Form.Label>Aprašymas</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Aprašykite savo siūlomą paslaugą" value={description} onChange={handleDescriptionChange}/>
                </Form.Group>
                <Form.Group controlId="tel">
                    <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                    <Form.Control type="tel" value={phoneNumber} onChange={handlePhoneNumberChange}/>
                </Form.Group>
                    <Form.Group controlId="Select3">
                        <label htmlFor="location2" style={{marginRight: "1rem"}}>Vietovė:</label>
                        <select name="location2" value={location} onChange={handleLocationChange} required>
                            {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Kaina</Form.Label>
                        <Form.Control type="text" placeholder="Įveskite paslaugos kainą naudojant valandinį tarifą" value={price} onChange={handlePriceChange}/>
                    </Form.Group>
                    <Form.Group controlId="Select4">
                        <label htmlFor="availability2" style={{marginRight: "1rem"}}>Pasiekiamumas:</label>
                        <select multiple={true} name="availability2" value={availability.map(availability => availability)} onChange={handleAvailabilityChange} required>
                            {days.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                <Form.Group controlId="checkbox">
                    <Form.Check type="checkbox" label="Paslauga teikiama nuotoliniu būdu?" checked={isRemote}
                                onChange={() => setIsRemote(!isRemote)}/>
                </Form.Group>

                    <Button variant="primary" type="submit" onClick={(event) => handleSubmit(event)}>
                        Patvirtinti pakeitimus
                    </Button>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default OffersUpdateModalComponent;