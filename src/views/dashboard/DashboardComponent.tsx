import React, {useEffect, useState} from "react";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import "filepond/dist/filepond.min.css";
import * as Pond from 'filepond';
import "filepond/dist/filepond.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import {auth, storageRef} from "../../firebase";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchUpdateUserStatusToReview,
    logout,
    selectError,
    selectImage,
    selectUser,
    sendError
} from "../../features/user/userSlice";
import history from "../../history";
import welcome from "../../assets/sveiki_atvyke.svg";
import {Link} from "react-router-dom";
import UserNavBarComponent from "./UserNavbarComponent";
import NotificationComponent from "../main_page/NotificationComponent";

const DashboardComponent = () => {

    const username = useSelector(selectUser);
    const dispatch = useDispatch();

    Pond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

    const [files, setFiles] = useState([]);

    const user = auth.currentUser;

    const error = useSelector(selectError);

    const image = useSelector(selectImage);

    window.addEventListener('popstate', function(event) {
        history.go(1);
    });

    const sendPicturesForReview = async () => {

        if(files.length === 0 || activity === "" || EVRK === "") {
            dispatch(sendError("Užpildykite tuščius laukus"))
            setTimeout(() => {
                dispatch(sendError(""));
            }, 5000)
        }
        else {
            let urlsFromFirebaseStorage: Array<string> = [];
            let urls = files.map(async (file: any) => {
                await storageRef.child(`/${username}/dokumentai/${file.file.name}`).put(file.file);
                const url = await storageRef.child(`/${username}/dokumentai/${file.file.name}`).getDownloadURL();
                return urlsFromFirebaseStorage.push(url);
                //console.log(urlsFromFirebaseStorage);
            });
            await Promise.all(urls).then((results) => {
                //console.log(urls);
            })
            //@ts-ignore
            await dispatch(fetchUpdateUserStatusToReview({user: user, documentURLS: urlsFromFirebaseStorage, activityType: activity, EVRK: EVRK}));
            history.go(0);
        }

    }

    const [activity, setActivity] = useState("");
    const [EVRK, setEVKR] = useState("");

    const handleActivityChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setActivity(event.target.value);
    }

    const handleEVRKChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setEVKR(event.target.value);
    }

    return (
        <div>
            <Container fluid>

                <Row>
                    <Col md={3}>
                        <div className="center">
                            <Link to="/pradzia/profilis"><h1>Peržiūrėti profilį</h1></Link>
                            <Image src={image} alt="profilis" />
                        </div>

                    </Col>

                    <Col md={6} style={{textAlign: "center"}}>
                        <Image src={welcome} alt="Sveiki atvyke" height="40%" />
                        <h1>Sveiki atvykę. Tolimesniam darbui reikalingas tapatybės patvirtinimas.</h1>
                        <p>Pateikite individualios veiklos rūšies pavadinimą ir kodą pagal <Link to="https://osp.stat.gov.lt/600">EVRK</Link></p>
                        <NotificationComponent message={error} />
                        <Form>
                            <Form.Group controlId="activityType">
                                <Form.Label>Veiklos rūšis*</Form.Label>
                                <Form.Control type="text" value={activity} autoComplete="on" autoFocus placeholder="Įveskite veiklos rūšį" onChange={handleActivityChange}/>
                            </Form.Group>
                            <Form.Group controlId="EVRK">
                                <Form.Label>EVRK*</Form.Label>
                                <Form.Control type="text" value={EVRK} autoComplete="on" autoFocus placeholder="Įveskite EVRK" onChange={handleEVRKChange}/>
                            </Form.Group>
                            *Šios informacijos pateikti nėra privaloma
                        </Form>
                        <h1>Pateikite ne daugiau nei dvi dokumento nuotraukas.</h1>
                        <FilePond
                            allowImagePreview={true}
                            files={files}
                            // @ts-ignore
                            onupdatefiles={setFiles}
                            allowMultiple={true}
                            maxFiles={2}
                            allowReorder={true}
                            allowFileTypeValidation={true}
                            acceptedFileTypes={["image/*"]}
                            name="dokumentas"
                            fileValidateTypeLabelExpectedTypes="Nuotraukos formatas: .png, .jpg..."
                            labelFileTypeNotAllowed="Negalimas failo tipas"
                            credits={false}
                            labelIdle='Nutempkite failus arba<span class="filepond--label-action"> ieškokite įrenginyje</span>'
                            allowFileSizeValidation={true}
                            maxTotalFileSize="20MB"
                            labelMaxTotalFileSizeExceeded="Viršytas maksimalus bendras nuotraukų dydis"
                            labelMaxTotalFileSize="Didziausias galimas failu dydis 20MB"
                        />
                        <Button style={{marginRight: "2rem"}} variant="outline-dark" className="btn-lg" onClick={() => sendPicturesForReview()}> Pateikti</Button>
                        <Button variant="outline-info" className="btn-lg" onClick={() => dispatch(logout())}> Atsijungti</Button>
                    </Col>

                    <Col md={3}>
                        <div className="center">
                            <Link to="/pagalba"><h1>Pagalba</h1></Link>
                        </div>

                    </Col>

                </Row>
            </Container>
        </div>
    )
}

export default DashboardComponent;