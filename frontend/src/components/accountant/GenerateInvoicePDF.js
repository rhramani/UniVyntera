import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo1 from "../../assets/images/brand-logos/rg_logo.png";
import getSymbolFromCurrency from "currency-symbol-map";

const GenerateInvoicePDF = ({ invoiceData, dashboardLogo, paymentInvoice }) => {
  const addText = (doc, text, x, y, options = {}) => {
    if (
      !doc ||
      typeof text !== "string" ||
      typeof x !== "number" ||
      typeof y !== "number" ||
      isNaN(y)
    ) {
      return;
    }
    const safeText = text || "";
    const {
      fontSize = 12,
      fontStyle = "normal",
      textColor = [0, 0, 0],
      fontFamily = "helvetica",
    } = options;
    try {
      doc.setFontSize(fontSize);
      doc.setFont(fontFamily, fontStyle);
      doc.setTextColor(...textColor);
      doc.text(safeText, x, y);
    } catch (error) {
      console.log("Error Generate in Payment Invoice");
    }
  };
  const addLogo = (doc, currentY, isFirstPage = true) => {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    try {
      const logoToUse = dashboardLogo || logo1;
      const logoProps = doc.getImageProperties(logoToUse);
      let logoWidth = 40;
      let logoHeight = (logoProps.height / logoProps.width) * logoWidth;
      if (logoHeight > 45) {
        const scale = 45 / logoHeight;
        logoWidth *= scale;
        logoHeight = 45;
      }

      const logoX = margin;
      const logoY = currentY + 5;
      doc.addImage(logoToUse, "PNG", logoX, logoY, logoWidth, logoHeight);

      const companyX = logoX + logoWidth + 12;
      addText(
        doc,
        paymentInvoice?.name?.toUpperCase() || "ZOKEP OVERSEAS",
        companyX,
        logoY + 10,
        {
          fontSize: 20,
          fontStyle: "bold",
        }
      );
      addText(
        doc,
        paymentInvoice?.application?.toUpperCase() ||
          "PAYMENT SERVICE FEE INVOICE",
        companyX,
        logoY + 22,
        { fontSize: 14, fontStyle: "bold" }
      );

      const address =
        paymentInvoice?.address || "603, Swastik House, Pipload, Surat, India";
      const wrappedAddress = doc.splitTextToSize(
        address.toUpperCase(),
        pageWidth - companyX - 10
      );
      wrappedAddress.forEach((line, i) =>
        addText(doc, line, companyX, logoY + 35 + i * 5, { fontSize: 10 })
      );

      const headerBottomY = logoY + 50;
      doc.setDrawColor(0);
      doc.line(margin, headerBottomY, pageWidth - margin, headerBottomY);
      return headerBottomY + 10;
    } catch (error) {
      console.error("Error drawing logo header:", error);
      return currentY + 60;
    }
  };

  // const addLogo = async (doc, currentY, isFirstPage = true) => {
  //   const margin = 10;
  //   try {
  //     const logoX = 15;
  //     const logoY = currentY;
  //     const logoToUse = dashboardLogo ? logo1 : logo1;

  //     // get natural dimensions and scale
  //     const logoProps = doc.getImageProperties(logoToUse);

  //     let logoWidth = 40;
  //     let logoHeight = (logoProps.height / logoProps.width) * logoWidth;

  //     const companyBlockHeight = 45;

  //     // Agar logo chhota hai to usko thoda niche laao (center align with company block)
  //     const adjustedLogoY =
  //       logoHeight < companyBlockHeight
  //         ? logoY + (companyBlockHeight - logoHeight) / 2
  //         : logoY;

  //     doc.addImage(
  //       logoToUse,
  //       "PNG",
  //       logoX,
  //       adjustedLogoY,
  //       logoWidth,
  //       logoHeight
  //     );

  //     const companyX = logoX + logoWidth + 15;
  //     addText(doc, "ZOKEP OVERSEAS", companyX, logoY + 12, {
  //       fontSize: 20,
  //       fontStyle: "bold",
  //       textColor: [0, 0, 0],
  //       fontFamily: "helvetica",
  //     });
  //     addText(
  //       doc,
  //       "APPLICATION SERVICE FEE PROFORMA INVOICE",
  //       companyX,
  //       currentY + 25,
  //       {
  //         fontSize: 14,
  //         fontStyle: "bold",
  //         textColor: [0, 0, 0],
  //         fontFamily: "helvetica",
  //       }
  //     );
  //     addText(
  //       doc,
  //       "603, SWASTIK HOUSE, NEAR KARGIL CHOWK, PIPLOD, SURAT,",
  //       companyX,
  //       logoY + 32,
  //       {
  //         fontSize: 10,
  //         fontStyle: "normal",
  //         textColor: [0, 0, 0],
  //         fontFamily: "helvetica",
  //       }
  //     );
  //     addText(doc, "GUJARAT - INDIA", companyX, logoY + 37, {
  //       fontSize: 10,
  //       fontStyle: "normal",
  //       textColor: [0, 0, 0],
  //       fontFamily: "helvetica",
  //     });

  //     // ✅ Header ke niche ek line
  //     const headerBottomY = Math.max(logoY + logoHeight, logoY + 45);
  //     const pageWidth = doc.internal.pageSize.width;
  //     doc.setDrawColor(0, 0, 0);
  //     doc.setLineWidth(0.5);
  //     doc.line(
  //       margin,
  //       headerBottomY + 5,
  //       pageWidth - margin,
  //       headerBottomY + 5
  //     );

  //     const extraSpace = isFirstPage ? 0 : 15;
  //     return headerBottomY + 15 + extraSpace; // line ke niche space
  //   } catch (error) {
  //     const companyX = margin + 60;
  //     addText(doc, "ZOKEP OVERSEAS", companyX, currentY + 12, {
  //       fontSize: 20,
  //       fontStyle: "bold",
  //       textColor: [0, 0, 0],
  //       fontFamily: "helvetica",
  //     });
  //     const pageWidth = doc.internal.pageSize.width;
  //     doc.setDrawColor(0, 0, 0);
  //     doc.line(margin, currentY + 50, pageWidth - margin, currentY + 50);
  //     return currentY + 65;
  //   }
  // };

  const addInvoiceDetails = (doc, invoiceDate, currentY) => {
    const margin = 10; // Increased margin for wider page
    if (typeof currentY !== "number" || isNaN(currentY)) {
      currentY = 100;
    }
    const safeInvoiceDate = invoiceDate || "N/A";
    addText(doc, "Invoice Date: ", margin, currentY, {
      fontSize: 11,
      fontStyle: "bold",
      textColor: [0, 0, 0],
    });
    addText(doc, safeInvoiceDate, margin + 30, currentY, {
      fontSize: 11,
      fontStyle: "normal",
      textColor: [0, 0, 0],
    });
    return currentY + 15;
  };

  const addServiceFeeTable = (doc, students, currentY, invoiceData) => {
    const margin = 10; // Increased margin for wider page
    if (typeof currentY !== "number" || isNaN(currentY)) {
      currentY = 150;
    }
    if (!Array.isArray(students)) {
      students = [];
    }
    const totalPaidAmount = students.reduce((sum, student) => {
      if (student.paidAmount && student.paidAmount !== "N/A") {
        const amounts = student.paidAmount
          .split(",")
          .map((amt) => parseFloat(amt.trim()) || 0);
        return sum + amounts.reduce((acc, curr) => acc + curr, 0);
      }
      return sum;
    }, 0);
    let currencySymbol = getSymbolFromCurrency("INR") || "INR";
    if (currencySymbol === "₹") {
      currencySymbol = "INR";
    }
    const tableData = students.map((student, index) => [
      { content: (index + 1).toString(), styles: { halign: "center" } },
      { content: student.name || "N/A", styles: { halign: "left" } },
      { content: student.contactNo || "N/A", styles: { halign: "left" } },
      { content: student.mainPlan || "N/A", styles: { halign: "left" } },
      { content: student.subPlan || "N/A", styles: { halign: "left" } },
      { content: student.discount || "N/A", styles: { halign: "right" } },
      { content: student.payableAmount || "0", styles: { halign: "right" } },
      // { content: student.paymentType || "N/A", styles: { halign: "left" } },
      // { content: student.paymentMode || "N/A", styles: { halign: "left" } },
      { content: student.paidAmount || "N/A", styles: { halign: "right" } },
      { content: student.dueAmount || "0", styles: { halign: "right" } },
    ]);
    tableData.push([
      {
        content: `TOTAL`,
        colSpan: 8,
        styles: { halign: "right", fontStyle: "bold" },
      },
      { content: totalPaidAmount.toFixed(2), styles: {} },
    ]);
    try {
      autoTable(doc, {
        startY: currentY,
        tableWidth: "auto",
        head: [
          [
            "NO",
            "STUDENT NAME",
            "PHONE NUMBER",
            "MAIN PLAN",
            "SUB PLAN",
            "DISCOUNT",
            "PAYABLE AMOUNT",
            // "PAYMENT TYPE",
            // "PAYMENT MODE",
            "PAID AMOUNT",
            "DUE AMOUNT",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [5, 56, 128],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 11,
          fontFamily: "helvetica",
          halign: "center",
          valign: "middle",
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          cellPadding: 2,
        },
        bodyStyles: {
          fontSize: 11,
          textColor: [0, 0, 0],
          fontFamily: "helvetica",
          valign: "middle",
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          fillColor: [255, 255, 255],
        },
        styles: {
          cellPadding: 3,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          fontSize: 11,
        },
        columnStyles: {
          0: { cellWidth: 10, halign: "center" }, // Increased width
          1: { halign: "left" }, // Increased width
          2: { halign: "left" }, // Increased width
          3: { halign: "left" }, // Increased width
          4: { halign: "left" }, // Increased width
          5: { halign: "center" }, // Increased width
          6: { halign: "right" }, // Increased width
          7: { halign: "left" }, // Increased width
          8: { halign: "left" }, // Increased width
        },
        margin: { left: margin, right: margin, bottom: 35, top: 60 },
        didDrawPage: function (data) {
          const isFirstPage = doc.getCurrentPageInfo().pageNumber === 1;
          addLogo(doc, 15, isFirstPage);
          addFooter(doc);
        },
        showHead: "firstPage",
        pageBreak: "auto",
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        },
      });
      return doc.lastAutoTable.finalY + 10;
    } catch (error) {
      return currentY + 100;
    }
  };

  const addPaymentInformation = (doc, currentY) => {
    const margin = 10;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    if (typeof currentY !== "number" || isNaN(currentY)) currentY = 200;

    if (currentY + 120 > pageHeight - 50) {
      doc.addPage();
      currentY = 30;
      addLogo(doc, currentY, false);
      currentY = 100;
    }

    addText(doc, "PAYMENT INFORMATION", margin, currentY, {
      fontSize: 14,
      fontStyle: "bold",
    });
    currentY += 10;

    const bank = paymentInvoice?.bankDetails || {};
    const details = [
      { label: "Bank Name:", value: bank.bankName || "-" },
      { label: "Account Name:", value: bank.accountName || "-" },
      { label: "Account Number:", value: bank.accountNumber || "-" },
      { label: "Bank Address:", value: bank.bankAddress || "-" },
      { label: "IFSC Code:", value: bank.IFSCCode || "-" },
      { label: "Swift Code:", value: bank.SwiftCode || "-" },
    ];

    details.forEach((d) => {
      addText(doc, d.label, margin, currentY, {
        fontSize: 12,
        fontStyle: "bold",
      });
      addText(doc, d.value, margin + 45, currentY, { fontSize: 12 });
      currentY += 8;
    });

    return currentY + 5;
  };

  // const addPaymentInformation = (doc, currentY) => {
  //   const margin = 10; // Increased margin for wider page
  //   const pageWidth = doc.internal.pageSize.width;
  //   const pageHeight = doc.internal.pageSize.height;
  //   if (typeof currentY !== "number" || isNaN(currentY)) {
  //     currentY = 200;
  //   }
  //   const estimatedPaymentHeight = 150;
  //   if (currentY + estimatedPaymentHeight > pageHeight - 50) {
  //     doc.addPage();
  //     currentY = 15;
  //     addLogo(doc, currentY, false);
  //     currentY = 80;
  //   }
  //   // doc.setDrawColor(0, 0, 0);
  //   // doc.setLineWidth(0.5);
  //   // doc.line(margin, currentY, pageWidth - margin, currentY);
  //   currentY += 8;
  //   addText(doc, "PAYMENT INFORMATION", margin, currentY, {
  //     fontSize: 14,
  //     fontStyle: "bold",
  //     textColor: [0, 0, 0],
  //     fontFamily: "helvetica",
  //   });
  //   currentY += 3;
  //   const paymentDetails = [
  //     { label: "Bank Name:", value: "AXIS BANK LTD" },
  //     { label: "Account Name:", value: "R G OVERSEAS" },
  //     { label: "Account Number:", value: "922020035789074" },
  //     {
  //       label: "Bank Address:",
  //       value: "Ground Floor Status C, Near Regency Tower, Gaurav Path Piplod",
  //     },
  //     { label: "", value: "Surat - 395007" },
  //     { label: "IFSC Code:", value: "UTIB0001772" },
  //     { label: "Swift Code:", value: "AXISINBB047" },
  //   ];
  //   paymentDetails.forEach((detail, index) => {
  //     if (index === 0) {
  //       currentY += 8;
  //     }
  //     addText(doc, detail.label, margin, currentY, {
  //       fontSize: 12,
  //       fontStyle: "bold",
  //       textColor: [0, 0, 0],
  //       fontFamily: "helvetica",
  //     });
  //     addText(doc, detail.value, margin + 40, currentY, {
  //       fontSize: 12,
  //       fontStyle: "normal",
  //       textColor: [0, 0, 0],
  //       fontFamily: "helvetica",
  //     });
  //     if (index === 3) {
  //       currentY += 4;
  //     } else {
  //       currentY += 8;
  //     }
  //   });
  //   return currentY + 2;
  // };

  const addNote = (doc, currentY) => {
    const margin = 10;
    const pageWidth = doc.internal.pageSize.width;
    if (typeof currentY !== "number" || isNaN(currentY)) currentY = 250;

    doc.setDrawColor(0);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;

    addText(doc, "NOTE", margin, currentY, {
      fontSize: 14,
      fontStyle: "bold",
    });
    currentY += 8;

    const noteText =
      paymentInvoice?.notes ||
      "This invoice is non-refundable unless otherwise specified.";
    const lines = doc.splitTextToSize(noteText, pageWidth - margin * 2);
    lines.forEach((line) => {
      addText(doc, line, margin, currentY, { fontSize: 12 });
      currentY += 6;
    });

    doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);
    return currentY + 5;
  };
  // const addNote = (doc, currentY) => {
  //   const margin = 10; // Increased margin for wider page
  //   const pageWidth = doc.internal.pageSize.width;
  //   if (typeof currentY !== "number" || isNaN(currentY)) {
  //     currentY = 250;
  //   }
  //   doc.setDrawColor(0, 0, 0);
  //   doc.setLineWidth(0.5);
  //   doc.line(margin, currentY, pageWidth - margin, currentY);
  //   currentY += 8;
  //   addText(doc, "NOTE", margin, currentY, {
  //     fontSize: 14,
  //     fontStyle: "bold",
  //     textColor: [0, 0, 0],
  //     fontFamily: "helvetica",
  //   });
  //   currentY += 8;
  //   const noteText =
  //     "Kurm Infotech service charge invoices are refundable after the student receives the visa. It will be non-refundable in cases of rejection, missed interviews, or change of mind.";
  //   const maxWidth = pageWidth - margin;
  //   const lines = doc.splitTextToSize(noteText, maxWidth);
  //   lines.forEach((line) => {
  //     addText(doc, line, margin, currentY, {
  //       fontSize: 12,
  //       fontStyle: "normal",
  //       textColor: [0, 0, 0],
  //       fontFamily: "helvetica",
  //     });
  //     currentY += 6;
  //   });
  //   currentY += 3;
  //   doc.setDrawColor(0, 0, 0);
  //   doc.setLineWidth(0.5);
  //   doc.line(margin, currentY, pageWidth - margin, currentY);
  //   return currentY + 2;
  // };

  const addFooter = (doc) => {
    const margin = 10; // Increased margin for wider page
    const pageHeight = doc.internal.pageSize.height;
    addText(doc, "https://kurminfotech.in/", margin, pageHeight - 15, {
      fontSize: 10,
      fontStyle: "normal",
      textColor: [0, 0, 0],
    });
  };

  const addFooterToAllPages = (doc) => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(doc);
    }
  };

  const handleDownload = async () => {
    try {
      if (!invoiceData) {
        throw new Error("Invoice data is required");
      }
      const {
        invoiceDate = new Date().toLocaleDateString("en-GB"),
        students = [],
      } = invoiceData;
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [267, 420],
      }); // Increased page width to A3 (297x420mm)
      let currentY = 15;
      currentY = await addLogo(doc, currentY, true);
      currentY = addInvoiceDetails(doc, invoiceDate, currentY);
      currentY = addServiceFeeTable(doc, students, currentY, invoiceData);
      currentY = addPaymentInformation(doc, currentY);
      currentY = addNote(doc, currentY);
      addFooterToAllPages(doc);
      const filename = `INVOICE_${invoiceDate.replace(/\//g, "_")}.pdf`;
      doc.save(filename);
    } catch (error) {
      throw new Error(`Failed to generate invoice: ${error.message}`);
    }
  };

  return {
    handleDownload,
  };
};

export default GenerateInvoicePDF;
