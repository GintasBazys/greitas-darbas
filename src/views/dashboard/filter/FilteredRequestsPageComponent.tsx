import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectImage} from "../../../features/user/userSlice";
import {
    selectCategory,
    selectLocation,
    selectPrice, selectRating
} from "../../../features/filter/offersInProgressFilterSlice";
import {db} from "../../../firebase";
import UserNavBarComponent from "../UserNavbarComponent";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import PaymentPaginationComponent from "../../administratorDashboard/PaymentPaginationComponent";
import FilterRequestsPagination from "./FilterRequestsPagination";

const FilteredRequestsPageComponent = () => {
    const image = useSelector(selectImage);

    const category = useSelector(selectCategory);
    const price = useSelector(selectPrice);
    const location = useSelector(selectLocation);
    const rating = useSelector(selectRating);
    console.log(price);

    const [result, setResult] = useState([]);

    useEffect(() => {
        const items: any[] = [];
        if (price === "Kaina (mažėjančiai)" && rating === "Mažesnis nei 5") {
            db.collection("requests").where("location", "==", location).where("activity", "==", category).where("userRating", "<=", 5).orderBy("userRating").orderBy("budget", "desc").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const item = doc.data();
                        items.push(item);
                    })
                }).then(() => {
                // @ts-ignore
                setResult(items);
            })
        }
        else if (price === "Kaina (mažėjančiai)" && rating === "Didesnis nei 5") {
            db.collection("requests").where("location", "==", location).where("activity", "==", category).where("userRating", ">=", 5).orderBy("userRating").orderBy("budget", "desc").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const item = doc.data();
                        items.push(item);
                    })
                }).then(() => {
                // @ts-ignore
                setResult(items);
            })
        }
        else if (price === "Kaina (mažėjančiai)" && rating === "Didesnis nei 8") {
            db.collection("requests").where("location", "==", location).where("activity", "==", category).where("userRating", ">=", 8).orderBy("userRating").orderBy("budget", "desc").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const item = doc.data();
                        items.push(item);
                    })
                }).then(() => {
                // @ts-ignore
                setResult(items);
            })
        }
        else if (price === "Kaina (mažėjančiai)" && rating === "Bet koks vertinimas") {
            db.collection("requests").where("location", "==", location).where("activity", "==", category).orderBy("budget", "desc").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const item = doc.data();
                        items.push(item);
                    })
                }).then(() => {
                // @ts-ignore
                setResult(items);
            })
        }
        else if (price === "Kaina (didėjančiai)" && rating === "Mažesnis nei 5") {
            db.collection("requests").where("location", "==", location).where("activity", "==", category).where("userRating", "<=", 5).orderBy("userRating").orderBy("budget", "asc").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const item = doc.data();
                        items.push(item);
                    })
                }).then(() => {
                // @ts-ignore
                setResult(items);
            })
        }
        else if (price === "Kaina (didėjančiai)" && rating === "Didesnis nei 5") {
            db.collection("requests").where("location", "==", location).where("activity", "==", category).where("userRating", ">=", 5).orderBy("userRating").orderBy("budget", "asc").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const item = doc.data();
                        items.push(item);
                    })
                }).then(() => {
                // @ts-ignore
                setResult(items);
            })
        }
        else if (price === "Kaina (didėjančiai)" && rating === "Didesnis nei 8") {
            db.collection("requests").where("location", "==", location).where("activity", "==", category).where("userRating", ">=", 8).orderBy("userRating").orderBy("budget", "asc").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const item = doc.data();
                        items.push(item);
                    })
                }).then(() => {
                // @ts-ignore
                setResult(items);
            })
        }
        else if (price === "Kaina (didėjančiai)" && rating === "Bet koks vertinimas") {
            db.collection("requests").where("location", "==", location).where("activity", "==", category).orderBy("budget", "asc").get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const item = doc.data();
                        items.push(item);
                    })
                }).then(() => {
                // @ts-ignore
                setResult(items);
            })
        }

    }, [])

    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // @ts-ignore
    const currentItems = result.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: React.SetStateAction<number>) => {setCurrentPage(pageNumber)}

    moment.locale("lt")
    return (
        <div>
            <UserNavBarComponent profileImage={image} />
            <FilterRequestsPagination items={currentItems} loading={loading} />
            {/*@ts-ignore*/}
            <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={result.length} paginate={paginate}/>
        </div>
    )
}

export default FilteredRequestsPageComponent;