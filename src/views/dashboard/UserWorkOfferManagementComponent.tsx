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

    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [isRemote, setIsRemote] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [showOffers, setShowOffers] = useState(false);
    const [title, setTitle] = useState("");
    const [connectedId, setConnectedId] = useState(false);
    const [files, setFiles] = useState([]);
    const [activity, setActivity] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [nameAndSurname, setNameAndSurname] = useState("");
    const [profileImage, setProfileImage] = useState("");
    Pond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

    useEffect( () => {
         db.collection("users").doc(auth.currentUser?.uid).get()
            .then((doc) => {
                setUserRating(doc.data()?.rating);
                setLocation(doc.data()?.location);
                setPhoneNumber(doc.data()?.phoneNumber);
                setActivity(doc.data()?.activity);
                setExperienceLevel(doc.data()?.experienceLevel);
                setNameAndSurname(doc.data()?.nameAndSurname);
                setProfileImage(doc.data()?.image);
                console.log(doc.data()?.connectedAccount);
                if(doc.data()?.connectedAccount != "" && doc.data()?.connectedAccount !== undefined) {
                    setConnectedId(true);
                }
            })
    }, [])

    const handleDescriptionChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        if(event.target.value.length >= 501) {
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
                offerImages: urlsFromFirebaseStorage,
                activity: activity,
                experienceLevel: experienceLevel,
                profileImage: profileImage,
                nameAndSurname: nameAndSurname
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
                            <Form.Group controlId="title">
                                <Form.Label>Pavadinimas</Form.Label>
                                <Form.Control type="text" disabled={!connectedId} placeholder="Įveskite paslaugos pavadinimą" value={title} onChange={handleTitleChange}/>
                            </Form.Group>
                            <Form.Group controlId="activity">
                                <Form.Label>Paslaugos rūšis. Keiskite informaciją profilio puslapyje</Form.Label>
                                <Form.Control type="text" disabled={true} value={activity} />
                            </Form.Group>
                            <Form.Group controlId="experience">
                                <Form.Label>Patirtis. Keiskite informaciją profilio puslapyje</Form.Label>
                                <Form.Control type="text" disabled={true} value={experienceLevel} />
                            </Form.Group>
                            <Form.Group controlId="textarea" >
                                <Form.Label>Aprašymas</Form.Label>
                                <Form.Control as="textarea" rows={3} disabled={!connectedId} placeholder="Aprašykite savo siūlomą paslaugą" value={description} onChange={handleDescriptionChange}/>
                            </Form.Group>
                            <Form.Group controlId="tel">
                                <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                                <Form.Control type="text" disabled={!connectedId} value={phoneNumber} onChange={handlePhoneNumberChange}/>
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

                    </Col>
                    <Col md={2}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserWorkOfferManagementComponent;