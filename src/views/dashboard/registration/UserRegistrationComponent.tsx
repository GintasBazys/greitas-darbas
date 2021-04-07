import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {auth, storageRef} from "../../../firebase";
import {
    fetchUpdateClientStatusToReview,
    selectError,
    selectImage,
    selectUser,
    sendError
} from "../../../features/user/userSlice";
import history from "../../../history";
import * as Pond from "filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import {Button, Col, Container, Form, Image, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import welcome from "../../../assets/sveiki_atvyke.svg";
import NotificationComponent from "../../main_page/NotificationComponent";
import DatePicker from "react-datepicker";
import {locations} from "../locations";
import {FilePond} from "react-filepond";

const UserRegistrationComponent = () => {
    const dispatch = useDispatch();

    const user = auth.currentUser?.uid;
    const username = useSelector(selectUser);

    const error = useSelector(selectError);

    const image = useSelector(selectImage);

    window.addEventListener('popstate', function(event) {
        history.go(1);
    });

    const handlePageChange = () => {
        history.push("/pradzia")
    }

    Pond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

    const handleNameAndSurnameChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNameAndSurname(event.target.value);
    }
    const [nameAndSurname, setNameAndSurname] = useState("");
    const [date, setDate] = useState(new Date());
    const [location, setLocation] = useState("Akmenė");
    const [phoneNumber, setPhoneNumber] = useState("+3706");

    const handleLocationChange = (event: any) => {
        setLocation(event.target.value)
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
    const [files, setFiles] = useState([]);

    const submitForReview = async () => {


        const response = window.confirm("Patvirtinti pateikimą?");
        if (response) {

            let urlFromFirebaseStorage: Array<string> = [];
            let urls = files.map(async (file: any) => {
                await storageRef.child(`/${username}/profilis/${file.file.name}`).put(file.file);
                const url = await storageRef.child(`/${username}/profilis/${file.file.name}`).getDownloadURL();
                await urlFromFirebaseStorage.push(url);
            });
            await Promise.all(urls).then((results) => {
                //console.log(urls);
            })

            await dispatch(fetchUpdateClientStatusToReview({
                user: user,
                nameAndSurname: nameAndSurname,
                date: date,
                location: location,
                phoneNumber: phoneNumber,
                photo: urlFromFirebaseStorage
            }))
            await history.go(0);
        }
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
                        <NotificationComponent message={error} />
                        <Form>
                            <Form.Group controlId="nameAndSurname">
                                <Form.Label>Vardas ir pavardė</Form.Label>
                                <Form.Control type="text" placeholder="Įveskite vardą ir pavardę" value={nameAndSurname} onChange={handleNameAndSurnameChange}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Gimimo metai:</Form.Label>
                                {/*@ts-ignore*/}
                                <DatePicker locale="lt" selected={date} onChange={(date: React.SetStateAction<Date>) => setDate(date)} />
                            </Form.Group>
                            <Form.Group controlId="location">
                                <label htmlFor="location">Miestas:</label>
                                <select name="location" value={location} onChange={handleLocationChange} required>
                                    {locations.map((item: React.ReactNode) => <option>{item}</option>)}
                                </select>
                            </Form.Group>
                            <Form.Group controlId="tel">
                                <Form.Label style={{marginRight: "2rem"}}>Telefono nr. (3706xxxxxxx)</Form.Label>
                                <Form.Control type="tel" value={phoneNumber} onChange={handlePhoneNumberChange}/>
                            </Form.Group>
                        </Form>
                        <div>
                            <p>Įkelkite profilio nuotrauką</p>
                            <FilePond
                                allowImagePreview={true}
                                files={files}
                                // @ts-ignore
                                onupdatefiles={setFiles}
                                allowMultiple={true}
                                maxFiles={1}
                                allowFileTypeValidation={true}
                                acceptedFileTypes={["image/*"]}
                                name="profilio_nuotrauka"
                                fileValidateTypeLabelExpectedTypes="Nuotraukos formatas: .png, .jpg..."
                                labelFileTypeNotAllowed="Negalimas failo tipas"
                                credits={false}
                                labelIdle='Nutempkite failą arba<span class="filepond--label-action"> ieškokite įrenginyje</span>'
                                allowFileSizeValidation={true}
                                maxTotalFileSize="5MB"
                                labelMaxTotalFileSizeExceeded="Viršytas maksimalus nuotraukos dydis"
                                labelMaxTotalFileSize="Didziausias galimas failo dydis 5MB"
                            />
                        </div>
                        <Button variant="outline-dark" onClick={submitForReview}>Pateikti</Button>
                        <Button style={{marginTop: "2rem"}} variant="outline-info" className="btn-lg center-element" onClick={handlePageChange}> Grįžti atgal</Button>
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

export default UserRegistrationComponent;