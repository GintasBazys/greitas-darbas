import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {db} from "../../firebase";
import {selectError, sendError} from "../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {updateOffer} from "../../features/offers/offersSlice";
import ModalNotificationComponent from "../main_page/ModalNotificationComponent";
import {locations} from "./locations";

interface Props {
    show: boolean,
    onHide: () => void,
    item: any
}

const OffersUpdateModalComponent = (props: Props) => {

    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [isRemote, setIsRemote] = useState(false);
    const [title, setTitle] = useState("");
    const previousTitle = props.item.title;

    const dispatch = useDispatch();

    useEffect( () => {
        db.collection("offers").where("title", "==", props.item.title).limit(1).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setDescription(doc.data()?.description);
                    setPhoneNumber(doc.data()?.phoneNumber);
                    setLocation(doc.data()?.location);
                    setPrice(doc.data()?.price)
                    setTitle(doc.data()?.title);
                })
            })
    }, [])

    const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        if(event.target.value.length >= 500) {
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
            dispatch(sendError("Iveskite tik skai??ius"));
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

    const errorMessage = useSelector(selectError);

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
            event.preventDefault();
        if(description !== "" && phoneNumber !== "" && location !== "" && price !== "" && title !== "") {

            await dispatch(updateOffer({
                description: description,
                phoneNumber: phoneNumber,
                location: location,
                price: price,
                isRemote: isRemote,
                title: title,
                previousTitle: previousTitle
            }))
            props.onHide();
        }
        else {
            dispatch(sendError("Nepalikite tu????i?? lauk??"))
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
                    Atnaujinti informacij??
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalNotificationComponent message={errorMessage} />
                <Form>
                <Form.Group controlId="title">
                    <Form.Label>Pavadinimas</Form.Label>
                    <Form.Control type="text" placeholder="??veskite paslaugos pavadinima" value={title} onChange={handleTitleChange}/>
                </Form.Group>
                <Form.Group controlId="textarea">
                    <Form.Label>Apra??ymas</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Apra??ykite savo si??lom?? paslaug??" value={description} onChange={handleDescriptionChange}/>
                </Form.Group>
                <Form.Group controlId="tel">
                    <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                    <Form.Control type="tel" value={phoneNumber} onChange={handlePhoneNumberChange}/>
                </Form.Group>
                    <Form.Group controlId="Select3">
                        <label htmlFor="location2" style={{marginRight: "1rem"}}>Vietov??:</label>
                        <select name="location2" value={location} onChange={handleLocationChange} required>
                            {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Valandin?? kaina</Form.Label>
                        <Form.Control type="text" placeholder="??veskite paslaugos kain?? naudojant valandin?? tarif??" value={price} onChange={handlePriceChange}/>
                    </Form.Group>
                <Form.Group controlId="checkbox">
                    <Form.Check type="checkbox" label="Paslauga teikiama nuotoliniu b??du?" checked={isRemote}
                                onChange={() => setIsRemote(!isRemote)}/>
                </Form.Group>

                    <Button variant="primary" type="submit" onClick={(event) => handleSubmit(event)}>
                        Patvirtinti pakeitimus
                    </Button>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>U??daryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default OffersUpdateModalComponent;