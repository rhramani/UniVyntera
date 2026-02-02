import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo1 from "../../assets/images/brand-logos/rg_logo.png";
import getSymbolFromCurrency from "currency-symbol-map";

const InvoicePDFGenerator = ({
  invoiceData,
  dashboardLogo,
  applicationFeeInvoice,
}) => {
  // Helper function to process and validate student data
  const processStudentData = (students) => {
    if (!Array.isArray(students)) {
      return [];
    }
    return students.map((student) => {
      const amount =
        parseFloat(student?.amount || student?.feeAmount || 0) || 0;
      const rate = parseFloat(student?.rate || student?.exchangeRate || 0) || 0;
      const amountPayable = amount && rate ? (amount * rate).toFixed(2) : "0";
      return {
        name: student?.name || student?.studentName || "N/A",
        amount: amount.toString(),
        rate: rate.toString(),
        amountPayable,
        currencyCode: student?.currencyCode || student?.currency || null,
      };
    });
  };

  // Helper function to add text with specific styling
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
    } catch (error) {}
  };

  // Helper function to add logo and header (SYNCHRONOUS)
  // - preserves aspect ratio
  // - applies maxWidth and maxHeight
  // - vertically centers small logos relative to company block
  // - draws a horizontal separator line under the header
  const addLogo = (doc, currentY, isFirstPage = true) => {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    try {
      const logoX = margin;
      const logoY = currentY;
      const logoToUse = dashboardLogo ? dashboardLogo : logo1;

      // get natural dimensions
      const logoProps = doc.getImageProperties(logoToUse);
      // desired constraints
      const preferredWidth = 40; // mm
      const maxWidth = Math.min(preferredWidth, pageWidth * 0.22); // not larger than ~22% of page
      const maxHeight = 45; // mm - cap
      // compute scaled dimensions preserving aspect ratio
      let logoWidth = maxWidth;
      let logoHeight = (logoProps.height / logoProps.width) * logoWidth;
      if (logoHeight > maxHeight) {
        const scale = maxHeight / logoHeight;
        logoHeight = maxHeight;
        logoWidth = logoWidth * scale;
      }

      // company block approximate height (used for vertical centering)
      const companyBlockHeight = 45;

      // adjust Y so small logos get centered vertically relative to company block
      const adjustedLogoY =
        logoHeight < companyBlockHeight
          ? logoY + (companyBlockHeight - logoHeight) / 2
          : logoY;

      // draw logo
      doc.addImage(
        logoToUse,
        "PNG",
        logoX,
        adjustedLogoY,
        logoWidth,
        logoHeight
      );

      // company text (dynamic using applicationFeeInvoice.name)
      const companyX = logoX + logoWidth + 12;
      addText(
        doc,
        applicationFeeInvoice?.name.toUpperCase() || "",
        companyX,
        currentY + 12,
        {
          fontSize: 20,
          fontStyle: "bold",
          textColor: [0, 0, 0],
          fontFamily: "helvetica",
        }
      );
      addText(
        doc,
        `${applicationFeeInvoice?.application.toUpperCase() || ""}`,
        companyX,
        currentY + 26,
        {
          fontSize: 14,
          fontStyle: "bold",
          textColor: [0, 0, 0],
          fontFamily: "helvetica",
        }
      );
      // Draw address with automatic wrapping
      const maxAddressWidth = pageWidth;
      const addressText = applicationFeeInvoice?.address?.toUpperCase?.() || "";

      // Wrap address text safely
      const wrappedAddress = doc.splitTextToSize(addressText, maxAddressWidth);

      let addressY = currentY + 36;

      // Draw wrapped address lines
      wrappedAddress.forEach((line, index) => {
        addText(doc, line, companyX, addressY + index * 5, {
          fontSize: 10,
          fontStyle: "normal",
          textColor: [0, 0, 0],
          fontFamily: "helvetica",
        });
      });

      // Add GUJARAT - INDIA below address lines (auto position)
      const finalAddressY = addressY + wrappedAddress.length * 2 + 2;
      // addText(doc, "GUJARAT - INDIA", companyX, finalAddressY, {
      //   fontSize: 10,
      //   fontStyle: "normal",
      //   textColor: [0, 0, 0],
      //   fontFamily: "helvetica",
      // });

      // ---- Draw horizontal line below the address block ----
      const headerBottomY = finalAddressY + 6;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, headerBottomY, pageWidth - margin, headerBottomY);

      // return Y after the header
      return headerBottomY + 6;
    } catch (error) {
      // fallback: text-only header + a line
      const companyX = margin + 60;
      addText(doc, applicationFeeInvoice?.name || "", companyX, currentY + 12, {
        fontSize: 20,
        fontStyle: "bold",
        textColor: [0, 0, 0],
        fontFamily: "helvetica",
      });
      addText(
        doc,
        `${applicationFeeInvoice?.application || ""}`,
        companyX,
        currentY + 26,
        {
          fontSize: 14,
          fontStyle: "bold",
          textColor: [0, 0, 0],
          fontFamily: "helvetica",
        }
      );
      addText(
        doc,
        applicationFeeInvoice?.address || "",
        companyX,
        currentY + 36,
        {
          fontSize: 10,
          fontStyle: "normal",
          textColor: [0, 0, 0],
          fontFamily: "helvetica",
        }
      );
      // addText(doc, "GUJARAT - INDIA", companyX, currentY + 41, {
      //   fontSize: 10,
      //   fontStyle: "normal",
      //   textColor: [0, 0, 0],
      //   fontFamily: "helvetica",
      // });
      const pageWidth2 = doc.internal.pageSize.width;
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY + 50, pageWidth2 - margin, currentY + 50);
      return currentY + 60;
    }
  };

  // Add customer and invoice details (placed under the header separator)
  const addInvoiceDetails = (
    doc,
    customerName,
    invoiceNumber,
    invoiceDate,
    currentY
  ) => {
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const maxTextWidth = pageWidth - (margin + 70); // label ke baad available width

    if (typeof currentY !== "number" || isNaN(currentY)) {
      currentY = 100;
    }

    const details = [
      { label: "Customer's Name:", value: customerName || "N/A" },
      { label: "Invoice Number:", value: invoiceNumber || "N/A" },
      { label: "Invoice Date:", value: invoiceDate || "N/A" },
    ];

    details.forEach((detail) => {
      // Label
      addText(doc, detail.label, margin, currentY, {
        fontSize: 11,
        fontStyle: "bold",
        textColor: [0, 0, 0],
      });

      // Wrap value text safely within page
      const wrappedValue = doc.splitTextToSize(detail.value, maxTextWidth);
      wrappedValue.forEach((line, idx) => {
        addText(doc, line, margin + 45, currentY + idx * 6, {
          fontSize: 11,
          fontStyle: "normal",
          textColor: [0, 0, 0],
        });
      });

      currentY += wrappedValue.length * 6 + 2; // line height ke hisaab se space
    });

    return currentY + 10;
  };

  // Add service fee table
  const addServiceFeeTable = (doc, students, currentY, invoiceData) => {
    const margin = 20;
    if (typeof currentY !== "number" || isNaN(currentY)) {
      currentY = 150;
    }
    if (!Array.isArray(students)) {
      students = [];
    }
    const totalAmountPayable = students.reduce((sum, student) => {
      const amount = parseFloat(student?.amount || 0) || 0;
      const rate = parseFloat(student?.rate || 0) || 0;
      const payable = amount && rate ? amount * rate : 0;
      return sum + payable;
    }, 0);
    let studentCurrencyCodes = students.map(
      (s) => s.currencyCode || invoiceData?.currencyCode || "INR"
    );
    let uniqueCurrencyCodes = [
      ...new Set(studentCurrencyCodes.filter(Boolean)),
    ];
    let totalCurrencyCode =
      uniqueCurrencyCodes.length > 0 ? uniqueCurrencyCodes[0] : "INR";
    let currencySymbol =
      getSymbolFromCurrency(totalCurrencyCode) || totalCurrencyCode;
    if (currencySymbol === "₹") {
      currencySymbol = "INR";
    }
    const tableData = students.map((student, index) => [
      { content: (index + 1).toString(), styles: { halign: "center" } },
      { content: student?.name || "N/A", styles: { halign: "left" } },
      {
        content:
          `${getSymbolFromCurrency(student?.currencyCode || "INR")} ${
            student?.amount || "N/A"
          }` || "N/A",
        styles: { halign: "center" },
      },
      { content: student?.rate || "N/A", styles: { halign: "right" } },
      {
        content:
          parseFloat(student?.amount || 0) && parseFloat(student?.rate || 0)
            ? (parseFloat(student.amount) * parseFloat(student.rate)).toFixed(2)
            : "0",
        styles: { halign: "right" },
      },
    ]);

    // Add a few empty rows for spacing (optional)
    for (let i = 0; i < 3; i++) {
      tableData.push([
        { content: "", styles: { minCellHeight: 8 } },
        { content: "", styles: { minCellHeight: 8 } },
        { content: "", styles: { minCellHeight: 8 } },
        { content: "", styles: { minCellHeight: 8 } },
        { content: "", styles: { minCellHeight: 8 } },
      ]);
    }

    tableData.push([
      { content: "", styles: {} },
      { content: "", styles: {} },
      { content: "", styles: {} },
      { content: "TOTAL", styles: { halign: "right", fontStyle: "bold" } },
      {
        content: `${totalAmountPayable.toFixed(2)}`,
        styles: { halign: "right", fontStyle: "normal" },
      },
    ]);

    try {
      autoTable(doc, {
        startY: currentY,
        startX: margin,
        head: [["NO", "STUDENT NAME", "AMOUNT", "RATE", "AMOUNT PAYABLE"]],
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
        },
        // Use auto table width so columns are adjusted to available space
        tableWidth: "auto",
        columnStyles: {
          0: { cellWidth: 18, halign: "center" },
          1: { halign: "left" }, // let auto size
          2: { halign: "right" },
          3: { halign: "right" },
          4: { halign: "right" },
        },
        margin: { left: margin, right: margin, bottom: 35, top: 60 },
        didDrawPage: function (data) {
          const isFirstPage = doc.getCurrentPageInfo().pageNumber === 1;
          // addLogo is synchronous now
          addLogo(doc, 15, isFirstPage);
          // addFooter(doc);
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

  // Add payment information (removed the top dividing line as requested earlier)
  const addPaymentInformation = (doc, currentY) => {
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    if (typeof currentY !== "number" || isNaN(currentY)) {
      currentY = 200;
    }
    const estimatedPaymentHeight = 150;
    if (currentY + estimatedPaymentHeight > pageHeight - 50) {
      doc.addPage();
      currentY = 15;
      addLogo(doc, currentY, false);
      currentY = 80;
    }

    // Do not draw the top line here (per your request)
    currentY += 4;

    addText(doc, "PAYMENT INFORMATION", margin, currentY, {
      fontSize: 14,
      fontStyle: "bold",
      textColor: [0, 0, 0],
      fontFamily: "helvetica",
    });
    currentY += 6;
    const paymentDetails = [
      {
        label: "Bank Name:",
        value: applicationFeeInvoice?.bankDetails?.bankName || "-",
      },
      {
        label: "Account Name:",
        value: applicationFeeInvoice?.bankDetails?.accountName || "-",
      },
      {
        label: "Account Number:",
        value: applicationFeeInvoice?.bankDetails?.accountNumber || "-",
      },
      {
        label: "Bank Address:",
        value: applicationFeeInvoice?.bankDetails?.bankAddress || "-",
      },
      // { label: "", value: "Surat - 395007" },
      {
        label: "IFSC Code:",
        value: applicationFeeInvoice?.bankDetails?.IFSCCode || "-",
      },
      {
        label: "Swift Code:",
        value: applicationFeeInvoice?.bankDetails?.SwiftCode || "-",
      },
    ];
    paymentDetails.forEach((detail, index) => {
      if (index === 0) {
        currentY += 6;
      }
      addText(doc, detail.label, margin, currentY, {
        fontSize: 12,
        fontStyle: "bold",
        textColor: [0, 0, 0],
        fontFamily: "helvetica",
      });
      addText(doc, detail.value, margin + 40, currentY, {
        fontSize: 12,
        fontStyle: "normal",
        textColor: [0, 0, 0],
        fontFamily: "helvetica",
      });
      // if (index === 3) {
      //   currentY += 4;
      // } else {
      currentY += 8;
      // }
    });
    return currentY + 2;
  };

  // Add note/refund policy
  const addNote = (doc, currentY) => {
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    if (typeof currentY !== "number" || isNaN(currentY)) {
      currentY = 250;
    }
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;
    addText(doc, "NOTE", margin, currentY, {
      fontSize: 14,
      fontStyle: "bold",
      textColor: [0, 0, 0],
      fontFamily: "helvetica",
    });
    currentY += 8;
    const noteText = applicationFeeInvoice?.notes;
    const maxWidth = pageWidth - margin * 2;
    const lines = doc.splitTextToSize(noteText, maxWidth);
    lines.forEach((line) => {
      addText(doc, line, margin, currentY, {
        fontSize: 12,
        fontStyle: "normal",
        textColor: [0, 0, 0],
        fontFamily: "helvetica",
      });
      currentY += 6;
    });
    currentY += 3;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    return currentY + 2;
  };

  // Add footer
  // const addFooter = (doc) => {
  //   const margin = 20;
  //   const pageHeight = doc.internal.pageSize.height;
  //   addText(doc, "www.rginternational.org", margin, pageHeight - 15, {
  //     fontSize: 10,
  //     fontStyle: "normal",
  //     textColor: [0, 0, 0],
  //   });
  // };

  // Add footer to all pages
  // const addFooterToAllPages = (doc) => {
  //   const totalPages = doc.getNumberOfPages();
  //   for (let i = 1; i <= totalPages; i++) {
  //     doc.setPage(i);
  //     addFooter(doc);
  //   }
  // };

  // Main method to generate the complete invoice
  const handleDownload = async () => {
    try {
      if (!invoiceData) {
        throw new Error("Invoice data is required");
      }
      const {
        customerName = "N/A",
        invoiceNumber = "N/A",
        invoiceDate = new Date().toLocaleDateString("en-GB"),
        students = [],
      } = invoiceData;
      const processedStudents = processStudentData(students);
      const doc = new jsPDF();
      let currentY = 15;
      currentY = addLogo(doc, currentY, true);
      currentY = addInvoiceDetails(
        doc,
        customerName,
        invoiceNumber,
        invoiceDate,
        currentY
      );
      currentY = addServiceFeeTable(
        doc,
        processedStudents,
        currentY,
        invoiceData
      );
      currentY = addPaymentInformation(doc, currentY);
      currentY = addNote(doc, currentY);
      // addFooterToAllPages(doc);
      const filename = `${invoiceNumber.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}_${invoiceDate.replace(/\//g, "_")}.pdf`;
      doc.save(filename);
    } catch (error) {
      throw new Error(`Failed to generate invoice: ${error.message}`);
    }
  };

  return {
    handleDownload,
  };
};

export default InvoicePDFGenerator;
