import React from "react";
import jsPDF from "jspdf";
import {format} from "date-fns";

const PaymentStatisticsComponent = (items: any) => {


    const doc = new jsPDF();

    const tableColumn = ["Mokėjimo statusas", "Mokėjimo data", "Suma", "Valiuta"];
    const tableRows: any[][] = [];

    items.forEach((item: any) => {
        const itemData = [
            item.status,
            format(new Date(item.created), "yyyy-MM-dd"),
            item.amount/ 100,
            item.currency
        ];
        tableRows.push(itemData);
    });

    // @ts-ignore
    doc.autoTable(tableColumn, tableRows, { startY: 20, pageBreak: "auto", rowPageBreak: "auto" });
    const date = Date().split(" ");

    const dateStr = date[4];

    doc.text("Mokėjimai", 14, 15);

    doc.save(`Mokejimai${dateStr}.pdf`);
}

export default PaymentStatisticsComponent;