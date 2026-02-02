// src/components/B2BInvoiceTemplate.js
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const B2BInvoiceTemplate = ({
  dataToExport,
  invoiceDate,
  invoiceNumber,
  dashboardLogo,
  b2bDetailsList,
  b2bCommissionInvoice,
}) => {
  // Helper function to convert number to words
  const numberToWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    if (num === 0) return "Zero";
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      return (
        tens[Math.floor(num / 10)] +
        (num % 10 !== 0 ? " " + ones[num % 10] : "")
      );
    }
    if (num < 1000) {
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 !== 0 ? " and " + numberToWords(num % 100) : "")
      );
    }
    if (num < 100000) {
      return (
        numberToWords(Math.floor(num / 1000)) +
        " Thousand" +
        (num % 1000 !== 0 ? " " + numberToWords(num % 1000) : "")
      );
    }
    if (num < 10000000) {
      return (
        numberToWords(Math.floor(num / 100000)) +
        " Lakh" +
        (num % 100000 !== 0 ? " " + numberToWords(num % 100000) : "")
      );
    }
    if (num < 1000000000) {
      return (
        numberToWords(Math.floor(num / 10000000)) +
        " Crore" +
        (num % 10000000 !== 0 ? " " + numberToWords(num % 10000000) : "")
      );
    }
    return (
      numberToWords(Math.floor(num / 1000000000)) +
      " Arab" +
      (num % 1000000000 !== 0 ? " " + numberToWords(num % 1000000000) : "")
    );
  };

  // Calculate commission for each item
  const calculateCommission = (item) => {
    try {
      // Tuition Fee calculation
      const tuitionFee = item?.interestedCourseDetails?.[0]?.instituteFeePayment
        ?.feeAmount
        ? parseFloat(
            item.interestedCourseDetails[0].instituteFeePayment.feeAmount
              .toString()
              .replace(/,/g, "")
          )
        : 0;

      // University Commission calculation
      const universityCommissionType =
        item?.universitySideConfirmation?.commissionType;
      const universityCommissionPercent = parseFloat(
        item?.universitySideConfirmation?.commissionPercentage || 0
      );
      const universityCommissionAmount =
        universityCommissionType === "Percentage"
          ? (tuitionFee * universityCommissionPercent) / 100
          : parseFloat(item?.universitySideConfirmation?.commissionAmount || 0);

      // B2B/Branch Commission calculation
      const b2bCommissionType =
        item?.universityPaymentReceived?.b2bCommission?.commissionType;
      const b2bCommissionPercent = parseFloat(
        item?.universityPaymentReceived?.b2bCommission?.commissionPercentage ||
          0
      );
      const b2bCommissionAmount =
        b2bCommissionType === "Percentage"
          ? (universityCommissionAmount * b2bCommissionPercent) / 100
          : parseFloat(
              item?.universityPaymentReceived?.b2bCommission
                ?.commissionAmount || 0
            );

      return {
        type: b2bCommissionType || "N/A",
        percentage: b2bCommissionPercent,
        amount: b2bCommissionAmount || 0,
        universityCommissionAmount: universityCommissionAmount || 0,
      };
    } catch (error) {
      console.error("Error calculating commission:", error);
      return {
        type: "N/A",
        percentage: 0,
        amount: 0,
        universityCommissionAmount: 0,
      };
    }
  };

  // Calculate total commission amount
  const totalCommission = dataToExport.reduce((sum, item) => {
    const commission = calculateCommission(item);
    return sum + commission.amount;
  }, 0);

  // Calculate GST (18% IGST for inter-state transactions)
  const cgst = totalCommission * 0.09; // 9% CGST
  const sgst = totalCommission * 0.09; // 9% SGST
  // const igst = totalCommission * 0.18; // 18% IGST
  const totalInvoiceValue = totalCommission + cgst + sgst; // Using IGST for inter-state

  const totalCommissionInWords = `${numberToWords(
    Math.floor(totalInvoiceValue)
  )} Rupees Only`;
  const totalCommissionNumber = totalCommission.toFixed(2);
  const cgstNumber = cgst.toFixed(2);
  const sgstNumber = sgst.toFixed(2);
  // const igstNumber = igst.toFixed(2);
  const totalInvoiceValueNumber = totalInvoiceValue.toFixed(2);

  // Function to trigger download
  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const format = blob.type.split("/")[1].toUpperCase();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ base64: reader.result, format });
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Helper to get image dimensions from base64 (returns a promise)
  const getImageDimensions = (base64) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.src = base64;
    });
  };

  const handleDownload = async () => {
    try {
      let logoBase64 = null,
        logoFormat = "PNG",
        logoWidth = 40,
        logoHeight = 20;
      // Preload logo base64 and dimensions before any PDF rendering
      if (dashboardLogo) {
        const { base64, format } = await getBase64FromUrl(dashboardLogo);
        logoBase64 = base64;
        logoFormat = format;

        const { width, height } = await getImageDimensions(base64);

        // ✅ Fit logo dynamically into a bounding box (40×20 mm)
        const maxWidth = 40;
        const maxHeight = 20;

        if (width && height) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          logoWidth = width * ratio;
          logoHeight = height * ratio;
        } else {
          logoWidth = maxWidth;
          logoHeight = maxHeight;
        }
      }
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Header function to draw only the logo on every page (no async, only preloaded values)
      const drawLogoHeader = () => {
        if (logoBase64) {
          doc.addImage(logoBase64, logoFormat, 12, 8, logoWidth, logoHeight);
        }
        // Push content just below the logo
        return 8 + logoHeight + 10;
      };

      // Draw logo header on first page and get y offset
      let y = drawLogoHeader();

      // TAX INVOICE title and subtitle only on first page
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("TAX INVOICE", pageWidth / 2, y, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("(Original for Recipient)", pageWidth / 2, y + 8, {
        align: "center",
      });
      y += 20;

      // Recipient details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("To,", 12, y);
      doc.text(b2bCommissionInvoice?.name || "RG International", 12, y + 7);
      const addressLines = (b2bCommissionInvoice?.address || "N/A").split(", ");
      let addressY = y + 14;
      addressLines.forEach((line, index) => {
        doc.text(line.trim(), 12, addressY + index * 7);
      });
      // doc.text("603, 6th Floor Swastik House", 12, y + 14);
      doc.text("Lakeview Garden Restaurant", 12, y + 21);
      doc.text("Kargil Chowk Piplod", 12, y + 28);
      doc.text("Surat - 395007 Gujarat", 12, y + 35);
      doc.text("GST: 24AASFR4502N1ZT", 12, y + 42);
      doc.text(`Tax Invoice No: ${invoiceNumber}`, 12, y + 49);
      doc.text(`Date of Invoice: ${invoiceDate}`, 12, y + 56);

      y += 70;

      // Commission details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const commissionText =
        "Please pay the Commission for the students recruited on our behalf as listed below:";
      doc.text(commissionText, 12, y);
      // Underline the text
      const textWidth = doc.getTextWidth(commissionText);
      doc.setLineWidth(0.3);
      doc.setDrawColor(0, 0, 0); // Black color
      doc.line(12, y + 2, 12 + textWidth, y + 2);

      y += 15;

      // Table data
      const dataRows = dataToExport.map((item, idx) => {
        const commission = calculateCommission(item);
        const commissionDisplay =
          commission.type === "Percentage"
            ? `${commission.percentage || 0}% (${(
                commission.amount || 0
              ).toFixed(2)})`
            : commission.type === "Amount"
            ? (commission.amount || 0).toFixed(2)
            : "N/A";

        return [
          { content: `${idx + 1}.`, styles: { halign: "center" } },
          { content: "Commission", styles: { halign: "center" } },
          {
            content: "996211",
            styles: { fontStyle: "bold", halign: "center" },
          },
          { content: item?.name || "N/A", styles: { halign: "center" } },
          {
            content:
              item?.interestedCourseDetails?.[0]?.institute?.instituteName ||
              "N/A",
            styles: { halign: "center" },
          },
          {
            content: `${
              item?.purposeDetails?.intakeMonth?.[0]?.toUpperCase() || ""
            }${item?.purposeDetails?.intakeYear?.[0]?.slice(-2) || ""}`,
            styles: { halign: "center" },
          },
          { content: commissionDisplay, styles: { halign: "right" } },
        ];
      });

      // Add empty rows for spacing (as in image)
      for (let i = 0; i < 4; i++) {
        dataRows.push([
          { content: "", styles: { minCellHeight: 8 } },
          { content: "", styles: { minCellHeight: 8 } },
          { content: "", styles: { minCellHeight: 8 } },
          { content: "", styles: { minCellHeight: 8 } },
          { content: "", styles: { minCellHeight: 8 } },
          { content: "", styles: { minCellHeight: 8 } },
          { content: "", styles: { minCellHeight: 8 } },
        ]);
      }

      // Summary rows
      const summaryRows = [
        [
          { content: "" },
          { content: "" },
          { content: "" },
          {
            content: "TOTAL VALUE",
            colSpan: 3,
            styles: {
              fontStyle: "bold",
              halign: "center",
              fillColor: [249, 249, 249],
              lineColor: [0, 0, 0],
            },
          },
          {
            content: `${totalCommissionNumber}`,
            styles: {
              fontStyle: "bold",
              halign: "right",
              fillColor: [249, 249, 249],
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          { content: "" },
          { content: "" },
          { content: "" },
          {
            content: "Add: - CGST @9%",
            colSpan: 3,
            styles: { halign: "left", lineColor: [0, 0, 0] },
          },
          {
            content: `${cgstNumber}`,
            styles: { halign: "right", lineColor: [0, 0, 0] },
          },
        ],
        [
          { content: "" },
          { content: "" },
          { content: "" },
          {
            content: "Add: - SGST @9%",
            colSpan: 3,
            styles: { halign: "left", lineColor: [0, 0, 0] },
          },
          {
            content: `${sgstNumber}`,
            styles: { halign: "right", lineColor: [0, 0, 0] },
          },
        ],
        [
          { content: "" },
          {
            content: "Add: - IGST@18%",
            colSpan: 5,
            styles: { lineColor: [0, 0, 0] },
          },
          { content: "", styles: { halign: "right", lineColor: [0, 0, 0] } },
        ],
        [
          {
            content: "A",
            styles: {
              fontStyle: "bold",
              fillColor: [217, 211, 179],
              halign: "center",
              lineColor: [0, 0, 0],
            },
          },
          {
            content: "Total Invoice Value (in figures)",
            colSpan: 5,
            styles: {
              fontStyle: "bold",
              fillColor: [217, 211, 179],
              halign: "left",
              lineColor: [0, 0, 0],
            },
          },
          {
            content: `${totalInvoiceValueNumber}`,
            styles: {
              fontStyle: "bold",
              fillColor: [217, 211, 179],
              halign: "right",
              lineColor: [0, 0, 0],
            },
          },
        ],
        [
          {
            content: "B",
            styles: {
              fontStyle: "bold",
              fillColor: [217, 211, 179],
              halign: "center",
              lineColor: [0, 0, 0],
            },
          },
          {
            content: `Total Invoice Value (in words): - ${totalCommissionInWords}`,
            colSpan: 6,
            styles: {
              fontStyle: "bold",
              fillColor: [217, 211, 179],
              halign: "left",
              lineColor: [0, 0, 0],
            },
          },
        ],
      ];

      const tableColumns = [
        { header: "Sr. No.", dataKey: "srno" },
        { header: "Name of the Services", dataKey: "service" },
        { header: "SAC / HSN Code", dataKey: "sac" },
        { header: "Name of the Student", dataKey: "student" },
        { header: "Name of the Institution", dataKey: "institute" },
        { header: "Intake", dataKey: "intake" },
        { header: "Commission in (Rs.)", dataKey: "commission" },
      ];

      autoTable(doc, {
        startY: y,
        head: [tableColumns.map((col) => col.header)],
        body: dataRows.concat(summaryRows),
        theme: "grid",
        pageBreak: "auto",
        margin: { left: 12, right: 12, bottom: 35, top: 40 },
        styles: {
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [217, 211, 179], // #d9d3b3
          textColor: 0,
          halign: "center",
          fontStyle: "bold",
          fontSize: 11,
          valign: "middle",
          lineWidth: 0.1,
          lineColor: [0, 0, 0], // Black border
        },
        bodyStyles: {
          textColor: 0,
          fontSize: 10,
          valign: "middle",
          lineWidth: 0.1,
          lineColor: [0, 0, 0], // Black border
        },
        styles: {
          cellPadding: 3,
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 15 },
          1: { halign: "center", cellWidth: 30 },
          2: { halign: "center", cellWidth: 25 },
          3: { halign: "center", cellWidth: 35 },
          4: { halign: "center", cellWidth: 35 },
          5: { halign: "center", cellWidth: 20 },
          6: { halign: "right", cellWidth: 30 },
        },
        willDrawPage: (data) => {
          // Add extra top margin for pages after the first page
          if (data.pageNumber > 1) {
            data.startY = data.startY + 25; // Add 25mm extra space after header on subsequent pages
          }
        },
        didDrawPage: (data) => {
          drawLogoHeader();
        },
        showHead: "firstPage",
      });

      // After table, add bank details
      let finalY = doc.lastAutoTable.finalY + 10;
      const minSpaceNeeded = 80;
      if (finalY + minSpaceNeeded > pageHeight - 20) {
        doc.addPage();
        finalY = 20;
      }

      // Bank details
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("PAN No.:", 12, finalY);
      doc.setFont("helvetica", "bold");
      doc.text("GST: -", 12, finalY + 7);
      doc.text("BANK DETAILS:", 12, finalY + 14);
      doc.setFont("helvetica", "normal");
      let bankY = finalY + 21;
      // Show only the first bank details entry (or N/A if empty)
      const details =
        Array.isArray(b2bDetailsList) && b2bDetailsList.length > 0
          ? b2bDetailsList[0]
          : null;
      doc.text(`Bank Name: ${details?.bankName || "N/A"}`, 12, bankY);
      doc.text(`Branch Address: ${details?.branch || "N/A"}`, 12, bankY + 7);
      doc.text(
        `Account Name: ${details?.accountName || "N/A"}`,
        12,
        bankY + 14
      );
      doc.text(
        `Account No: ${details?.accountNumber || "N/A"}`,
        12,
        bankY + 21
      );
      doc.text(`IFSC Code: ${details?.ifscCode || "N/A"}`, 12, bankY + 28);
      bankY += 35;
      finalY = bankY + 10;

      // Certification and signature
      doc.text(
        "Certified that the particulars given above are true and correct.",
        12,
        finalY
      );
      doc.text("For", 12, finalY + 7);

      finalY += 20;
      doc.text("(Sign & Stamp)", 12, finalY);
      doc.text("Name of the Signatory", 12, finalY + 7);
      doc.text("Designation", 12, finalY + 14);

      doc.save(`b2b_invoice_${invoiceDate.replace("/", "_")}.pdf`);
      toast.success("B2B Invoice PDF downloaded successfully!");
    } catch (error) {
      toast.error("Something went wrong while generating the PDF.");
      console.error("Error generating PDF:", error);
    }
  };

  // Return only the function to trigger download
  return {
    handleDownload,
  };
};

export default B2BInvoiceTemplate;
