// src/components/InvoiceTemplate.js
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const InvoiceTemplate = ({
  dataToExport,
  invoiceDate,
  invoiceNumber,
  dashboardLogo,
  uniCommissionInvoice,
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
    return (
      numberToWords(Math.floor(num / 10000000)) +
      " Crore" +
      (num % 10000000 !== 0 ? " " + numberToWords(num % 10000000) : "")
    );
  };

  // Extract institute name, intake year, and month from the first item
  const instituteName =
    dataToExport[0]?.interestedCourseDetails?.[0]?.institute?.instituteName ||
    "Unknown University";
  const intakeYear = dataToExport[0]?.purposeDetails?.intakeYear?.[0] || "2024";
  const intakeMonth =
    dataToExport[0]?.purposeDetails?.intakeMonth?.[0] || "Autumn";

  // Calculate total commission amount
  const totalCommission = dataToExport.reduce((sum, item) => {
    if (item?.universitySideConfirmation?.commissionType === "Percentage") {
      const percentage = item?.universitySideConfirmation?.commissionPercentage;
      const commissionValues = item?.interestedCourseDetails
        ?.map((course) => {
          let feeAmount = course.instituteFeePayment?.feeAmount;
          if (feeAmount && typeof feeAmount === "string") {
            feeAmount = feeAmount.replace(/,/g, "");
          }
          if (feeAmount && !isNaN(feeAmount) && percentage) {
            return (parseFloat(feeAmount) * parseFloat(percentage)) / 100;
          }
          return 0;
        })
        .filter((val) => val > 0);
      return (
        sum +
        (commissionValues.length > 0
          ? commissionValues.reduce((a, b) => a + b, 0)
          : 0)
      );
    } else {
      return (
        sum +
        (parseFloat(item?.universitySideConfirmation?.commissionAmount) || 0)
      );
    }
  }, 0);

  const totalCommissionInWords = `${numberToWords(
    Math.floor(totalCommission)
  )} Euro Only`;

  // Format total commission as number with 2 decimal places
  const totalCommissionNumber = totalCommission.toFixed(2);

  // Function to trigger download
  const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const format = blob.type.split("/")[1].toUpperCase(); // "PNG" or "JPEG"
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ base64: reader.result, format });
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleDownload = async () => {
    try {
      let logoBase64 = null,
        logoFormat = "PNG",
        logoWidth = 40,
        logoHeight = 20;
      if (dashboardLogo) {
        const { base64, format } = await getBase64FromUrl(dashboardLogo);
        logoBase64 = base64;
        logoFormat = format;
        // Get original image dimensions
        // Set fixed logo dimensions
        logoWidth = 38; // Fixed width in mm
        logoHeight = 35; // Fixed height in mm
      }
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // HEADER
      const header = () => {
        // White background - increased height to accommodate larger logo
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, 40, "F");

        // Logo (left)
        let logoX = 10;
        let logoY = 5;
        if (logoBase64) {
          doc.addImage(
            logoBase64,
            logoFormat,
            logoX,
            logoY,
            logoWidth,
            logoHeight
          );
        }

        // Title (center-left aligned with wrapping)
        doc.setTextColor(13, 54, 85); // dark blue
        doc.setFontSize(21);
        doc.setFont("helvetica", "bold");

        const title = uniCommissionInvoice?.name || "";
        const marginLeft = pageWidth / 3; // start position for title
        const marginRight = 15; // right margin
        const availableWidth = pageWidth - marginLeft - marginRight;

        // Split long text into multiple lines if needed
        const wrappedText = doc.splitTextToSize(title, availableWidth);

        // Vertically align title with logo
        const textY = logoY + logoHeight * 0.6;

        // Draw wrapped text
        doc.text(wrappedText, marginLeft, textY, { align: "left" });

        // Black line below header
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(1);
        doc.line(0, 50, pageWidth, 50);
      };

      // FOOTER
      const footer = () => {
        // Footer bar height
        const barHeight = 28;
        const yStart = pageHeight - barHeight;

        // Draw dark blue bar
        doc.setFillColor(0, 32, 96);
        doc.rect(0, yStart, pageWidth, barHeight, "F");

        // Set text color to white
        doc.setTextColor(255, 255, 255);

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(uniCommissionInvoice?.name || "", pageWidth / 2, yStart + 8, {
          align: "center",
        });

        // Address lines
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        const address = (uniCommissionInvoice?.address || "").replace(
          /\s*,\s*/g,
          ", "
        );
        if (address) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.text(address, pageWidth / 2, yStart + 18, {
            align: "center",
            maxWidth: pageWidth - 20,
          });
        }
        // const addressLines = (uniCommissionInvoice?.address || "").split(", ");
        // addressLines.forEach((line, index) => {
        //   doc.text(line, pageWidth / 2, yStart + 15 + index * 7, {
        //     align: "center",
        //   });
        // });
        
        // doc.text(
        //   "Block B, Office-BOB-165, Sharjah Research Technology and innovation Park,",
        //   pageWidth / 2,
        //   yStart + 15,
        //   { align: "center" }
        // );
        // doc.text("P.O. Box 66636,Sharjah  UAE", pageWidth / 2, yStart + 22, {
        //   align: "center",
        // });

        // Reset text color for rest of doc
        doc.setTextColor(0, 0, 0);
      };

      // Add header/footer to every page
      const addHeaderFooter = (data) => {
        header();
        footer();
      };

      // After header, before other content
      const invoiceY = 65; // more space from the top to account for larger header

      // INVOICE title (centered, bold, underlined)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      const invoiceText = "INVOICE";
      doc.text(invoiceText, pageWidth / 2, invoiceY, { align: "center" });
      const textWidth = doc.getTextWidth(invoiceText);
      doc.setLineWidth(0.7);
      doc.line(
        pageWidth / 2 - textWidth / 2,
        invoiceY + 1.5,
        pageWidth / 2 + textWidth / 2,
        invoiceY + 1.5
      );

      // Date and Invoice Number (right, next line, with more space below INVOICE)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const rightX = pageWidth - 18;
      const dateY = invoiceY + 14; // more space below INVOICE
      doc.text(`Date:   ${invoiceDate}`, rightX, dateY, { align: "right" });
      doc.text(`Invoice Number: ${invoiceNumber}`, rightX, dateY + 6, {
        align: "right",
      });

      // Move y for next content, with more space
      let y = dateY + 16;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(uniCommissionInvoice?.name || "", 12, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      if (uniCommissionInvoice?.address) {
        const addressLinesSender = (uniCommissionInvoice?.address || "").split(
          ", "
        );
        addressLinesSender.forEach((line, index) => {
          doc.text(line, 12, y + index * 6);
        });
        y += addressLinesSender.length * 5;
      }

      // doc.text(
      //   `TAX REGISTRATION NO.: ${
      //     uniCommissionInvoice?.taxRegistrationNo || "-"
      //   }`,
      //   12,
      //   y + 31
      // );
      // doc.text(
      //   `Phone No.: ${uniCommissionInvoice?.phoneNo || "-"}`,
      //   12,
      //   y + 36
      // );
      if (uniCommissionInvoice?.taxRegistrationNo) {
        doc.text(
          `TAX REGISTRATION NO.: ${uniCommissionInvoice.taxRegistrationNo}`,
          12,
          y + 6
        );
        y += 6;
      }

      // Phone
      if (uniCommissionInvoice?.phoneNo) {
        doc.text(`Phone No.: ${uniCommissionInvoice.phoneNo}`, 12, y + 6);
        y += 6;
      }

      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(`To: ${instituteName}`, 12, y);
      doc.text("P.O. Box 836", 12, y + 7);
      doc.text("00074 CGI", 12, y + 14);
      doc.text("Finland", 12, y + 21);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("VAT Number: FI02459042", 12, y + 31);

      let y2 = y + 41;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const blackText1 = `Please pay the commission for the students recruited in ${intakeMonth} ${intakeYear} Academic year ${intakeYear} Intake`;
      const blackText2 = "as listed below: -";
      const blackText3 =
        "Below are some details which is the same for every student:";

      // First black underlined line
      doc.setTextColor(0, 0, 0);
      doc.text(blackText1, 12, y2);
      const blackText1Width = doc.getTextWidth(blackText1);
      doc.setLineWidth(0.7);
      doc.line(12, y2 + 2, 12 + blackText1Width, y2 + 2);

      // Second black underlined line, directly below
      let y3 = y2 + 7;
      doc.text(blackText2, 12, y3);
      const blackText2Width = doc.getTextWidth(blackText2);
      doc.line(12, y3 + 2, 12 + blackText2Width, y3 + 2);

      // Third black underlined line, with a small gap
      let y4 = y3 + 10;
      doc.text(blackText3, 12, y4);
      const blackText3Width = doc.getTextWidth(blackText3);
      doc.line(12, y4 + 2, 12 + blackText3Width, y4 + 2);

      // Update y for next section
      y = y4 + 8;

      const dataRows = dataToExport.map((item, idx) => {
        // For PDF, show percentage format but calculate total from actual amounts
        let commissionAmount = 0;
        let displayAmount = "";

        if (item?.universitySideConfirmation?.commissionType === "Percentage") {
          const percentage =
            item?.universitySideConfirmation?.commissionPercentage;
          const commissionValues = item?.interestedCourseDetails
            ?.map((course) => {
              let feeAmount = course.instituteFeePayment?.feeAmount;
              if (feeAmount && typeof feeAmount === "string") {
                feeAmount = feeAmount.replace(/,/g, "");
              }
              if (feeAmount && !isNaN(feeAmount) && percentage) {
                const calculatedAmount =
                  (parseFloat(feeAmount) * parseFloat(percentage)) / 100;
                return calculatedAmount;
              }
              return 0;
            })
            .filter((val) => val > 0);

          commissionAmount =
            commissionValues.length > 0
              ? commissionValues.reduce((a, b) => a + b, 0)
              : 0;
          displayAmount = `${percentage}% (${commissionAmount.toFixed(2)})`;
        } else {
          commissionAmount =
            parseFloat(item?.universitySideConfirmation?.commissionAmount) || 0;
          displayAmount = commissionAmount.toFixed(2);
        }

        return [
          idx + 1,
          item.name || "N/A",
          item.DOB ? new Date(item.DOB).toLocaleDateString("en-GB") : "N/A",
          item?.interestedCourseDetails?.[0]?.course?.programName || "N/A",
          displayAmount,
        ];
      });

      const tableColumns = [
        "Sr. No",
        "Full Name",
        "Date of Birth (yyyy/mm/dd)",
        "Program Name",
        "Commission Amount, Euro (EUR)",
      ];

      // Remove tableFooter and instead add custom footer rows after the data rows
      autoTable(doc, {
        startY: y,
        head: [tableColumns],
        body: dataRows.concat([
          [
            {
              content: "",
              colSpan: 3,
              styles: {
                fillColor: [168, 167, 133],
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
              },
            },
            {
              content: "",
              styles: {
                fillColor: [168, 167, 133],
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
              },
            },
            {
              content: `${totalCommissionNumber}`,
              styles: {
                fontStyle: "bold",
                fillColor: [168, 167, 133],
                halign: "start",
                valign: "middle",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
              },
            },
          ],
          [
            {
              content: "Total Commission amount in words:",
              colSpan: 3,
              styles: {
                fontStyle: "bold",
                fillColor: [168, 167, 133],
                halign: "left",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
              },
            },
            {
              content: totalCommissionInWords,
              colSpan: 2,
              styles: {
                fontStyle: "bold",
                fillColor: [168, 167, 133],
                halign: "left",
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
              },
            },
          ],
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [168, 167, 133],
          textColor: 0,
          halign: "left",
          fontStyle: "bold",
          fontSize: 12,
          valign: "middle",
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
        bodyStyles: {
          textColor: 0,
          halign: "left",
          fontSize: 11,
          valign: "middle",
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
        margin: { top: 60, left: 12, right: 12, bottom: 60 },
        tableLineWidth: 0.1,
        tableLineColor: [0, 0, 0],
        didDrawPage: addHeaderFooter,
        showHead: "firstPage",
      });

      // After table, add bank details and signature only
      let finalY = doc.lastAutoTable.finalY + 10;
      const minSpaceNeeded = 100; // Height needed for bank details/signature (increase for safety)
      if (finalY + minSpaceNeeded > pageHeight - 32) {
        doc.addPage();
        header();
        footer();
        finalY = 65; // Match the top margin used for the table and other content
      }

      // Add space before BANK DETAILS heading
      finalY += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("BANK DETAILS: -", 12, finalY);
      // Underline the heading
      const bankDetailsTextWidth = doc.getTextWidth("BANK DETAILS: -");
      doc.setLineWidth(0.7);
      doc.line(12, finalY + 1.5, 12 + bankDetailsTextWidth, finalY + 1.5);
      // Add space after the heading
      finalY += 6;

      // const bankTableBody = [
      //   ["Payment:", "Bank Transfer"],
      //   ["Account Owner Name:", "Kurm Infotech FZC"],
      //   [
      //     "Account Owner Address:",
      //     "B08 – 165, Block B, Sharjah Research Technology and Innovation Park, Sharjah, United Arab Emirates",
      //   ],
      //   ["Bank Name:", "RAK BANK UAE"],
      //   ["Account Number:", "0333125934002"],
      //   ["SWIFT Code:", "NRAKAEAK"],
      //   ["IBAN:", "AE47 0400 0003 3312 5934 002"],
      // ];
      const bankTableBody = [
        ["Payment:", "Bank Transfer"],
        [
          "Account Owner Name:",
          uniCommissionInvoice?.bankDetails?.accountOwnerName || "",
        ],
        [
          "Account Owner Address:",
          uniCommissionInvoice?.bankDetails?.accountOwnerAddress || "",
        ],
        ["Bank Name:", uniCommissionInvoice?.bankDetails?.bankName || ""],
        [
          "Account Number:",
          uniCommissionInvoice?.bankDetails?.accountNumber || "",
        ],
        ["SWIFT Code:", uniCommissionInvoice?.bankDetails?.SWIFTCode || ""],
        ["IBAN:", uniCommissionInvoice?.bankDetails?.IBAN || ""],
      ];

      autoTable(doc, {
        startY: finalY + 4,
        body: bankTableBody,
        theme: "grid",
        styles: {
          fontSize: 11,
          font: "helvetica",
          textColor: 0,
          cellPadding: 3,
          valign: "middle",
          halign: "left",
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
        columnStyles: {
          0: {
            fontStyle: "bold",
            font: "helvetica",
            fontSize: 11,
            textColor: 0,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            cellWidth: 50,
          },
          1: {
            fontStyle: "normal",
            font: "helvetica",
            fontSize: 11,
            textColor: 0,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            cellWidth: 120,
          },
        },
        tableWidth: 170,
        margin: { left: 12, right: 12 },
        tableLineWidth: 0.1,
        tableLineColor: [0, 0, 0],
        head: [],
      });

      finalY = doc.lastAutoTable.finalY + 8;

      // Estimate the space needed for the signature section (about 40mm)
      const signatureSpace = 40;
      if (finalY + signatureSpace > pageHeight - 32) {
        doc.addPage();
        header();
        footer();
        finalY = 70; // Reset to top margin
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(
        "•    This is an electronic copy it doesn't required stamp and signature.",
        14,
        finalY + 8
      );

      doc.setFont("helvetica", "bold");
      doc.text("For,", 14, finalY + 20);
      doc.text(uniCommissionInvoice?.name || "", 14, finalY + 28);

      doc.save(`university_commissions_${invoiceDate.replace("/", "_")}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Something went wrong while generating the PDF.");
      console.error("Error generating PDF:", error);
    }
  };

  // Return only the download function since HTML template is not used
  return {
    handleDownload,
  };
};

export default InvoiceTemplate;
