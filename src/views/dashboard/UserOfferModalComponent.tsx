import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {auth, db} from "../../firebase";
import {Button, Form, Image, Modal} from "react-bootstrap";
import {locations} from "./locations";
import {days} from "./days";
import history from "../../history";
import {selectOffer} from "../../features/offers/offersSlice";

interface Props {
    show: boolean,
    onHide: () => void,
}

const UserOfferModalComponent = (props: Props) => {
    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [isRemote, setIsRemote] = useState(false);
    const [title, setTitle] = useState("");
    const [docId, setDocId] = useState("");
    const item = useSelector(selectOffer);
    console.log(item.title);

    //@ts-ignore
    // db.collection("offers").where("title", "==", item.title).limit(1).get()
    //     .then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             console.log(doc.id);
    //             setDescription(doc.data()?.description);
    //             setPhoneNumber(doc.data()?.phoneNumber);
    //             setLocation(doc.data()?.location);
    //             setPrice(doc.data()?.price)
    //             setTitle(doc.data()?.title);
    //             setIsRemote(doc.data()?.isRemote);
    //             setDocId(doc.id);
    //         })
    // })

    const dispatch = useDispatch();

    const reserveOffer = async (event: React.MouseEvent<HTMLElement>) => {
        await db.collection("offers").doc(docId).update({
            status: "rezervuotas",
            reservedUser: auth.currentUser?.uid
        })
        history.go(0);
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
                    Peržiūrėti informaciją
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="title">
                        <Form.Label>Pavadinimas</Form.Label>
                        <Form.Control type="text" placeholder="Įveskite paslaugos pavadinima" value={item.title} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="textarea">
                        <Form.Label>Aprašymas</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Aprašykite savo siūlomą paslaugą" value={item.description} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="tel">
                        <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                        <Form.Control type="tel" value={item.phoneNumber} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="Select3">
                        <label htmlFor="location2" style={{marginRight: "1rem"}}>Vietovė:</label>
                        <select name="location2" value={item.location} required disabled={true}>
                            {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>Valandinė kaina</Form.Label>
                        <Form.Control type="number" placeholder="Įveskite paslaugos kainą naudojant valandinį tarifą" value={item.price} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="checkbox">
                        <Form.Check type="checkbox" disabled={true} label="Paslauga teikiama nuotoliniu būdu?" checked={item.isRemote}/>
                    </Form.Group>
                    <div>
                        {
                            item.offerImages?.map((image: any, index: number) => {
                                return <Image fluid src={image} alt="nuotrauka" />
                            })
                        }
                    </div>
                    <div className="center-element">
                        <Button variant="outline-dark" onClick={(event) => reserveOffer(event)}>Rezervuoti</Button>
                    </div>

                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UserOfferModalComponent;