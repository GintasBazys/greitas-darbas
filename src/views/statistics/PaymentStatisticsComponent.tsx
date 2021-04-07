import React from "react";
import jsPDF from "jspdf";
import {format} from "date-fns";

const PaymentStatisticsComponent = (items: any) => {
    const doc = new jsPDF();
    // const tableColumn = ["Pavadinimas", "Veikla", "Vietovė", "Statusas", "Mokėjimo statusas",
    //     "Telefono nr.", "Valandinė kaina", "Paslaugos teikėjo paštas", "Sukūrimo data"];
    const tableColumn = ["Pavadinimas", "Veikla", "Vieta", "Statusas", "Data"];
    const tableRows: any[][] = [];

    items.forEach((item: any) => {
        const itemData = [
            item.title,
            item.activityType,
            item.location,
            item.status,
            format(new Date(item.createdOn), "yyyy-MM-dd")
        ];
        tableRows.push(itemData);
    });

    // @ts-ignore
    doc.autoTable(tableColumn, tableRows, { startY: 20, pageBreak: "auto", rowPageBreak: "auto" });
    const date = Date().split(" ");

    const dateStr = date[4];

    doc.text("Pasiulymai", 14, 15);

    doc.save(`pasiulymai${dateStr}.pdf`);
}

export default PaymentStatisticsComponent;