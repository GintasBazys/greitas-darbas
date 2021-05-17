import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {db} from "../../../firebase";
import {
    selectCategory,
    selectExperience,
    selectLocation,
    selectPrice, selectRating
} from "../../../features/filter/offersInProgressFilterSlice";
import PaymentPaginationComponent from "../../administratorDashboard/PaymentPaginationComponent";
import FilterOffersPagination from "./FilterOffersPagination";

const FilteredOffersPageComponent = () => {

    const experience = useSelector(selectExperience);
    const category = useSelector(selectCategory);
    const price = useSelector(selectPrice);
    const location = useSelector(selectLocation);
    const rating: string = useSelector(selectRating);
    console.log(rating)

    const [result, setResult] = useState([]);

    useEffect(() => {
        const items: any[] = [];
        if (price === "Kaina (mažėjančiai)" && rating === "Mažesnis nei 5") {
            db.collection("offers").where("experienceLevel", "==", experience).where("location", "==", location).where("activity", "==", category).where("userRating", "<=", 5).orderBy("userRating").orderBy("price", "desc").get()
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

        else if(price === "Kaina (mažėjančiai)" && rating === "Didesnis nei 5") {
                db.collection("offers").where("experienceLevel", "==", experience).where("location", "==", location).where("activity", "==", category).where("userRating", ">=", 5).orderBy("userRating").orderBy("price", "desc").get()
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

            else if(price === "Kaina (mažėjančiai)" && rating === "Didesnis nei 8") {
                db.collection("offers").where("experienceLevel", "==", experience).where("location", "==", location).where("activity", "==", category).where("userRating", ">=", 8).orderBy("userRating").orderBy("price", "desc").get()
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

           else if(price === "Kaina (mažėjančiai)" && rating === "Bet koks vertinimas") {
                db.collection("offers").where("experienceLevel", "==", experience).where("location", "==", location).where("activity", "==", category).orderBy("price", "desc").get()
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
            db.collection("offers").where("experienceLevel", "==", experience).where("location", "==", location).where("activity", "==", category).where("userRating", "<=", 5).orderBy("userRating").orderBy("price", "asc").get()
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
            db.collection("offers").where("experienceLevel", "==", experience).where("location", "==", location).where("activity", "==", category).where("userRating", ">=", 5).orderBy("userRating").orderBy("price", "asc").get()
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
        else if(price === "Kaina (didėjančiai)" && rating === "Didesnis nei 8") {
            db.collection("offers").where("experienceLevel", "==", experience).where("location", "==", location).where("activity", "==", category).where("userRating", ">=", 8).orderBy("userRating").orderBy("price", "asc").get()
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
        else if(price === "Kaina (didėjančiai)" && rating === "Bet koks vertinimas") {
            db.collection("offers").where("experienceLevel", "==", experience).where("location", "==", location).where("activity", "==", category).orderBy("userRating").orderBy("price", "asc").get()
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

    return (
        <div>
            <FilterOffersPagination items={currentItems} loading={loading} />
            {/*@ts-ignore*/}
            <PaymentPaginationComponent itemsPerPage={itemsPerPage} totalItems={result.length} paginate={paginate}/>
        </div>
    )
}

export default FilteredOffersPageComponent;