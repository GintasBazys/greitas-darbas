import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../../features/user/userSlice";
import {selectSearch} from "../../../features/filter/offersInProgressFilterSlice";
import {auth, db} from "../../../firebase";
import UserNavBarComponent from "../UserNavbarComponent";
import Payments from "../../administratorDashboard/Payments";
import PaymentPaginationComponent from "../../administratorDashboard/PaymentPaginationComponent";
import LoadingComponent from "../../LoadingComponent";
import ReservedOffers from "./ReservedOffers";


const SearchOffersInProgressComponent = () => {
    const image = useSelector(selectImage);
    const search = useSelector(selectSearch);
    const [items, setItems]: any = useState([]);

    const offersRef = db.collection("reservedOffers");

    async function getIsUserOReservedUser() {
        const isUser = offersRef.where("user", "==", auth.currentUser?.uid).where("title", ">=", search).where("title", "<=", search+ "\uf8ff").get();
        const isReserved = offersRef.where("reservedUser", "==", auth.currentUser?.uid).where("title", ">=", search).where("title", "<=", search+ "\uf8ff").get();

        const [userQuerySnapshot, reservedUserQuerySnapshot] = await Promise.all([
            isUser,
            isReserved
        ]);

        const userArray = userQuerySnapshot.docs;
        const reservedUserArray = reservedUserQuerySnapshot.docs;

        const usersArray = userArray.concat(reservedUserArray);

        return usersArray;
    }

    getIsUserOReservedUser().then(result => {
        const items: any[] = [];

        result.forEach(doc => {
            console.log(doc.data());
            const item = doc.data();
            items.push(item);
        })
        // @ts-ignore
        setItems(items);
    });

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
            {
                items.length > 0 ? <div>
                    <div>
                        <ReservedOffers items={currentItems} loading={loading} />
                        {/*@ts-ignore*/}
                        <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={items.length} paginate={paginate}/>
                    </div>
                </div> : <LoadingComponent />
            }

        </div>
    )
}

export default SearchOffersInProgressComponent;