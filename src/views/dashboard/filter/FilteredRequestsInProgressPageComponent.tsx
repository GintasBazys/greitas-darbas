import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../../features/user/userSlice";
import {
    selectCategory,
    selectLocation,
    selectPrice, selectStatus
} from "../../../features/filter/offersInProgressFilterSlice";
import UserNavBarComponent from "../UserNavbarComponent";
import {auth, db} from "../../../firebase";
import PaymentPaginationComponent from "../../administratorDashboard/PaymentPaginationComponent";
import FilterRequestProgressPagination from "./FilterRequestsProgressPagination";

const FilteredRequestsInProgressPageComponent = () => {
    const image = useSelector(selectImage);
    const category = useSelector(selectCategory);
    const price = useSelector(selectPrice);
    const location = useSelector(selectLocation);
    const status = useSelector(selectStatus);

    const [items, setItems]: any = useState([]);

    const requestsRef = db.collection("requests");

    async function getIsUserOReservedUser(price: any, sorting: any) {
        // @ts-ignore
        const isUser = requestsRef.where("user", "==", auth.currentUser?.uid).where("activity", "==", category).where("location", "==", location).where("status", "==", status).orderBy("price", `${sorting}`).get();
        // @ts-ignore
        const isReserved = requestsRef.where("reservedUser", "==", auth.currentUser?.uid).where("activity", "==", category).where("location", "==", location).where("status", "==", status).orderBy("price", `${sorting}`).get();

        const [userQuerySnapshot, reservedUserQuerySnapshot] = await Promise.all([
            isUser,
            isReserved
        ]);

        const userArray = userQuerySnapshot.docs;
        const reservedUserArray = reservedUserQuerySnapshot.docs;

        const usersArray = userArray.concat(reservedUserArray);

        return usersArray;
    }

    useEffect(() => {
        if (price === "Kaina (mažėjančiai)") {
            const sorting = "desc";
            getIsUserOReservedUser(price, sorting).then(result => {
                const items: any[] = [];

                // @ts-ignore
                result.forEach((doc):any => {
                    console.log(doc.data());
                    const item = doc.data();
                    items.push(item);
                })
                // @ts-ignore
                setItems(items);
            });
        }

        else if(price === "Kaina (didėjančiai)") {
            const sorting = "asc";
            getIsUserOReservedUser(price, sorting).then(result => {
                const items: any[] = [];

                // @ts-ignore
                result.forEach((doc):any => {
                    console.log(doc.data());
                    const item = doc.data();
                    items.push(item);
                })
                // @ts-ignore
                setItems(items);
            });
        }

    }, [])

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // @ts-ignore
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: React.SetStateAction<number>) => {setCurrentPage(pageNumber)}

    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <FilterRequestProgressPagination items={currentItems} loading={loading} />
            <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={items.length} paginate={paginate}/>
        </div>
    )

    return (
        <div>
            <UserNavBarComponent profileImage={image} />

        </div>
    )
}

export default FilteredRequestsInProgressPageComponent;