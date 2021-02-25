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
import {Button} from "react-bootstrap";
import {auth, storageRef} from "../../firebase";
import {useDispatch, useSelector} from "react-redux";
import {fetchUpdateUserStatusToReview, selectUser} from "../../features/user/userSlice";
import history from "../../history";

const DashboardComponent = () => {

    const username = useSelector(selectUser);
    const dispatch = useDispatch();

    Pond.registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

    const [files, setFiles] = useState([]);

    const user = auth.currentUser;

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
            <div style={{width: "50%"}}>
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
                    fileValidateTypeDetectType={(source: any, type: any) => new Promise((resolve, reject) => {

                        resolve(type);
                    })
                    }
                    fileValidateTypeLabelExpectedTypes="Nuotraukos formatas: .png, .jpg..."
                    labelFileTypeNotAllowed="Negalimas failo tipas"
                    credits={false}
                    labelIdle='Nutempkite failus arba<span class="filepond--label-action"> ieškokite įrenginyje</span>'
                    allowFileSizeValidation={true}
                    maxTotalFileSize="20MB"
                    labelMaxTotalFileSizeExceeded="Viršytas maksimalus bendras nuotraukų dydis"
                    labelMaxTotalFileSize="Didziausias galimas failu dydis 20MB"
                />
            </div>
            <div>
            <Button variant="outline-dark" className="btn-lg" onClick={() => sendPicturesForReview()}> Pateikti</Button>
            </div>
        </div>
    )
}

export default DashboardComponent;