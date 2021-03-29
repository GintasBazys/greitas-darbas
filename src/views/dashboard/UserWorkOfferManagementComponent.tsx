import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    selectError,
    selectImage,
    selectUser,
    selectUserEmail,
    sendError
} from "../../features/user/userSlice";
import UserNavBarComponent from "./UserNavbarComponent";
import {Button, Col, Container, Form, Row, Image} from "react-bootstrap";
import {auth, db, storageRef} from "../../firebase";
import history from "../../history";
import {addOffer} from "../../features/offers/offersSlice";
import NotificationComponent from "../main_page/NotificationComponent";
import {usePagination} from "use-pagination-firestore";
import LoadingComponent from "../LoadingComponent";
import OffersUpdateModalComponent from "./OffersUpdateModalComponent";
import {locations} from "./locations";
import {days} from "./days";
import {Link} from "react-router-dom";
import axios from "axios";
import {FilePond} from "react-filepond";
import * as Pond from "filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import Stripe from "../../Stripe";

const UserWorkOfferManagementComponent = () => {

    const image = useSelector(selectImage);
    const dispatch = useDispatch();
    const username = useSelector(selectUser);
    const userMail = useSelector(selectUserEmail);
    const error = useSelector(selectError);

    const [activityType, setActivityType] = useState("Veikla nenurodyta");
    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [isRemote, setIsRemote] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [showOffers, setShowOffers] = useState(false);
    const [title, setTitle] = useState("");
    const [availability, setAvailability] = useState([]);
    const [EVRK, setERVK] = useState("");
    const [connectedId, setConnectedId] = useState(false);
    const [files, setFiles] = useState([]);
    Pond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

    useEffect( () => {
         db.collection("users").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                setActivityType(doc.data()?.activityType);
                setUserRating(doc.data()?.rating);
                setERVK(doc.data()?.EVRK);
                if(doc.data()?.connectedAccount != "") {
                    setConnectedId(true);
                }
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
        //TODO pavadinimas unikalus
        setTitle(event.target.value)
    }

    const handleAvailabilityChange = (event: any) => {
        // @ts-ignore
        let value = Array.from(event.target.selectedOptions, option => option.value);
        // @ts-ignore
        setAvailability(value)
        console.log(value)
    }

    const submitOffer = async () => {
        //todo istestuoti laukus kad nepraleistu netinkamo formato

        // if(title != "") {
        //     db.collection("offers").where("title", "==", title).limit(1).get()
        //         .then(() => {
        //             dispatch(sendError("Skelbimas tokiu pavadinimu jau egzistuoja"))
        //             setTimeout(() => {
        //                 dispatch(sendError(""))
        //             }, 2000);
        //         }).catch((error) => {
        //
        //     })
        // }

         if(description !== "" && phoneNumber !== "" && price !== "" && title !== "") {

            let urlsFromFirebaseStorage: Array<string> = [];
            let urls = files.map(async (file: any) => {
                await storageRef.child(`/${username}/pasiulymai/${title}/${file.file.name}`).put(file.file);
                const url = await storageRef.child(`/${username}/pasiulymai/${title}/${file.file.name}`).getDownloadURL();
                return urlsFromFirebaseStorage.push(url);
                //console.log(urlsFromFirebaseStorage);
            });
            await Promise.all(urls).then((results) => {
                //console.log(urls);
            })

            await dispatch(addOffer({
                user: auth.currentUser?.uid,
                userMail: userMail,
                username: username,
                description: description,
                phoneNumber: phoneNumber,
                location: location,
                price: price,
                isRemote: isRemote,
                userRating: userRating,
                title: title,
                availability: availability,
                offerImages: urlsFromFirebaseStorage,
                activityType: activityType
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

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("offers").orderBy("createdOn", "desc").where("username", "==", username), {
            limit: 10
        }
    );

    const [modalShow, setModalShow] = useState(false);

    const updateOffer = (item: any) => {
        setModalShow(!modalShow)
    }
    const deleteOffer = (item: any) => {
        const response = window.confirm("Patvirtinti?");
        if(response) {
            let titleForImages = "";
            db.collection("offers").where("title", "==", item.title).limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        titleForImages = doc.data()?.title;
                        db.collection("offers").doc(doc.id).delete()
                        const imagesRef = storageRef.child(`/${username}/pasiulymai/${titleForImages}/`);

                        imagesRef.listAll().then((result) => {
                            result.items.forEach((file) => {
                                file.delete()
                                    .then(() => {

                                    }).catch((error) => {
                                    console.log(error.message);
                                });
                            })
                        })
                        //db.collection("users").doc()
                    })
                })
            //history.go(0);
        }
    }

    const createConnectedAccount = () => {
        const confirm = window.confirm("Patvirtinti mokėjimo paskyros sukūrimą? Būsite nukreiptas į partnerių puslapį");
        if(confirm) {
            axios.post("http://localhost:8080/stripe/connected", {
                customer: userMail
            })
                .then(async (resp) => {
                    console.log(resp.data);
                    await db.collection("users").doc(auth.currentUser?.uid).update({
                        connectedAccount: resp.data.id
                    })
                    window.location.href=`${resp.data.link}`;
                })
        }

    }

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <div style={{marginTop: "5rem"}}>
                            {
                                connectedId ?
                                    <div className="alert alert-success" role="alert" style={{marginTop: "2rem"}}>
                                        <p>Mokėjimo paskyra jau sukurta</p>
                                    </div> :

                                    <div>
                                        <Button disabled={connectedId} variant="outline-dark"  onClick={() => createConnectedAccount()}><span>Sukurti mokėjimų paskyrą</span></Button>
                                        <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                        <p>Paskyrą kurkite būtinai su el. paštu, kurį naudojote registracijos metu</p>
                                        </div>
                                    </div>
                            }


                        </div>

                        <Link to="/profilis"><h1 style={{marginTop: "10rem"}}>Profilis</h1><Image src={image} fluid alt="profilio nuotrauka"/></Link>
                    </Col>
                    <Col md={8}>
                        <NotificationComponent message={error} />

                        <Form>
                            <Form.Group>
                                <Form.Label>Veikla</Form.Label>
                                <Form.Control type="text" disabled={!connectedId} value={activityType}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>EVRK (pakeitimui susisiekti su klientų aptarnavimo specialistu)</Form.Label>
                                <Form.Control disabled={true} type="text" value={EVRK}/>
                            </Form.Group>
                            <Form.Group controlId="title">
                                <Form.Label>Pavadinimas</Form.Label>
                                <Form.Control type="text" disabled={!connectedId} placeholder="Įveskite paslaugos pavadinimą" value={title} onChange={handleTitleChange}/>
                            </Form.Group>
                            <Form.Group controlId="textarea" >
                                <Form.Label>Aprašymas</Form.Label>
                                <Form.Control as="textarea" rows={3} disabled={!connectedId} placeholder="Aprašykite savo siūlomą paslaugą" value={description} onChange={handleDescriptionChange}/>
                            </Form.Group>
                            <Form.Group controlId="tel">
                                <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                                <Form.Control type="tel" disabled={!connectedId} value={phoneNumber} onChange={handlePhoneNumberChange}/>
                            </Form.Group>
                            <Form.Group controlId="Select1">
                                <label htmlFor="location" style={{marginRight: "1rem"}}>Vietovė:</label>
                                <select name="location" disabled={!connectedId} value={location} onChange={handleLocationChange} required>
                                    {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                                </select>
                            </Form.Group>
                            <Form.Group controlId="price">
                                <Form.Label>Valandinė kaina</Form.Label>
                                <Form.Control type="number" disabled={!connectedId} placeholder="Įveskite paslaugos kainą naudojant valandinį tarifą" value={price} onChange={handlePriceChange}/>
                            </Form.Group>
                            <Form.Group controlId="Select2" style={{display: "flex", flexDirection: "column"}}>
                                <label htmlFor="availability" style={{marginRight: "1rem"}}>Pasiekiamumas:</label>
                                <select style={{width: "15%"}} disabled={!connectedId} multiple={true} name="availability" value={availability} onChange={handleAvailabilityChange} required>
                                    {days.map((item: React.ReactNode) => <option>{item}</option>)}
                                </select>
                            </Form.Group>
                            <Form.Group controlId="checkbox">
                                <Form.Check type="checkbox" label="Paslauga teikiama nuotoliniu būdu?" disabled={!connectedId} checked={isRemote}
                                            onChange={() => setIsRemote(!isRemote)}/>
                            </Form.Group>
                        </Form>

                        <div>
                            <p>Pridėti paslaugos nuotraukų (bendras nuotraukų kiekis negali viršyti 4)</p>
                            <FilePond
                                allowImagePreview={true}
                                files={files}
                                // @ts-ignore
                                onupdatefiles={setFiles}
                                allowMultiple={true}
                                maxFiles={4}
                                allowReorder={true}
                                allowFileTypeValidation={true}
                                acceptedFileTypes={["image/*"]}
                                name="paslauga"
                                fileValidateTypeLabelExpectedTypes="Nuotraukos formatas: .png, .jpg..."
                                labelFileTypeNotAllowed="Negalimas failo tipas"
                                credits={false}
                                labelIdle='Nutempkite failus arba<span class="filepond--label-action"> ieškokite įrenginyje</span>'
                                allowFileSizeValidation={true}
                                maxTotalFileSize="100MB"
                                labelMaxTotalFileSizeExceeded="Viršytas maksimalus bendras nuotraukų dydis"
                                labelMaxTotalFileSize="Didziausias galimas failu dydis 100MB"
                            />
                        </div>

                        <div className="text-center">
                            <Button variant="outline-dark" onClick={() => submitOffer()}>Paskelbti</Button>
                        </div>
                        <div>
                            <Button style={{marginTop: "2rem"}} variant="outline-dark" onClick={() => setShowOffers(true)}>Peržiūrėti savo skelbimus</Button>
                            {
                                showOffers ?
                                    <div>
                                        {
                                             items.length === 0 ? <div></div> : isLoading? <LoadingComponent /> : items.map((item) => (
                                                <div>
                                                    <div style={{marginTop: "2rem"}}>
                                                        {item.title}
                                                        <Button style={{marginLeft: "2rem", marginRight: "2rem"}} variant="outline-dark" onClick={() => updateOffer(item)}>Atnaujinti informaciją</Button>
                                                        <Button variant="outline-danger" style={{marginRight: "2rem"}} onClick={() => deleteOffer(item)}>Pašalinti pasiūlymą</Button>
                                                    </div>

                                                    <OffersUpdateModalComponent show={modalShow} item={item} onHide={() => updateOffer(item)} />
                                                </div>
                                            ))
                                        }
                                        {
                                            items.length === 0 ? <div style={{marginTop: "2rem"}}>Daugiau skelbimų nėra <Button style={{marginLeft: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Grįžti atgal</Button></div> :
                                                <div className="center-element" style={{marginTop: "2rem"}}>
                                                <Button style={{marginRight: "2rem"}} disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>
                                                <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
                                                </div>
                                        }
                                    </div>

                                 : <div></div>
                            }
                        </div>

                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserWorkOfferManagementComponent;