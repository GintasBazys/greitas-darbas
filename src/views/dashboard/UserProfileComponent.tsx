import {
    fetchPictureAsync,
    selectError,
    sendError,
    selectImage,
    selectUser, fetchUpdateUserWorkPicturesToReview, fetchUserAsync, fetchUpdatePicture,
} from "../../features/user/userSlice";
import history from "../../history";
import {auth, db, emailProvider, storageRef} from "../../firebase";
import {Button, Form, Image, Container, Row, Col} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as firebase from "../../firebase";
import UserNavBarComponent from "./UserNavbarComponent";
import {FilePond} from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import "filepond/dist/filepond.min.css";
import * as Pond from 'filepond';
import "filepond/dist/filepond.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {updateOffers, updateOffersUsername} from "../../features/offers/offersSlice";
import profileRating from "../../assets/profile_rating.svg";
import ProviderModalComponent from "./ProviderModalComponent";
import {activities} from "./registration/activities";
import {experienceLevels} from "./registration/experienceLevel";
import {updateRequests, updateRequestsUsername} from "../../features/requests/requestsSlice";

const UserProfileComponent = () => {
    const dispatch = useDispatch();
    let image = useSelector(selectImage);
    let errorMessage = useSelector(selectError);

    Pond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

    const [files, setFiles] = useState([]);
    const [profileImage, setProfileImage] = useState([]);
    const [portfolioImages, setPortfolioImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect( () => {
        setLoading(true);
         firebase.usersCollection.doc(auth.currentUser?.uid).get()
            .then((doc) => {
                setPortfolioImages(doc.data()?.portfolioImages)
            })
         setLoading(false);
    }, [])

    const [email, setEmail] = useState("");
    const [aboutMe, setAboutMe] = useState("");
    const [userRating, setUserRating] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const user = firebase.auth?.currentUser;
    const userBeforeChange = useSelector(selectUser);
    const [username, setUsername] = useState("");
    const [usernameBeforeChange, setUsernameBeforeChange] = useState("");
    const userId = firebase.auth.currentUser?.uid;
    const [status, setStatus] = useState("");
    const [activity, setActivity] = useState("Klientų aptarnavimas");
    const [experienceLevel, setExperienceLevel] = useState("Pradedantysis");

    const handleActivityChange = (event: any) => {
        setActivity(event.target.value)
    }

    const handleExperienceChange = (event: any) => {
        setExperienceLevel(event.target.value)
    }

    useEffect(() => {
        firebase.usersCollection.doc(auth.currentUser?.uid).get()
            .then((doc) => {
                //@ts-ignore
                setEmail(user?.email);
                setAboutMe(doc.data()?.aboutMe);
                setUsername(doc.data()?.username);
                setUsernameBeforeChange(doc.data()?.username);
                setUserRating(doc.data()?.rating);
                setRatingCount(doc.data()?.ratingCount);
                setStatus(doc.data()?.status);
                setActivity(doc.data()?.activity);
                setExperienceLevel(doc.data()?.experienceLevel);
            })
    }, [user])


    const handleImageChange = async (event: any) => {
        // if (event.target.files && event.target.files[0]) {
        //     let reader = new FileReader();
        //     reader.onload = (e) => {
        //         // @ts-ignore
        //         image = e.target.result;
        //         dispatch(fetchPictureAsync(image))
        //     };
        //     reader.readAsDataURL(event.target.files[0]);
        // }
        let urlFromFirebaseStorage: Array<string> = [];
        const imagesRef = await storageRef.child(`/${username}/profilis/`);

        await imagesRef.listAll().then((result) => {
            result.items.forEach((file) => {
                file.delete()
                    .then(() => {

                    }).catch((error) => {
                    console.log(error.message);
                });
            })
        })
        let urls = profileImage.map(async (file: any) => {
            await storageRef.child(`/${username}/profilis/${file.file.name}`).put(file.file);
            const url = await storageRef.child(`/${username}/profilis/${file.file.name}`).getDownloadURL();
            await urlFromFirebaseStorage.push(url);
        });
        await Promise.all(urls).then((results) => {
            //console.log(urls);
        })
        await console.log(urlFromFirebaseStorage)
        await dispatch(fetchUpdatePicture({photo: urlFromFirebaseStorage, user: userId}))
        await history.go(0);
    }

    const handleUsernameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setUsername(event.target.value);
    }

    const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEmail(event.target.value);
    }

    const changeAboutMe = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if (aboutMe === "") {
            dispatch(sendError("Laukas negali būti tuščias"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 5000);

        } else {
            await db.collection("users").doc(auth.currentUser?.uid).update({
                aboutMe: aboutMe
            })
            //await dispatch(fetchUserAsync({uid: userId}));
            await history.push("/pagrindinis");
            //console.log(username);
        }

    }

    const changeActivity = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if (activity === "") {
            dispatch(sendError("Laukas negali būti tuščias"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 5000);

        } else {
            await db.collection("users").doc(auth.currentUser?.uid).update({
                activity: activity
            })
            //await dispatch(fetchUserAsync({uid: userId}));
            await history.push("/pagrindinis");
            //console.log(username);
        }

    }

    const changeExperience = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if (experienceLevel === "") {
            dispatch(sendError("Laukas negali būti tuščias"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 5000);

        } else {
            await db.collection("users").doc(auth.currentUser?.uid).update({
                experienceLevel: experienceLevel
            })
            //await dispatch(fetchUserAsync({uid: userId}));
            await history.push("/pagrindinis");
            //console.log(username);
        }

    }

    const handleAboutMeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setAboutMe(event.target.value);
    }


    const changeEmail = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();

        if(email !== "") {
            user?.updateEmail(email)
                .then(async () => {
                    await db.collection("users").doc(auth.currentUser?.uid).update({
                        email: email
                    })
                    history.push("/pagrindinis");
                }).catch((error) => {
                //TODO veliau padaryti langa o ne prompt
                const password = prompt("Re-enter password");
                const cred = emailProvider.credential(
                    //@ts-ignore
                    user?.email,
                    //@ts-ignore
                    password
                );
                user?.reauthenticateWithCredential(cred).then(() => {
                    user?.updateEmail(email)
                        .then(async () => {
                            await db.collection("users").doc(auth.currentUser?.uid).update({
                                email: email
                            })
                            await dispatch(updateOffers({mail: email}));
                            await dispatch(updateRequests({mail: email}));
                            await history.push("pagrindinis");
                        })
                }).catch((error) => {
                    console.log(error.message);
                })
                console.log(error.message);
            })
        }


    }

    const sendPortfolioPictures = async () => {

        let urlsFromFirebaseStorage: Array<string> = [];
        let urls = files.map(async (file: any) => {
            await storageRef.child(`/${userBeforeChange}/darbai/${file.file.name}`).put(file.file);
            const url = await storageRef.child(`/${userBeforeChange}/darbai/${file.file.name}`).getDownloadURL();
            await urlsFromFirebaseStorage.push(url);
            //console.log(urlsFromFirebaseStorage);
        });
        await Promise.all(urls).then((results) => {
            //console.log(urls);
        })
        //@ts-ignore
        await dispatch(fetchUpdateUserWorkPicturesToReview({user: user, portfolioImages: urlsFromFirebaseStorage}));
        await history.go(0);
    }

    const deleteWorkPictures = async () => {
        const response = window.confirm("Ištrinti nuotraukas?");

        if (response) {
            await firebase.usersCollection.doc(auth.currentUser?.uid).update({
                portfolioImages: []
            })

            const imagesRef = storageRef.child(`${userBeforeChange}/darbai/`);

            await imagesRef.listAll().then((result) => {
                 result.items.forEach((file) => {
                    file.delete()
                        .then(() => {

                        }).catch((error) => {
                        console.log(error.message);
                    });
                });
            }).catch((error) => {
                console.log(error.message);
            });
            await history.go(0)
        }
    }

    const changeUsername = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        if (username === "") {
            dispatch(sendError("Naudotojo vardo laukas negali būti tuščias"));
            setTimeout(() => {
                dispatch(sendError(""))
            }, 2000);

        } else {

            await db.collection("users").get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if(doc.data()?.username === username) {
                            dispatch(sendError("Naudotojas tokiu vardu jau egzistuoja"));
                            setTimeout(() => {
                                dispatch(sendError(""))
                            }, 2000);
                            return
                        }
                    })
                })

            await db.collection("users").doc(auth.currentUser?.uid).update({
                username: username
            })
            await dispatch(fetchUserAsync({uid: userId}));
            await dispatch(updateOffersUsername({username: username, usernameBeforeChange: usernameBeforeChange}));
            await dispatch(updateRequestsUsername({username: username, usernameBeforeChange: usernameBeforeChange}));
        }
    }

    const [modalShow, setModalShow] = useState(false);

    const handleModalShow = () => {
        setModalShow(!modalShow)
    }

    return <div>
        <UserNavBarComponent profileImage={image}/>
        <Container fluid>
            <Row>
                <Col md={2}>
                    <div style={{marginTop: "2rem"}}>
                        <p className="center-element">Darbų nuotraukos</p>
                        {
                            portfolioImages?.map((imageUrl: string, index: number) => (
                                <a  href={imageUrl} download target="_blank"><Image width="200px" key={index} src={imageUrl} fluid style={{marginLeft: "2rem", marginTop: "2rem"}}/></a>
                            ))
                        }
                    </div>
                </Col>
                <Col md={8}>

                    <Form>
                        <Form.Group>
                            <div>
                                <Image src={image} className="profile-image" style={{marginLeft: "500px"}} alt="profilio nuotrauka" />

                                <FilePond
                                    allowImagePreview={true}
                                    files={profileImage}
                                    // @ts-ignore
                                    onupdatefiles={setProfileImage}
                                    allowMultiple={true}
                                    maxFiles={1}
                                    allowReorder={false}
                                    allowFileTypeValidation={true}
                                    acceptedFileTypes={["image/*"]}
                                    name="nuotrauka"
                                    fileValidateTypeLabelExpectedTypes="Nuotraukos formatas: .png, .jpg..."
                                    labelFileTypeNotAllowed="Negalimas failo tipas"
                                    credits={false}
                                    labelIdle='<span class="filepond--label-action">Atnaujinti profilio nuotrauką</span>'
                                    allowFileSizeValidation={true}
                                    maxTotalFileSize="5MB"
                                    labelMaxTotalFileSizeExceeded="Viršytas maksimalus nuotraukos dydis"
                                    labelMaxTotalFileSize="Didziausias galimas failo dydis 5MB"
                                />
                                <Button  variant="outline-dark" style={{width: "15%", marginTop: "10px", height: "80%", marginLeft: "500px"}} onClick={handleImageChange}>Atnaujinti nuotrauką</Button>
                            </div>


                        </Form.Group>
                        {
                            status === "patvirtintas_naudotojas" ? <div className="center-element">
                                <Button variant="outline-dark" onClick={handleModalShow}>Sukurti paslaugų teikėjo paskyrą</Button>
                                <ProviderModalComponent show={modalShow} onHide={() => handleModalShow()} />
                            </div> : <div></div>
                        }
                        <Form.Group controlId="activity">
                            <label htmlFor="location">Veikla:</label>
                            <select name="activity" value={activity} onChange={handleActivityChange} required>
                                {activities.map((item: React.ReactNode) => <option>{item}</option>)}
                            </select>
                                <Button style={{textAlign: "center", marginLeft: "2rem"}} variant="outline-dark" onClick={(e) => changeActivity(e)}>Atnaujinti</Button>
                        </Form.Group>
                        <Form.Group controlId="experience">
                            <label htmlFor="location">Patirtis:</label>
                            <select name="location" value={experienceLevel} onChange={handleExperienceChange} required>
                                {experienceLevels.map((item: React.ReactNode) => <option>{item}</option>)}
                            </select>
                                <Button style={{textAlign: "center", marginLeft: "84px"}} variant="outline-dark" onClick={(e) => changeExperience(e)}>Atnaujinti</Button>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Pakeisti vartotojo vardą</Form.Label>
                            <Form.Control type="text" value={username} onChange={handleUsernameChange} />
                        </Form.Group>
                        <div className="text-center">
                            <Button style={{textAlign: "center"}} variant="outline-dark" onClick={(e) => changeUsername(e)}>Atnaujinti</Button>
                        </div>
                        <Form.Group>
                            <Form.Label>Pakeisti el. pašto adresą</Form.Label>
                            <Form.Control type="email" value={email} onChange={handleEmailChange}/>
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="outline-dark" onClick={(e) => changeEmail(e)}>Atnaujinti</Button>
                        </div>

                        <Form.Group>
                            <Form.Label>Papildyti profilio informaciją</Form.Label>
                            <Form.Control as="textarea" rows={6} value={aboutMe} onChange={handleAboutMeChange} />
                        </Form.Group>

                        <div className="text-center">
                            <Button style={{textAlign: "center"}} variant="outline-dark" onClick={(e) => changeAboutMe(e)}>Atnaujinti</Button>
                        </div>

                        {
                            portfolioImages === undefined ? <div>Daugiau nuotraukų nėra. Pridėti?
                                    <div>
                                        <p>Pridėti aliktų darbų nuotraukų (bendras nuotraukų kiekis negali viršyti 10)</p>
                                        <FilePond
                                            allowImagePreview={true}
                                            files={files}
                                            // @ts-ignore
                                            onupdatefiles={setFiles}
                                            allowMultiple={true}
                                            maxFiles={10}
                                            allowReorder={true}
                                            allowFileTypeValidation={true}
                                            acceptedFileTypes={["image/*"]}
                                            name="dokumentas"
                                            fileValidateTypeLabelExpectedTypes="Nuotraukos formatas: .png, .jpg..."
                                            labelFileTypeNotAllowed="Negalimas failo tipas"
                                            credits={false}
                                            labelIdle='Nutempkite failus arba<span class="filepond--label-action"> ieškokite įrenginyje</span>'
                                            allowFileSizeValidation={true}
                                            maxTotalFileSize="100MB"
                                            labelMaxTotalFileSizeExceeded="Viršytas maksimalus bendras nuotraukų dydis"
                                            labelMaxTotalFileSize="Didziausias galimas failu dydis 100MB"
                                        />
                                        <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => sendPortfolioPictures()}>Įkelti nuotraukas</Button>
                                        <Button variant="outline-danger" onClick={() => deleteWorkPictures()}>Ištrinti nuotraukas</Button>
                                    </div>

                            </div> :

                                    portfolioImages.length <=9 ?
                                        <div>
                                            <p>Pridėti aliktų darbų nuotraukų (bendras nuotraukų kiekis negali viršyti 10)</p>
                                            <FilePond
                                                allowImagePreview={true}
                                                files={files}
                                                // @ts-ignore
                                                onupdatefiles={setFiles}
                                                allowMultiple={true}
                                                maxFiles={10}
                                                allowReorder={true}
                                                allowFileTypeValidation={true}
                                                acceptedFileTypes={["image/*"]}
                                                name="dokumentas"
                                                fileValidateTypeLabelExpectedTypes="Nuotraukos formatas: .png, .jpg..."
                                                labelFileTypeNotAllowed="Negalimas failo tipas"
                                                credits={false}
                                                labelIdle='Nutempkite failus arba<span class="filepond--label-action"> ieškokite įrenginyje</span>'
                                                allowFileSizeValidation={true}
                                                maxTotalFileSize="100MB"
                                                labelMaxTotalFileSizeExceeded="Viršytas maksimalus bendras nuotraukų dydis"
                                                labelMaxTotalFileSize="Didziausias galimas failu dydis 100MB"
                                            />
                                            <Button style={{marginRight: "2rem"}} variant="outline-dark" onClick={() => sendPortfolioPictures()}>Įkelti nuotraukas</Button>
                                            <Button variant="outline-danger" onClick={() => deleteWorkPictures()}>Ištrinti nuotraukas</Button>
                                        </div>
                                        : <div>Daugiau nuotraukų negalima pridėti</div>

                        }

                    </Form>
                </Col>
                <Col md={2}>
                    <div>
                        <Image src={profileRating} fluid></Image>
                        <p className="center-element">Įvertinimas: {Math.round(userRating)}</p>
                        <p className="center-element">Įvertinta kartų: {ratingCount}</p>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
}

export default UserProfileComponent;