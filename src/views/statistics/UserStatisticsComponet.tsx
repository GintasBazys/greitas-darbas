import React from "react";
import jsPDF from "jspdf";
// @ts-ignore
import moment from "moment/min/moment-with-locales";

const UserStatisticsComponent = (items: any) => {
    const doc = new jsPDF();

    const tableColumn = ["El. pašto adresas", "Telefono nr.", "Gyvenamoji vieta", "Gimimo metai"];
    const tableRows: any[][] = [];

    items.forEach((item: any) => {
        const itemData = [
            item.email,
            item.phoneNumber,
            item.location,
            moment(item.dateOfBirth).format('MM/DD/YYYY')
        ];
        tableRows.push(itemData);
    });

    // @ts-ignore
    doc.autoTable(tableColumn, tableRows, { startY: 20, pageBreak: "auto", rowPageBreak: "auto" });
    const date = Date().split(" ");

    const dateStr = date[4];

    doc.text("Naudotojai", 14, 15);

    doc.save(`naudotojai${dateStr}.pdf`);
}

export default UserStatisticsComponent;