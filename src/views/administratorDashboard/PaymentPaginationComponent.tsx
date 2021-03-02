import React from "react";

const PaymentPaginationComponent = ({itemsPerPage, totalItems, paginate}: any) => {
    const pageNumbers = [];

    for(let i =1; i<= Math.ceil(totalItems/itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination" style={{justifyContent: "center", display: "flex"}}>
                {
                    pageNumbers.map(number => (
                        <li key={number} className="page-item">
                            <button onClick={() => paginate(number)} className="page-link">
                                {number}
                            </button>
                        </li>
                    ))
                }
            </ul>
        </nav>
    )

}

export default PaymentPaginationComponent;