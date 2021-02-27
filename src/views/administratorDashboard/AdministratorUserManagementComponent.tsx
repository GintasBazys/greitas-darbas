import React, {useState} from "react";
import {usePagination} from "use-pagination-firestore";
import {db} from "../../firebase";
import history from "../../history";
import AdministratorDashboardNavbar from "./AdministratorDashboardNavbar";
import {useSelector} from "react-redux";
import {selectImage} from "../../features/user/userSlice";
import {Button} from "react-bootstrap";

const AdministratorUserManagementComponent = () => {

    const image = useSelector(selectImage);

    const {
        items,
        isLoading,
        isStart,
        isEnd,
        getPrev,
        getNext,
    } = usePagination(
        db
            .collection("users")
            .orderBy("username", "asc"),
        {
            limit: 2
        }
    );

    const [isDisabled, setIsDisabled] = useState(false);
    const [isPreviousDisabled, setIsPreviousDisabled] = useState(false);

    const nextPage = () => {
        //console.log(items)
        //console.log(isEnd);
        getNext()
        getNext()
        //@ts-ignore
        console.log(items.length)
        if(isEnd || items.length === 0) {
            setIsDisabled(true);
        }
    }
    const prevPage = () => {
        getPrev()
        //@ts-ignore
        console.log(isStart)
        console.log(items)
    }

    return (
        <div>
            <AdministratorDashboardNavbar profileImage={image} />
            {
                items.map(item => {
                    return <div>{item.username}</div>
                })
            }
            <Button disabled={isStart} variant="primary" onClick={getPrev}>Ankstenis puslapis</Button>

            <Button disabled={isEnd} variant="secondary" onClick={getNext}>Kitas puslapis</Button>
        </div>
    )
}

export default AdministratorUserManagementComponent;