import React from "react";
import {useSelector} from "react-redux";
import {Button, Form, Modal, Image} from "react-bootstrap";
import {locations} from "../dashboard/locations";
import {selectOffer} from "../../features/offers/offersSlice";

interface Props {
    show: boolean,
    onHide: () => void,
    item: any
}

const AdministratorOfferModalComponent = (props: Props) => {

    const item = useSelector(selectOffer);
    console.log(item.title);

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
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Uždaryti</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AdministratorOfferModalComponent;