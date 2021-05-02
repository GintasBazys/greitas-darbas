import React from "react";
import {format} from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";

const OfferStatisticsPartTwo = (items: any) => {

    const doc = new jsPDF();
    // const tableColumn = ["Pavadinimas", "Veikla", "Vietovė", "Statusas", "Mokėjimo statusas",
    //     "Telefono nr.", "Valandinė kaina", "Paslaugos teikėjo paštas", "Sukūrimo data"];
    const tableColumn = ["Patirtis", "Telefono nr.", "Valandine kaina", "Paslaugos teikejo pastas", "Reitingas"];
    const tableRows: any[][] = [];

    items.forEach((item: any) => {
        const itemData = [
            item.experienceLevel,
            item.phoneNumber,
            item.price,
            item.userMail,
            item.userRating,
        ];
        tableRows.push(itemData);
    });

    // @ts-ignore
    doc.autoTable(tableColumn, tableRows, { startY: 20, pageBreak: "auto", rowPageBreak: "auto" });
    const date = Date().split(" ");

    const dateStr = date[5];

    doc.text("Pasiulymai", 14, 15);

    doc.save(`pasiulymai_2${dateStr}.pdf`);
}

export default OfferStatisticsPartTwo;