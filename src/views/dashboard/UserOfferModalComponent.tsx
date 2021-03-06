import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Form, Image, Modal} from "react-bootstrap";
import {locations} from "./locations";
import {selectOffer} from "../../features/offers/offersSlice";
import {selectUserEmail} from "../../features/user/userSlice";
import ComfirmReservationModalComponent from "./ComfirmReservationModalComponent";

interface Props {
    show: boolean,
    onHide: () => void,
}

const UserOfferModalComponent = (props: Props) => {

    const item = useSelector(selectOffer);
    const userEmail = useSelector(selectUserEmail);
    console.log(item.title);

    const [modalShow, setModalShow] = useState(false);

    const dispatch = useDispatch();

    const handleModalShow = () => {
        props.onHide;
        setModalShow(!modalShow)
    }

    const reserveOffer = async () => {

        const confirm = window.confirm("Patvirtinti rezervacijÄ…?");
        if(confirm) {
            // let docId = ""
            // await db.collection("offers").where("title", "==", item.title).limit(1).get()
            //     .then((querySnapshot) => {
            //         querySnapshot.forEach((doc) => {
            //             docId = doc.id;
            //         })
            //     })
            // await db.collection("reservedOffers").add({
            //     status: "rezervuotas",
            //     price: item.price,
            //     user: item.user,
            //     userMail: item.userMail,
            //     username: item.username,
            //     profileImage: item.profileImage,
            //     title: item.title,
            //     description: item.description,
            //     reservedDay: item.reservedDay,
            //     reservedHour: item.reservedHour,
            //     reservedUser: auth.currentUser?.uid,
            //     reservedUserEmail: userEmail
            // })
            // await history.go(0);
            await props.onHide;
            setModalShow(!modalShow)
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
                    PerÅ¾iÅ«rÄ—ti informacijÄ…
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="title">
                        <Form.Label>Pavadinimas</Form.Label>
                        <Form.Control type="text" placeholder="Ä®veskite paslaugos pavadinima" value={item.title} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="textarea">
                        <Form.Label>ApraÅ¡ymas</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="ApraÅ¡ykite savo siÅ«lomÄ… paslaugÄ…" value={item.description} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="tel">
                        <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                        <Form.Control type="tel" value={item.phoneNumber} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="Select3">
                        <label htmlFor="location2" style={{marginRight: "1rem"}}>VietovÄ—:</label>
                        <select name="location2" value={item.location} required disabled={true}>
                            {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                        </select>
                    </Form.Group>
                    <Form.Group controlId="price">
                        <Form.Label>ValandinÄ— kaina</Form.Label>
                        <Form.Control type="number" placeholder="Ä®veskite paslaugos kainÄ… naudojant valandinÄ¯ tarifÄ…" value={item.price} disabled={true}/>
                    </Form.Group>
                    <Form.Group controlId="checkbox">
                        <Form.Check type="checkbox" disabled={true} label="Paslauga teikiama nuotoliniu bÅ«du?" checked={item.isRemote}/>
                    </Form.Group>
                    <div>
                        {
                            item.offerImages?.map((image: any, index: number) => {
                                return <Image fluid src={image} alt="nuotrauka" />
                            })
                        }
                    </div>
                    <div className="center-element">
                        <Button variant="outline-dark" onClick={() => reserveOffer()}>Rezervuoti</Button>
                        <ComfirmReservationModalComponent show={modalShow} onHide={() => handleModalShow()} item={item} />
                    </div>

                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>UÅ¾daryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UserOfferModalComponent;