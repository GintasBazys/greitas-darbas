import React from "react";
import jsPDF from "jspdf";
import {format} from "date-fns";

const RequestsStatisticsComponentPartTwo = (items: any) => {
    const doc = new jsPDF();

    const tableColumn = ["Reitingas", "Telefono nr.", "Biudžetas", "Užsakovo paštas"];
    const tableRows: any[][] = [];

    items.forEach((item: any) => {
        const itemData = [
            item.userRating,
            item.phoneNumber,
            item.budget,
            item.userMail,
        ];
        tableRows.push(itemData);
    });

    // @ts-ignore
    doc.autoTable(tableColumn, tableRows, { startY: 20, pageBreak: "auto", rowPageBreak: "auto" });
    const date = Date().split(" ");

    const dateStr = date[4];

    doc.text("Darbai", 14, 15);

    doc.save(`Darbai_2${dateStr}.pdf`);
}

export default RequestsStatisticsComponentPartTwo;