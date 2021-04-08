import {
    fetchPictureAsync,
    selectError,
    sendError,
    selectImage,
    selectUser, fetchUpdateUserWorkPicturesToReview, fetchUserAsync,
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

const UserProfileComponent = () => {
    const dispatch = useDispatch();
    let image = useSelector(selectImage);
    let errorMessage = useSelector(selectError);

    Pond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

    const [files, setFiles] = useState([]);
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
    const user = firebase.auth.currentUser;
    const userBeforeChange = useSelector(selectUser);
    const [username, setUsername] = useState("");
    const [usernameBeforeChange, setUsernameBeforeChange] = useState("");
    const userId = firebase.auth.currentUser?.uid;

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
            })
    }, [user])


    const handleImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                // @ts-ignore
                image = e.target.result;

                dispatch(fetchPictureAsync(image))
            };
            reader.readAsDataURL(event.target.files[0]);
        }
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
                            await dispatch(updateOffers({mail: email}))
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

        //TODO: uzdeti nuotrauku limita
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
        }
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
                            <Image src={image} className="dashboard-profile-image" roundedCircle alt="profilio nuotrauka" />
                            <input accept="image/png,image/jpeg, image/jpg" type="file" onChange={handleImageChange}/>
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