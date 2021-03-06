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
import {locations} from "./locations";
import {Link} from "react-router-dom";
import axios from "axios";
import {FilePond} from "react-filepond";
import * as Pond from "filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

const UserWorkOfferManagementComponent = () => {

    const image = useSelector(selectImage);
    const dispatch = useDispatch();
    const username = useSelector(selectUser);
    const userMail = useSelector(selectUserEmail);
    const error = useSelector(selectError);

    const [description, setDescription] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState(0);
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
    const [status, setStatus] = useState(false);
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
                if(doc.data()?.status === "patvirtintas_naudotojas") {
                    setStatus(true);
                }
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

    const handlePriceChange = (event: { target: { value: React.SetStateAction<number>; }; }) => {
        if(isNaN(Number(event.target.value))) {
            dispatch(sendError("Iveskite tik skai??ius"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);
        }else{
            setPrice(event.target.value)
        }
    }

    const handleTitleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(event.target.value)
    }

    const submitOffer = async () => {

         if(description !== "" && phoneNumber !== "" && price !== 0 && title !== "" && phoneNumber.includes("+3706", 0)) {

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
            dispatch(sendError("Nepalikite tu????i?? lauk??"))
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);
        }
    }

    const createConnectedAccount = () => {
        const confirm = window.confirm("Patvirtinti mok??jimo paskyros suk??rim??? B??site nukreiptas ?? partneri?? puslap??");
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
                                        <p>Mok??jimo paskyra jau sukurta</p>
                                    </div> :

                                    <div>
                                        <Button disabled={connectedId} variant="outline-dark"  onClick={() => createConnectedAccount()}><span>Sukurti mok??jim?? paskyr??</span></Button>
                                        <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                        <p>Paskyr?? b??tinai kurkite su el. pa??tu, kur?? naudojote registracijos metu</p>
                                        </div>
                                    </div>
                            }
                            {
                                status ? <div className="alert alert-danger" role="alert" style={{marginTop: "2rem"}}>
                                    Sukurkite paslaug?? teik??jo paskyr?? profilio lange
                                </div> :<div></div>
                            }


                        </div>

                        <Link to="/profilis"><h1 style={{marginTop: "10rem"}}>Profilis</h1><Image src={image} fluid alt="profilio nuotrauka"/></Link>
                    </Col>
                    <Col md={8}>
                        <NotificationComponent message={error} />
                        {console.log(status)}
                        <Form>
                            <Form.Group controlId="title">
                                <Form.Label>Pavadinimas</Form.Label>
                                <Form.Control type="text"  disabled={!connectedId || status} placeholder="??veskite paslaugos pavadinim??" value={title} onChange={handleTitleChange}/>
                            </Form.Group>
                            <Form.Group controlId="activity">
                                <Form.Label>Paslaugos tipas. Keiskite informacij?? profilio puslapyje</Form.Label>
                                <Form.Control type="text" disabled={true} value={activity} />
                            </Form.Group>
                            <Form.Group controlId="experience">
                                <Form.Label>Patirtis. Keiskite informacij?? profilio puslapyje</Form.Label>
                                <Form.Control type="text" disabled={true} value={experienceLevel} />
                            </Form.Group>
                            <Form.Group controlId="textarea" >
                                <Form.Label>Apra??ymas</Form.Label>
                                <Form.Control as="textarea" rows={3} disabled={!connectedId || status} placeholder="Apra??ykite savo si??lom?? paslaug??" value={description} onChange={handleDescriptionChange}/>
                            </Form.Group>
                            <Form.Group controlId="tel">
                                <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                                <Form.Control type="text" disabled={!connectedId || status} value={phoneNumber} onChange={handlePhoneNumberChange}/>
                            </Form.Group>
                            <Form.Group controlId="Select1">
                                <label htmlFor="location" style={{marginRight: "1rem"}}>Vietov??:</label>
                                <select name="location" disabled={!connectedId || status} value={location} onChange={handleLocationChange} required>
                                    {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                                </select>
                            </Form.Group>
                            <Form.Group controlId="price">
                                <Form.Label>Valandin?? kaina</Form.Label>
                                {/*@ts-ignore*/}
                                <Form.Control type="text" disabled={!connectedId || status} placeholder="??veskite paslaugos kain?? naudojant valandin?? tarif??" value={price} onChange={handlePriceChange}/>
                            </Form.Group>
                            <Form.Group controlId="checkbox">
                                <Form.Check type="checkbox" label="Paslauga teikiama nuotoliniu b??du?" disabled={!connectedId} checked={isRemote}
                                            onChange={() => setIsRemote(!isRemote)}/>
                            </Form.Group>
                        </Form>

                        <div>
                            <p>Prid??ti paslaugos nuotrauk?? (bendras nuotrauk?? kiekis negali vir??yti 4)</p>
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
                                labelIdle='Nutempkite failus arba<span class="filepond--label-action"> ie??kokite ??renginyje</span>'
                                allowFileSizeValidation={true}
                                maxTotalFileSize="100MB"
                                labelMaxTotalFileSizeExceeded="Vir??ytas maksimalus bendras nuotrauk?? dydis"
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