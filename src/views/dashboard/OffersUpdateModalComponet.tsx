import React, {useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {auth, db} from "../../firebase";
import {selectError, sendError} from "../../features/user/userSlice";
import {useDispatch, useSelector} from "react-redux";
import NotificationComponent from "../main_page/NotificationComponent";
import {addOffer, updateOffer} from "../../features/offers/offersSlice";
import history from "../../history";

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

    const handleLocationChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setLocation(event.target.value)
    }

    const handlePriceChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPrice(event.target.value)
    }

    const handleTitleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(event.target.value)
    }

    const errorMessage = useSelector(selectError);

    const handleSubmit = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
                title: title
            }))

            await history.go(0);
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
                <NotificationComponent message={errorMessage} />
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
                <Form.Group controlId="location">
                    <Form.Label>Vietovė</Form.Label>
                    <Form.Control type="text" placeholder="Įveskite esamą darbo vietos adresą" value={location} onChange={handleLocationChange}/>
                </Form.Group>
                <Form.Group controlId="price">
                    <Form.Label>Kaina</Form.Label>
                    <Form.Control type="text" placeholder="Įveskite paslaugos kainą naudojant valandinį tarifą" value={price} onChange={handlePriceChange}/>
                </Form.Group>
                <Form.Group controlId="time">
                    <Form.Label>Trukmė</Form.Label>
                    <Form.Control type="number" placeholder="Įveskite paslaugos trukmę valandomis" value={price} onChange={handlePriceChange}/>
                </Form.Group>
                <Form.Group controlId="availability">
                    <Form.Label>Pasiekiamumas</Form.Label>
                    <Form.Control type="text" placeholder="Pasiekiamumas savaitės dienomis" value={price} onChange={handlePriceChange}/>
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