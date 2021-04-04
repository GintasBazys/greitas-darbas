import React from "react";
import {format} from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";

const OfferStatisticsPartTwo = (items: any) => {

    const doc = new jsPDF();
    // const tableColumn = ["Pavadinimas", "Veikla", "Vietovė", "Statusas", "Mokėjimo statusas",
    //     "Telefono nr.", "Valandinė kaina", "Paslaugos teikėjo paštas", "Sukūrimo data"];
    const tableColumn = ["Mokejimo statusas", "Telefono nr.", "Valandine kaina", "Paslaugos teikejo pastas"];
    const tableRows: any[][] = [];

    items.forEach((item: any) => {
        const itemData = [
            item.paymentStatus,
            item.phoneNumber,
            item.price,
            item.userMail,
            format(new Date(item.createdOn), "yyyy-MM-dd")
        ];
        tableRows.push(itemData);
    });

    // @ts-ignore
    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date().split(" ");

    const dateStr = date[4];

    doc.text("Pasiulymai", 14, 15);

    doc.save(`pasiulymai_2${dateStr}.pdf`);
}

export default OfferStatisticsPartTwo;