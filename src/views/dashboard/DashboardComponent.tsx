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
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {auth, storageRef} from "../../firebase";
import {useDispatch, useSelector} from "react-redux";
import {fetchUpdateUserStatusToReview, logout, selectImage, selectUser} from "../../features/user/userSlice";
import history from "../../history";
import welcome from "../../assets/sveiki_atvyke.svg";
import {Link} from "react-router-dom";

const DashboardComponent = () => {

    const username = useSelector(selectUser);
    const dispatch = useDispatch();

    Pond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

    const [files, setFiles] = useState([]);

    const user = auth.currentUser;

    const image = useSelector(selectImage);

    window.addEventListener('popstate', function(event) {
        history.go(1);
    });

    const sendPicturesForReview = async () => {
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
        await dispatch(fetchUpdateUserStatusToReview({user: user, documentURLS: urlsFromFirebaseStorage}));
        history.go(0);
    }

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col md={3}>
                        <div className="center">
                            <Link to="/profilis"><h1>Peržiūrėti profilį</h1></Link>
                            <Image src={image} alt="profilis" />
                        </div>

                    </Col>

                    <Col md={6} style={{textAlign: "center"}}>
                        <Image src={welcome} alt="Sveiki atvyke" height="40%" />
                        <h1>Sveiki atvykę. Tolimesniam darbui reikalingas tapatybės patvirtinimas.</h1>
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