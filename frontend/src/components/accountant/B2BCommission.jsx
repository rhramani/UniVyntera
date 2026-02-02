import { Button, Card, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch } from "react-redux";
import { decryptData } from "../../utils/encryptionUtils";
import usePermissions from "../commonComponents/usePermissions";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { AiOutlineClose } from "react-icons/ai";
import Select from "react-select";
import {
  getTotalB2BCommission,
  getTotalCommissionCountry,
  getTotalCommissionUniversity,
  commissionQueryMail,
  commissionEditInvoice,
} from "../../redux/actions/Accountant/UniversityCom.action";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { useFormik } from "formik";
import {
  getOneStudentApplication,
  updateStudentApplication,
} from "../../redux/actions/Student/StudentApplication.action";
import { getAllAccountantStatus } from "../../redux/actions/Master/AccountantStatus.action";
import Paginations from "../elements/Paginations";
import getSymbolFromCurrency from "currency-symbol-map";
import B2BInvoiceTemplate from "./B2BInvoiceTemplate";
import { getAllSetting } from "../../redux/actions/Setting.action";
import ALLImages from "../../common/Imagedata";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { MdCalendarToday } from "react-icons/md";
import { getAllBankingDetails } from "../../redux/actions/Master/Banking.action";
import { getAllConfigurations } from "../../redux/actions/Configuration.action";
import { BASEURL } from "../../baseUrl";

const B2BCommission = () => {
  const dispatch = useDispatch();

  const [commissionData, setCommissionData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [instituteData, setInstituteData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [b2BCommissionStatus, setB2BCommissionStatus] = useState([]);
  const [dashboardLogo, setDashboardLogo] = useState(ALLImages("logo1"));
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: "",
    invoiceDate: "",
  });
  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarksText, setRemarksText] = useState("");
  const [selectedStudentForRemarks, setSelectedStudentForRemarks] =
    useState(null);
  const [exportData, setExportData] = useState([]);
  const [hasPaymentProof, setHasPaymentProof] = useState(false);

  const [isInvoiceEdit, setIsInvoiceEdit] = useState(false);
  const [isSingleDownload, setIsSingleDownload] = useState(false);
  const [totalCommissionAmount, setTotalCommissionAmount] = useState(0);
  const [bankingDetails, setBankingDetails] = useState([]);
  const [configData, setConfigData] = useState(null);

  const userRole = decryptData(localStorage.getItem("role"));
  const userType = decryptData(localStorage.getItem("userRole"));
  const { canCreate, canRead, canUpdate, canDelete, canDownload } =
    usePermissions("B2B Commission");

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    institute: null,
    country: null,
    status: null,
  });

  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const [showInvoiceDateCalendar, setShowInvoiceDateCalendar] = useState(false);
  const [invoiceDateValue, setInvoiceDateValue] = useState(null);
  const invoiceDateInputRef = useRef(null);

  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency")
  );

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(`${year}-${month}-${day}`);
    }
    if (dateStr.includes("-")) {
      return new Date(dateStr);
    }
    return null;
  };
  const toISODate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (showModal || showInvoiceModal || showRemarksModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal || showInvoiceModal || showRemarksModal]);

  const instituteOptions = instituteData?.map((institute) => ({
    value: institute._id,
    label: institute.instituteName,
  }));

  const countryOptions = countryData?.map((country) => ({
    value: country,
    label: country,
  }));

  const calculateCommission = (item) => {
    const tuitionFee = item?.interestedCourseDetails?.[0]?.instituteFeePayment
      ?.feeAmount
      ? parseFloat(
          item?.interestedCourseDetails?.[0]?.instituteFeePayment?.feeAmount
            .toString()
            .replace(/,/g, "")
        )
      : 0;

    const universityCommissionType =
      item?.universitySideConfirmation?.commissionType;
    const universityCommissionPercent = parseFloat(
      item?.universitySideConfirmation?.commissionPercentage || 0
    );
    const universityCommissionAmount =
      universityCommissionType === "Percentage"
        ? (tuitionFee * universityCommissionPercent) / 100
        : parseFloat(item?.universitySideConfirmation?.commissionAmount || 0);

    const b2bCommissionType =
      item?.universityPaymentReceived?.b2bCommission?.commissionType;
    const b2bCommissionPercent = parseFloat(
      item?.universityPaymentReceived?.b2bCommission?.commissionPercentage || 0
    );
    const b2bCommissionAmount =
      b2bCommissionType === "Percentage"
        ? (universityCommissionAmount * b2bCommissionPercent) / 100
        : parseFloat(
            item?.universityPaymentReceived?.b2bCommission?.commissionAmount ||
              0
          );

    return {
      b2bCommissionAmount,
      b2bCommissionType,
      b2bCommissionPercent,
    };
  };

  const paymentModeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

  const fetchBankingDetails = async () => {
    try {
      const res = await dispatch(getAllBankingDetails(1, 1000, ""));
      const responseData = res?.data?.data?.data || [];
      setBankingDetails(responseData);
    } catch (error) {
      console.error("Error fetching banking details:", error);
      setBankingDetails([]);
    }
  };

  useEffect(() => {
    fetchBankingDetails();
  }, [dispatch]);

  const bankOptions = bankingDetails.map((bank) => ({
    label: bank.bankName,
    value: bank._id,
  }));

  const formik = useFormik({
    initialValues: {
      universityPaymentReceived: {
        status: false,
        paymentMode: "",
        bank: "",
        b2bCommission: {
          commissionAmount: "",
          commissionType: "",
          paymentProcess: "",
          paymentMode: "",
        },
      },
    },
    onSubmit: async (values) => {
      try {
        const studentData = await fetchStudentData(selectedStudentId);

        const payload = {
          universityPaymentReceived: {
            status: studentData?.universityPaymentReceived?.status || false,
            paymentMode: values.universityPaymentReceived.paymentMode || null,
            bank: values.universityPaymentReceived.bank || null,
            b2bCommission: {
              commissionAmount:
                studentData?.universityPaymentReceived?.b2bCommission
                  ?.commissionAmount || "",
              commissionType:
                studentData?.universityPaymentReceived?.b2bCommission
                  ?.commissionType || "",
              paymentProcess:
                values.universityPaymentReceived.b2bCommission.paymentProcess,
              paymentMode:
                values.universityPaymentReceived.b2bCommission.paymentMode,
            },
          },
        };

        const response = await dispatch(
          updateStudentApplication(payload, selectedStudentId)
        );

        if (response.status === 200) {
          if (paymentProofFile) {
            await handlePaymentProofUpload();
          }

          toast.success("Student application updated successfully!");
          handleCloseModal();
          fetchAllB2BCommissions(
            currentPage,
            itemsPerPage,
            search,
            filters.startDate,
            filters.endDate,
            filters.institute?.value,
            filters.type?.value,
            filters.country?.value,
            filters.status?.value
          );
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Failed to update student application"
        );
      }
    },
  });

  const handlePaymentProofUpload = async () => {
    try {
      if (!paymentProofFile) {
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append("customDocumentName", "Commission payment Proof");
      uploadFormData.append("uploadedDocument", paymentProofFile);
      uploadFormData.append("ref_module", selectedStudentId);

      const res = await dispatch(
        updateStudentApplication(uploadFormData, selectedStudentId)
      );

      if (res?.status === 200) {
        toast.success("Payment proof uploaded successfully!");
        setPaymentProofFile(null);
      } else {
        toast.error("Failed to upload payment proof");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error uploading payment proof"
      );
    }
  };

  const fetchStudentData = async (studentId) => {
    try {
      const response = await dispatch(getOneStudentApplication(studentId));
      const data = response?.data?.data;
      return data || {};
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const fetchAllB2BCommissions = async (
    page = 1,
    limit = itemsPerPage,
    search = "",
    startDate = filters.startDate,
    endDate = filters.endDate,
    institute = filters.institute?.value || "",
    type = filters.type?.value || "",
    country = filters.country?.value || "",
    status = filters.status?.value || ""
  ) => {
    try {
      const res = await dispatch(
        getTotalB2BCommission(
          page,
          limit,
          search,
          startDate,
          endDate,
          institute,
          type,
          country,
          status
        )
      );
      const responseData = res?.data?.data || [];
      setCommissionData(responseData?.data);
      setTotalPages(responseData?.totalPages || 0);
      setTotalRecords(responseData?.totalRecords || 0);

      const total = responseData?.data?.reduce((sum, item) => {
        const { b2bCommissionAmount } = calculateCommission(item);
        return sum + (b2bCommissionAmount || 0);
      }, 0);
      setTotalCommissionAmount(total);
    } catch (error) {
      toast.error("Error fetching b2b commissions");
    } finally {
    }
  };

  const fetchDashboardLogo = async () => {
    try {
      const storedLogo = localStorage.getItem("companyLogo");
      if (storedLogo) {
        setDashboardLogo(storedLogo);
      } else {
        // const res = await dispatch(getAllSetting());
        const res = await dispatch(getAllConfigurations());
        if (res?.status === 200 && res.data.message[0].invoiceLogo) {
          setDashboardLogo(`${BASEURL}/${res.data.message[0].invoiceLogo}` || ALLImages("logo1"));
          setConfigData({
            name: res.data.message[0].b2bInvoice?.name || "N/A",
            address: res.data.message[0].b2bInvoice?.address || "N/A",
          });
        }
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardLogo();
  }, []);

  const fetchInvoiceDetails = async (ids) => {
    if (!Array.isArray(ids)) ids = [ids];
    const details = ids.map((id) => {
      const item = commissionData.find((c) => c._id === id);
      return {
        id,
        invoiceNumber: item?.b2bInvoice?.number || "",
        invoiceDate: item?.b2bInvoice?.date || "",
      };
    });
    return details;
  };

  const handleExport = async (singleItem) => {
    let dataToExport, ids;
    if (singleItem) {
      dataToExport = [singleItem];
      ids = [singleItem._id];
      setIsSingleDownload(true);
      if (
        userRole === "Super Admin" &&
        singleItem.b2bDetails &&
        singleItem.b2bDetails.companyLogo
      ) {
        setDashboardLogo(singleItem.b2bDetails.companyLogo);
      } else {
        setDashboardLogo(dashboardLogo ? dashboardLogo : ALLImages("logo1"));
      }
      const b2bInvoice = dataToExport[0]?.b2bInvoice || {};
      const invoiceNumber = b2bInvoice.number || "";
      const invoiceDate = b2bInvoice.date ? b2bInvoice.date.slice(0, 10) : "";
      if (!invoiceNumber || !invoiceDate) {
        setIsInvoiceEdit(true);
        setInvoiceDetails({
          invoiceNumber: "",
          invoiceDate: new Date().toISOString().split("T")[0],
        });
      } else {
        setIsInvoiceEdit(false);
        setInvoiceDetails({ invoiceNumber, invoiceDate });
      }
      setShowInvoiceModal(true);
      setExportData(dataToExport);
      return;
    }

    const selectedIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );
    dataToExport =
      selectedIds.length > 0
        ? commissionData.filter((item) => selectedIds.includes(item._id))
        : commissionData;
    ids = dataToExport.map((item) => item._id);
    if (!dataToExport || dataToExport.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    setIsSingleDownload(false);

    const invoiceDetailsList = await fetchInvoiceDetails(ids);
    let bulkInvoiceNumber = "";
    let bulkInvoiceDate = "";
    if (invoiceDetailsList.length > 0) {
      const first = invoiceDetailsList[0];
      const allSameNumber = invoiceDetailsList.every(
        (d) => d.invoiceNumber === first.invoiceNumber
      );
      const allSameDate = invoiceDetailsList.every(
        (d) => d.invoiceDate === first.invoiceDate
      );
      if (allSameNumber) bulkInvoiceNumber = first.invoiceNumber;
      if (allSameDate) bulkInvoiceDate = first.invoiceDate;
    }
    setInvoiceDetails({
      invoiceNumber: bulkInvoiceNumber || "",
      invoiceDate: bulkInvoiceDate || new Date().toISOString().split("T")[0],
    });
    setIsInvoiceEdit(!bulkInvoiceNumber || !bulkInvoiceDate);
    setShowInvoiceModal(true);
    setExportData(dataToExport);
    setSelectedItems({});
    setSelectAll(false);
  };

  const handleGenerateInvoice = async () => {
    try {
      if (!invoiceDetails.invoiceNumber || !invoiceDetails.invoiceDate) {
        toast.error("Please fill in all invoice details.");
        return;
      }
      const ids = exportData.map((item) => item._id);
      if (isSingleDownload) {
        if (
          userRole === "Super Admin" &&
          exportData[0]?.b2bDetails &&
          exportData[0]?.b2bDetails.companyLogo
        ) {
          setDashboardLogo(exportData[0].b2bDetails.companyLogo);
        } else {
          setDashboardLogo(dashboardLogo ? dashboardLogo : ALLImages("logo1"));
        }
        const body = {
          invoiceNumber: invoiceDetails.invoiceNumber,
          invoiceDate: invoiceDetails.invoiceDate,
        };
        if (isInvoiceEdit) {
          await dispatch(commissionEditInvoice(ids, true, body));
          toast.success("Invoice details updated successfully.");
          setIsInvoiceEdit(false);
        } else {
          await dispatch(commissionEditInvoice(ids, false, body));
          toast.success("Invoice details saved successfully.");
        }
        const formattedDate = new Date(
          invoiceDetails.invoiceDate
        ).toLocaleDateString("en-GB");

        const { handleDownload } = B2BInvoiceTemplate({
          dataToExport: exportData,
          invoiceDate: formattedDate,
          invoiceNumber: invoiceDetails.invoiceNumber,
          dashboardLogo,
          b2bDetailsList: Array.from(
            new Map(
              exportData
                .filter((item) => item.b2bDetails)
                .map((item) => [item.b2bDetails.accountNumber, item.b2bDetails])
            ).values()
          ),
          b2bCommissionInvoice: configData
        });
        await handleDownload();
        setShowInvoiceModal(false);
        setInvoiceDetails({ invoiceNumber: "", invoiceDate: "" });
        setExportData([]);
        setIsInvoiceEdit(false);
        fetchAllB2BCommissions(
          currentPage,
          itemsPerPage,
          search,
          filters.startDate,
          filters.endDate,
          filters.institute?.value,
          filters.type?.value,
          filters.country?.value,
          filters.status?.value
        );
      } else {
        const body = {
          invoiceNumber: invoiceDetails.invoiceNumber,
          invoiceDate: invoiceDetails.invoiceDate,
        };
        const idsParam = ids.join(",");
        const res = await dispatch(
          commissionEditInvoice(idsParam, false, body)
        );
        if (res?.status !== 200) {
          toast.error(
            "Failed to update invoice details before generating bulk invoice."
          );
          return;
        }
        const formattedDate = invoiceDetails.invoiceDate
          ? new Date(invoiceDetails.invoiceDate).toLocaleDateString("en-GB")
          : new Date().toLocaleDateString("en-GB");

        const { handleDownload } = B2BInvoiceTemplate({
          dataToExport: exportData,
          invoiceDate: formattedDate,
          invoiceNumber: invoiceDetails.invoiceNumber,
          dashboardLogo,
          b2bDetailsList: Array.from(
            new Map(
              exportData
                .filter((item) => item.b2bDetails)
                .map((item) => [item.b2bDetails.accountNumber, item.b2bDetails])
            ).values()
          ),
          b2bCommissionInvoice: configData
        });
        await handleDownload();
        toast.success("Bulk invoice generated successfully!");
        setExportData([]);
        setIsInvoiceEdit(false);
        setShowInvoiceModal(false);
        setInvoiceDetails({ invoiceNumber: "", invoiceDate: "" });
        fetchAllB2BCommissions(
          currentPage,
          itemsPerPage,
          search,
          filters.startDate,
          filters.endDate,
          filters.institute?.value,
          filters.type?.value,
          filters.country?.value,
          filters.status?.value
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while generating invoice."
      );
      console.error("Error generating invoice:", error);
    }
  };

  const handleDownloadInvoiceOnly = async () => {
    try {
      if (!invoiceDetails.invoiceNumber || !invoiceDetails.invoiceDate) {
        toast.error("Please fill in all invoice details.");
        return;
      }
      if (
        isSingleDownload &&
        userRole === "Super Admin" &&
        exportData[0]?.b2bDetails &&
        exportData[0]?.b2bDetails.companyLogo
      ) {
        setDashboardLogo(exportData[0].b2bDetails.companyLogo);
      } else {
        setDashboardLogo(dashboardLogo ? dashboardLogo : ALLImages("logo1"));
      }
      const formattedDate = new Date(
        invoiceDetails.invoiceDate
      ).toLocaleDateString("en-GB");

      const { handleDownload } = B2BInvoiceTemplate({
        dataToExport: exportData,
        invoiceDate: formattedDate,
        invoiceNumber: invoiceDetails.invoiceNumber,
        dashboardLogo,
        b2bDetailsList: Array.from(
          new Map(
            exportData
              .filter((item) => item.b2bDetails)
              .map((item) => [item.b2bDetails.accountNumber, item.b2bDetails])
          ).values()
        ),
        b2bCommissionInvoice: configData
      });
      await handleDownload();
      setShowInvoiceModal(false);
      setInvoiceDetails({ invoiceNumber: "", invoiceDate: "" });
      setExportData([]);
      setIsInvoiceEdit(false);
      fetchAllB2BCommissions(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.institute?.value,
        filters.type?.value,
        filters.country?.value,
        filters.status?.value
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while generating invoice."
      );
      console.error("Error generating invoice:", error);
    }
  };

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setInvoiceDetails({ invoiceNumber: "", invoiceDate: "" });
  };

  const handleOpenRemarksModal = async (studentId) => {
    try {
      setSelectedStudentForRemarks(studentId);
      setShowRemarksModal(true);

      const studentData = await fetchStudentData(studentId);
      const existingRemarks = studentData?.b2bCommissionRemarks || "";
      setRemarksText(existingRemarks);
    } catch (error) {
      console.error("Error fetching student data for remarks:", error);
      setRemarksText("");
    }
  };

  const handleCloseRemarksModal = () => {
    setShowRemarksModal(false);
    setRemarksText("");
    setSelectedStudentForRemarks(null);
  };

  const handleSaveRemarks = async () => {
    try {
      if (!remarksText.trim()) {
        toast.error("Please enter remarks");
        return;
      }

      const payload = { b2bCommissionRemarks: remarksText };
      const res = await dispatch(
        updateStudentApplication(payload, selectedStudentForRemarks)
      );

      if (res?.status === 200) {
        toast.success("Remarks saved successfully");
        handleCloseRemarksModal();
        fetchAllB2BCommissions(
          currentPage,
          itemsPerPage,
          search,
          filters.startDate,
          filters.endDate,
          filters.institute?.value,
          filters.type?.value,
          filters.country?.value,
          filters.status?.value
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save remarks");
    }
  };

  const handleSendMail = async (item) => {
    try {
      const res = await dispatch(commissionQueryMail(item._id));

      if (res?.status === 200) {
        toast.success("Commission query mail sent successfully!");
      } else {
        toast.error("Failed to send commission query mail");
      }
    } catch (error) {
      console.error("Error sending commission query mail:", error);
      toast.error(
        error?.response?.data?.message || "Failed to send commission query mail"
      );
    }
  };

  const handleOpenModal = async (studentId) => {
    setSelectedStudentId(studentId);
    setShowModal(true);

    const studentData = await fetchStudentData(studentId);
    const paymentProofDocs =
      studentData?.uploadedDocumentDetails?.filter(
        (doc) =>
          doc?.customDocumentName === "Commission payment Proof" &&
          doc?.ref_module === studentId
      ) || [];
    setHasPaymentProof(paymentProofDocs.length > 0);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPaymentProofFile(null);
    formik.resetForm();
  };

  const fetchAllInstitute = async () => {
    try {
      const res = await dispatch(getTotalCommissionUniversity());
      setInstituteData(res?.data?.data);
    } catch (error) {
      toast.error("Error fetching in getAll Institute");
    }
  };

  const fetchAllCountry = async () => {
    try {
      const res = await dispatch(getTotalCommissionCountry());
      setCountryData(res?.data?.data);
    } catch (error) {
      toast.error("Error fetching in getAll country");
    }
  };

  const fetchEligibleStudentStatus = async () => {
    try {
      const res = await dispatch(getAllAccountantStatus());
      if (res?.status === 200) {
        setB2BCommissionStatus(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching student statuses:", error);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const payload = {
        accountantStatus: newStatus,
        sendB2BCommissionEmail: true,
      };
      const res = await dispatch(
        updateStudentApplication(payload, applicationId)
      );
      if (res?.status === 200) {
        toast.success("Status updated successfully");
        fetchAllB2BCommissions(
          currentPage,
          itemsPerPage,
          search,
          filters.startDate,
          filters.endDate,
          filters.institute?.value,
          filters.type?.value,
          filters.country?.value,
          filters.status?.value
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  const handleDownloadFile = async (filePath, fileName) => {
    try {
      const downloadUrl = filePath;

      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();

      let extension = "";
      const urlParts = filePath.split(".");
      if (urlParts.length > 1) {
        extension = urlParts[urlParts.length - 1].split(/\#|\?/)[0];
      }

      let downloadFileName = fileName;
      if (!downloadFileName.includes(".") && extension) {
        downloadFileName = `${fileName}.${extension}`;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file. Please try again.");
    }
  };

  const handleDownloadAllPaymentProofs = async (item) => {
    const paymentProofDocs =
      item?.uploadedDocumentDetails?.filter(
        (doc) =>
          doc?.customDocumentName === "Commission payment Proof" &&
          doc?.ref_module === item?._id
      ) || [];

    if (paymentProofDocs.length === 0) {
      toast.error("No payment proof documents found");
      return;
    }

    if (paymentProofDocs.length === 1) {
      await handleDownloadFile(
        paymentProofDocs[0].filePath,
        paymentProofDocs[0].customDocumentName
      );
    } else {
      toast.info(`Downloading ${paymentProofDocs.length} files...`);

      for (let i = 0; i < paymentProofDocs.length; i++) {
        const doc = paymentProofDocs[i];
        try {
          await handleDownloadFile(doc.filePath, doc.customDocumentName);
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to download ${doc.customDocumentName}:`, error);
        }
      }

      toast.success("All files downloaded!");
    }
  };

  useEffect(() => {
    fetchEligibleStudentStatus();
    fetchAllInstitute();
    fetchAllCountry();
  }, []);

  useEffect(() => {
    if (canRead) {
      fetchAllB2BCommissions(
        currentPage,
        itemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.institute?.value,
        filters.type?.value,
        filters.country?.value,
        filters.status?.value
      );
    }
  }, [currentPage, itemsPerPage, search, filters]);

  useEffect(() => {
    if (showModal && selectedStudentId) {
      fetchStudentData(selectedStudentId).then((data) => {
        formik.setValues({
          universityPaymentReceived: {
            status: data?.universityPaymentReceived?.status || false,
            b2bCommission: {
              commissionAmount:
                data?.universityPaymentReceived?.b2bCommission
                  ?.commissionAmount || "",
              commissionType:
                data?.universityPaymentReceived?.b2bCommission
                  ?.commissionType || "",
              paymentProcess:
                data?.universityPaymentReceived?.b2bCommission
                  ?.paymentProcess || "",
              paymentMode:
                data?.universityPaymentReceived?.b2bCommission?.paymentMode ||
                "",
            },
          },
        });
      });
    }
  }, [showModal, selectedStudentId]);

  const handleCheckboxChange = (e, id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: e.target.checked,
    }));
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    const newSelectedItems = {};
    commissionData.forEach((item) => {
      newSelectedItems[item._id] = checked;
    });
    setSelectedItems(newSelectedItems);
  };

  const tagColors = [
    { bg: "#D1FAE5", text: "#047857" },
    { bg: "#DBEAFE", text: "#1D4ED8" },
    { bg: "#EDE9FE", text: "#6D28D9" },
    { bg: "#FEF3C7", text: "#B45309" },
    { bg: "#F5D0FE", text: "#A21CAF" },
    { bg: "#C7D2FE", text: "#3730A3" },
  ];

  const getColors = (name) => {
    const index =
      [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
      tagColors.length;
    return tagColors[index];
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    if (canRead) {
      fetchAllB2BCommissions(
        1,
        newItemsPerPage,
        search,
        filters.startDate,
        filters.endDate,
        filters.institute?.value,
        filters.type?.value,
        filters.country?.value,
        filters.status?.value
      );
    }
  };

  const selectedStudent = commissionData.find(
    (item) => item._id === selectedStudentId
  );

  const b2bPartnerOptions = [
    { value: "b2b", label: "B2B Partner" },
    { value: "branch", label: "Branch" },
  ];

  const canAddRemarks = [
    "Branch",
    "B2B Admin",
    "Branch User",
    "B2B Member",
  ].includes(userRole || userType);

  const statusOptions = b2BCommissionStatus?.map((status) => ({
    value: status?.name,
    label: status?.name,
  }));

  const paymentProcessOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Query", label: "Query" },
    { value: "Processing", label: "Processing" },
  ];

  return (
    <>
      <Pageheader
        mainheading="B2B Commission"
        parentfolder="Accountant"
        activepage="B2B Commission"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-between">
                <div className="card-title">B2B Commissions</div>
                {canRead && (
                  <>
                    <div className="d-flex flex-wrap gap-2">
                      <div className="filter-item">
                        <div className="contact-search3">
                          <button type="button" className="btn border-0">
                            <i
                              className="fe fe-search fw-semibold text-muted"
                              aria-hidden="true"
                            ></i>
                          </button>
                          <Form.Control
                            type="text"
                            className="filter-height border-0"
                            id="typehead1"
                            placeholder="Search here..."
                            autoComplete="off"
                            value={search}
                            onChange={(e) => {
                              setSearch(e.target.value);
                              setCurrentPage(1);
                            }}
                          />
                        </div>
                      </div>

                      {canDownload && (
                        <Button
                          variant="primary"
                          className="custom-select-height px-3"
                          onClick={() => handleExport()}
                        >
                          Generate Invoice
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {canRead && (
                <>
                  <div className="d-flex flex-wrap align-items-end gap-3 mb-3">
                    <div className="filter-item">
                      <Form.Label>Start Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          className="filter-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            filters.startDate
                              ? formatDate(parseDate(filters.startDate))
                              : ""
                          }
                          readOnly
                          ref={startDateInputRef}
                          onClick={() => {
                            if (filters.startDate) {
                              setStartDateValue(parseDate(filters.startDate));
                            }
                            setShowStartDateCalendar((show) => !show);
                          }}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            width: "100%",
                          }}
                        />
                        {filters.startDate ? (
                          <button
                            type="button"
                            onClick={() => {
                              setFilters({ ...filters, startDate: "" });
                              setStartDateValue(null);
                              setShowStartDateCalendar(false);
                            }}
                            style={{
                              position: "absolute",
                              right: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 16,
                              color: "#888",
                              padding: 0,
                              zIndex: 10000,
                            }}
                            aria-label="Clear date"
                          >
                            ×
                          </button>
                        ) : (
                          <MdCalendarToday
                            style={{
                              position: "absolute",
                              right: 10,
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#888",
                              pointerEvents: "none",
                            }}
                            size={20}
                          />
                        )}
                        {showStartDateCalendar && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "0",
                              zIndex: 9999,
                              background: "#fff",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              marginTop: "4px",
                              width: 300,
                              minWidth: 300,
                              maxWidth: 300,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                setStartDateValue(selectedDate);
                                setFilters({
                                  ...filters,
                                  startDate: toISODate(selectedDate),
                                });
                                setShowStartDateCalendar(false);
                                setCurrentPage(1);
                              }}
                              value={startDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="filter-item">
                      <Form.Label>End Date</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type="text"
                          className="filter-height"
                          placeholder="dd/mm/yyyy"
                          value={
                            filters.endDate
                              ? formatDate(parseDate(filters.endDate))
                              : ""
                          }
                          readOnly
                          ref={endDateInputRef}
                          onClick={() => {
                            if (filters.endDate) {
                              setEndDateValue(parseDate(filters.endDate));
                            }
                            setShowEndDateCalendar((show) => !show);
                          }}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#fff",
                            width: "100%",
                          }}
                        />
                        {filters.endDate ? (
                          <button
                            type="button"
                            onClick={() => {
                              setFilters({ ...filters, endDate: "" });
                              setEndDateValue(null);
                              setShowEndDateCalendar(false);
                            }}
                            style={{
                              position: "absolute",
                              right: 8,
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              fontSize: 16,
                              color: "#888",
                              padding: 0,
                              zIndex: 10000,
                            }}
                            aria-label="Clear date"
                          >
                            ×
                          </button>
                        ) : (
                          <MdCalendarToday
                            style={{
                              position: "absolute",
                              right: 10,
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "#888",
                              pointerEvents: "none",
                            }}
                            size={20}
                          />
                        )}
                        {showEndDateCalendar && (
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "0",
                              zIndex: 9999,
                              background: "#fff",
                              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                              borderRadius: "8px",
                              marginTop: "4px",
                              width: 300,
                              minWidth: 300,
                              maxWidth: 300,
                            }}
                          >
                            <Calendar
                              className="form-control m-0 p-0 border-0"
                              onChange={(selectedDate) => {
                                setEndDateValue(selectedDate);
                                setFilters({
                                  ...filters,
                                  endDate: toISODate(selectedDate),
                                });
                                setShowEndDateCalendar(false);
                                setCurrentPage(1);
                              }}
                              value={endDateValue}
                              locale="en-GB"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="filter-item">
                      <Form.Label>Institute</Form.Label>
                      <Select
                        options={instituteOptions}
                        value={
                          instituteOptions.find(
                            (option) =>
                              option.value === filters.institute?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, institute: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Institute"
                        className="filter-height"
                        classNamePrefix="custom-select"
                        isClearable
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                          }),
                        }}
                      />
                    </div>

                    {userRole === "Super Admin" && (
                      <div className="filter-item">
                        <Form.Label>Type</Form.Label>
                        <Select
                          options={b2bPartnerOptions}
                          value={filters.type}
                          onChange={(option) => {
                            setFilters({ ...filters, type: option });
                            setCurrentPage(1);
                          }}
                          placeholder="Select Type"
                          className="filter-height"
                          classNamePrefix="custom-select"
                          isClearable
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                              minHeight: "38px",
                            }),
                          }}
                        />
                      </div>
                    )}

                    <div className="filter-item">
                      <Form.Label>Country</Form.Label>
                      <Select
                        options={countryOptions}
                        value={
                          countryOptions.find(
                            (option) => option.value === filters.country?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, country: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Country"
                        className="filter-height"
                        classNamePrefix="custom-select"
                        isClearable
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                          }),
                        }}
                      />
                    </div>

                    <div className="filter-item">
                      <Form.Label>Status</Form.Label>
                      <Select
                        options={statusOptions}
                        value={
                          statusOptions.find(
                            (option) => option.value === filters.status?.value
                          ) || null
                        }
                        onChange={(option) => {
                          setFilters({ ...filters, status: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Status"
                        className="filter-height"
                        classNamePrefix="custom-select"
                        isClearable
                        styles={{
                          control: (base) => ({
                            ...base,
                            fontSize: "13px",
                            minHeight: "38px",
                          }),
                        }}
                      />
                    </div>

                    <div className="flex-grow-1"></div>
                    <div className="custom-select-height px-3 mt-2 mt-md-0 d-flex align-items-center bg-success bg-opacity-10 border border-success rounded">
                      <span className="text-success fw-semibold">
                        <i className="bi bi-check-circle me-2"></i>
                        Total Commission:{" "}
                        <strong>
                          {storedEncryptedCurrency
                            ? getSymbolFromCurrency(storedEncryptedCurrency)
                            : "₹"}{" "}
                          {commissionData?.length > 0
                            ? totalCommissionAmount?.toLocaleString("en-IN")
                            : "0"}
                        </strong>
                      </span>
                    </div>
                    <div className="filter-item-rows">
                      <ItemsPerPageSelect
                        itemsPerPage={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                      />
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="filter-item filter-height total-records px-3 d-flex align-items-center">
                        <span>
                          Total Records :<strong> {totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="table-responsive modern-table-wrapper">
                <table
                  className="table table-hover modern-table border table-nowrap"
                  style={{ width: "100%", overflowX: "auto" }}
                >
                  <thead className="bg-light sticky-header">
                    <tr>
                      <th
                        scope="col"
                        className="No-column-2 text-center"
                        style={{ minWidth: "50px", textAlign: "center" }}
                      >
                        <Form.Check
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="custom-checkbox"
                        />
                      </th>
                      <th scope="col" style={{ minWidth: "100px" }}>
                        Date
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Student ID
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Status
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Student Name
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Email
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Contact
                      </th>
                      <th scope="col" style={{ minWidth: "200px" }}>
                        Institute Name
                      </th>
                      <th scope="col" style={{ minWidth: "200px" }}>
                        Program Name
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Type
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Preferred Country
                      </th>
                      <th scope="col" style={{ minWidth: "200px" }}>
                        Commission Processed
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Intake Year
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Intake Month
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Tuition Fee
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Commission Type
                      </th>
                      {userRole !== "B2B Admin" &&
                        userRole !== "B2B Member" && (
                          <th scope="col" style={{ minWidth: "150px" }}>
                            University Commission
                          </th>
                        )}
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Our Commission
                      </th>
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Invoice No
                      </th>
                      {/* {canAddRemarks && ( */}
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Remarks
                      </th>
                      {/* )} */}
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Payment Proof
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Download
                      </th>
                      {/* {canAddRemarks && ( */}
                      <th scope="col" style={{ minWidth: "120px" }}>
                        Send Mail
                      </th>
                      {/* )} */}
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Created By
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>
                        Updated By
                      </th>
                      {(canCreate || canUpdate) && (
                        <th
                          scope="col"
                          className="sticky-col-right-last dynamic-width"
                          style={{ minWidth: "100px" }}
                        >
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {commissionData?.length > 0 ? (
                      commissionData.map((item, index) => {
                        const colors = getColors(item?.name || "Unknown");
                        const instituteNames =
                          item?.interestedCourseDetails?.length > 0
                            ? item.interestedCourseDetails
                                .map(
                                  (course) =>
                                    course?.institute?.instituteName || "N/A"
                                )
                                .join(", ")
                            : "-";
                        const programNames =
                          item?.interestedCourseDetails?.length > 0
                            ? item.interestedCourseDetails
                                .map(
                                  (course) =>
                                    course?.course?.programName || "N/A"
                                )
                                .join(", ")
                            : "-";
                        const currentStatus =
                          statusOptions.find(
                            (option) => option.value === item?.accountantStatus
                          )?.label ||
                          item?.accountantStatus ||
                          "-";

                        const tuitionFee = item?.interestedCourseDetails?.[0]
                          ?.instituteFeePayment?.feeAmount
                          ? parseFloat(
                              item.interestedCourseDetails[0].instituteFeePayment.feeAmount
                                .toString()
                                .replace(/,/g, "")
                            )
                          : 0;
                        const tuitionCurrencyCode =
                          item?.interestedCourseDetails?.[0]
                            ?.instituteFeePayment?.currencyCode || "";
                        const tuitionCurrencySymbol = tuitionCurrencyCode
                          ? getSymbolFromCurrency(tuitionCurrencyCode) ||
                            tuitionCurrencyCode
                          : "";

                        const universityCommissionType =
                          item?.universitySideConfirmation?.commissionType;
                        const universityCommissionPercent = parseFloat(
                          item?.universitySideConfirmation
                            ?.commissionPercentage || 0
                        );
                        const universityCommissionAmount =
                          universityCommissionType === "Percentage"
                            ? (tuitionFee * universityCommissionPercent) / 100
                            : parseFloat(
                                item?.universitySideConfirmation
                                  ?.commissionAmount || 0
                              );

                        const b2bCommissionType =
                          item?.universityPaymentReceived?.b2bCommission
                            ?.commissionType;
                        const b2bCommissionPercent = parseFloat(
                          item?.universityPaymentReceived?.b2bCommission
                            ?.commissionPercentage || 0
                        );
                        const b2bCommissionAmount =
                          b2bCommissionType === "Percentage"
                            ? (universityCommissionAmount *
                                b2bCommissionPercent) /
                              100
                            : parseFloat(
                                item?.universityPaymentReceived?.b2bCommission
                                  ?.commissionAmount || 0
                              );

                        return (
                          <tr
                            key={item._id}
                            className={
                              selectedItems[item._id] ? "selected-row" : ""
                            }
                          >
                            <td
                              className="No-column-2 text-center"
                              style={{ minWidth: "50px", textAlign: "center" }}
                            >
                              <Form.Check
                                type="checkbox"
                                checked={selectedItems[item._id] || false}
                                onChange={(e) =>
                                  handleCheckboxChange(e, item._id)
                                }
                                className="custom-checkbox"
                              />
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              {new Date(
                                item?.verificationDate || item?.createdAt
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "UTC",
                              })}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              {item?.studentId || "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {userRole === "Super Admin" ? (
                                <Dropdown>
                                  {(() => {
                                    const matchedStatus =
                                      b2BCommissionStatus?.find(
                                        (status) =>
                                          status.name === item?.accountantStatus
                                      );
                                    const bgColor =
                                      matchedStatus?.color || "#0b3c8c";
                                    const textColor = [
                                      "#e9e216",
                                      "#1fff44",
                                    ].includes(bgColor)
                                      ? "#000000"
                                      : "#ffffff";
                                    const displayStatus =
                                      item?.accountantStatus === "false" ||
                                      item?.accountantStatus === false ||
                                      item?.accountantStatus === ""
                                        ? "New"
                                        : item?.accountantStatus || "New";
                                    return (
                                      <>
                                        <style>
                                          {`
                                            .pill-dropdown-${item._id} {
                                              background-color: ${bgColor} !important;
                                              border: 1px solid ${bgColor} !important;
                                              color: ${textColor} !important;
                                              font-size: 13px !important;
                                              padding: 4px 12px !important;
                                              border-radius: 9999px !important;
                                              display: flex;
                                              align-items: center;
                                              justify-content: center;
                                              gap: 6px;
                                            }

                                            .pill-dropdown-${item._id}:hover,
                                            .pill-dropdown-${item._id}:focus,
                                            .pill-dropdown-${item._id}:active,
                                            .pill-dropdown-${item._id}.show {
                                              background-color: ${bgColor} !important;
                                              border-color: ${bgColor} !important;
                                              color: ${textColor} !important;
                                              box-shadow: none !important;
                                            }
                                          `}
                                        </style>

                                        <Dropdown.Toggle
                                          className={`pill-dropdown-${item._id}`}
                                        >
                                          {displayStatus}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu
                                          style={{
                                            minWidth: "150px",
                                            boxShadow:
                                              "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                            borderRadius: "6px",
                                          }}
                                        >
                                          {statusOptions.map((option) => (
                                            <Dropdown.Item
                                              key={option.value}
                                              onClick={() =>
                                                handleStatusChange(
                                                  item._id,
                                                  option.value
                                                )
                                              }
                                              style={{ fontSize: "13px" }}
                                            >
                                              {option.label}
                                            </Dropdown.Item>
                                          ))}
                                        </Dropdown.Menu>
                                      </>
                                    );
                                  })()}
                                </Dropdown>
                              ) : (
                                (() => {
                                  const matchedStatus =
                                    b2BCommissionStatus?.find(
                                      (status) =>
                                        status.name === item?.accountantStatus
                                    );
                                  const bgColor =
                                    matchedStatus?.color || "#0b3c8c";
                                  const textColor = [
                                    "#e9e216",
                                    "#1fff44",
                                  ].includes(bgColor)
                                    ? "#000000"
                                    : "#ffffff";
                                  const displayStatus =
                                    item?.accountantStatus === "false" ||
                                    item?.accountantStatus === false ||
                                    item?.accountantStatus === ""
                                      ? "New"
                                      : item?.accountantStatus || "New";
                                  return (
                                    <span
                                      className={`pill-dropdown-${item._id}`}
                                      style={{
                                        backgroundColor: bgColor,
                                        color: textColor,
                                        fontSize: "13px",
                                        padding: "4px 12px",
                                        borderRadius: "9999px",
                                        display: "inline-block",
                                        border: `1px solid ${bgColor}`,
                                      }}
                                    >
                                      {displayStatus}
                                    </span>
                                  );
                                })()
                              )}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              <span
                                className="px-3 py-1 rounded-pill"
                                style={{
                                  backgroundColor: colors.bg,
                                  color: colors.text,
                                }}
                              >
                                {item?.name || "-"}
                              </span>
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.email || "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.contact || "-"}
                            </td>
                            <td>{instituteNames}</td>
                            <td>{programNames}</td>
                            <td>
                              {item?.created_by_type === "user"
                                ? "Head Office"
                                : item?.created_by_type === "B2B Admin" ||
                                  item?.created_by_type === "B2B Member"
                                ? "B2B"
                                : item?.created_by_type === "Branch Member" ||
                                  item?.created_by_type === "Branch User" ||
                                  item?.created_by_type === "Branch"
                                ? "Branch"
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.purposeDetails?.preferredCountry?.length >
                              0
                                ? item.purposeDetails.preferredCountry.join(
                                    ", "
                                  )
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.universityPaymentReceived?.b2bCommission
                                ?.paymentProcess === "Paid" ? (
                                <CheckCircleIcon
                                  style={{ color: "#28a745" }}
                                  fontSize="small"
                                />
                              ) : (
                                "-"
                              )}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.purposeDetails?.intakeYear?.length > 0
                                ? item.purposeDetails.intakeYear.join(", ")
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.purposeDetails?.intakeMonth?.length > 0
                                ? item.purposeDetails.intakeMonth.join(", ")
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.interestedCourseDetails?.length > 0
                                ? item.interestedCourseDetails
                                    .map((course) => {
                                      const feeAmount =
                                        course.instituteFeePayment?.feeAmount ||
                                        "-";
                                      const currencyCode =
                                        course.instituteFeePayment
                                          ?.currencyCode;
                                      return currencyCode
                                        ? `${
                                            getSymbolFromCurrency(
                                              currencyCode
                                            ) || currencyCode
                                          } ${feeAmount}`
                                        : `${feeAmount}`;
                                    })
                                    .join(", ")
                                : "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              {item?.universitySideConfirmation
                                ?.commissionType || "-"}
                            </td>
                            {userRole !== "B2B Admin" &&
                              userRole !== "B2B Member" && (
                                <td
                                  style={{
                                    whiteSpace: "nowrap",
                                    minWidth: "100px",
                                  }}
                                >
                                  {universityCommissionType === "Percentage"
                                    ? `${
                                        universityCommissionPercent || "-"
                                      }% (${tuitionCurrencySymbol} ${
                                        universityCommissionAmount
                                          ? universityCommissionAmount.toLocaleString(
                                              "en-IN"
                                            )
                                          : "-"
                                      })`
                                    : `${tuitionCurrencySymbol} ${
                                        universityCommissionAmount
                                          ? universityCommissionAmount.toLocaleString(
                                              "en-IN"
                                            )
                                          : "-"
                                      }`}
                                </td>
                              )}
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "100px",
                              }}
                            >
                              {b2bCommissionType === "Percentage"
                                ? `${
                                    b2bCommissionPercent || "-"
                                  }% (${tuitionCurrencySymbol} ${
                                    b2bCommissionAmount
                                      ? b2bCommissionAmount.toLocaleString(
                                          "en-IN"
                                        )
                                      : "-"
                                  })`
                                : `${tuitionCurrencySymbol} ${
                                    b2bCommissionAmount
                                      ? b2bCommissionAmount.toLocaleString(
                                          "en-IN"
                                        )
                                      : "-"
                                  }`}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.b2bInvoice?.number || "-"}
                            </td>
                            {/* {canAddRemarks && ( */}
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.b2bCommissionRemarks || "-"}
                            </td>
                            {/* )} */}
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {(() => {
                                const paymentProofDocs =
                                  item?.uploadedDocumentDetails?.filter(
                                    (doc) =>
                                      doc?.customDocumentName ===
                                        "Commission payment Proof" &&
                                      doc?.ref_module === item?._id
                                  ) || [];

                                if (paymentProofDocs.length === 0) {
                                  return <span className="text-muted">-</span>;
                                }

                                return (
                                  <div className="d-flex flex-column gap-1">
                                    {paymentProofDocs?.map((doc, index) => (
                                      <button
                                        key={doc._id}
                                        className="btn p-0 border-0 bg-transparent"
                                        style={{
                                          cursor: "pointer",
                                          width: "32px",
                                          height: "32px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                        onClick={() =>
                                          window.open(
                                            doc.filePath,
                                            "_blank",
                                            "noopener,noreferrer"
                                          )
                                        }
                                      >
                                        <VisibilityIcon
                                          style={{
                                            fontSize: "22px",
                                            color: "#0a3574",
                                          }}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                );
                              })()}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {(() => {
                                const paymentProofDocs =
                                  item?.uploadedDocumentDetails?.filter(
                                    (doc) =>
                                      doc?.customDocumentName ===
                                        "Commission payment Proof" &&
                                      doc?.ref_module === item?._id
                                  ) || [];

                                if (paymentProofDocs.length === 0) {
                                  return <span className="text-muted">-</span>;
                                }

                                return (
                                  <div className="d-flex flex-column gap-1">
                                    {paymentProofDocs.length > 1 && (
                                      <button
                                        className="btn btn-sm btn-outline-success"
                                        style={{
                                          fontSize: "11px",
                                          padding: "2px 6px",
                                          marginBottom: "4px",
                                        }}
                                        onClick={() =>
                                          handleDownloadAllPaymentProofs(item)
                                        }
                                        title="Download all payment proofs"
                                      >
                                        All
                                      </button>
                                    )}
                                    {paymentProofDocs?.map((doc, index) => (
                                      <button
                                        key={doc._id}
                                        className="btn p-0 border-0 bg-transparent"
                                        style={{
                                          cursor: "pointer",
                                          width: "32px",
                                          height: "32px",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                        onClick={() => {
                                          handleDownloadFile(
                                            doc.filePath,
                                            doc.customDocumentName
                                          );
                                        }}
                                        title={`Download ${doc.customDocumentName}`}
                                      >
                                        <DownloadIcon
                                          style={{
                                            fontSize: "22px",
                                            color: "#22b573",
                                          }}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                );
                              })()}
                            </td>
                            {/* {canAddRemarks && ( */}
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "120px",
                              }}
                            >
                              {item?.b2bCommissionRemarks ? (
                                <Button
                                  variant="primary"
                                  className="custom-select-height"
                                  style={{
                                    fontSize: "14px",
                                  }}
                                  onClick={() => handleSendMail(item)}
                                  title="Send Mail"
                                >
                                  Send
                                </Button>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            {/* )} */}
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.createdByName || "-"}
                            </td>
                            <td
                              style={{
                                whiteSpace: "nowrap",
                                minWidth: "150px",
                              }}
                            >
                              {item?.updatedByName || "-"}
                            </td>
                            {(canUpdate || canCreate) && (
                              <td
                                className="sticky-col-right-last dynamic-width-data"
                                style={{ minWidth: "100px" }}
                              >
                                <IconButton
                                  aria-label="more"
                                  aria-controls={`menu-${index}`}
                                  aria-haspopup="true"
                                  onClick={(e) => {
                                    setOpenDropdown(
                                      openDropdown === index ? null : index
                                    );
                                    setAnchorEl(e.currentTarget);
                                  }}
                                >
                                  <MoreVertIcon className="text-muted" />
                                </IconButton>
                                <Menu
                                  id={`menu-${index}`}
                                  anchorEl={anchorEl}
                                  open={openDropdown === index}
                                  onClose={() => setOpenDropdown(null)}
                                  MenuListProps={{
                                    "aria-labelledby": `menu-${index}`,
                                  }}
                                  sx={{
                                    "& .MuiPaper-root": {
                                      minWidth: "110px",
                                      boxShadow:
                                        "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                    },
                                  }}
                                >
                                  {userRole === "Super Admin" && (
                                    <MenuItem
                                      onClick={() => {
                                        handleOpenModal(item._id);
                                        setOpenDropdown(null);
                                      }}
                                    >
                                      <EditIcon
                                        fontSize="small"
                                        sx={{ mr: 1 }}
                                        className="edit-icon"
                                      />
                                      <span className="edit-action-text">
                                        Payment Process
                                      </span>
                                    </MenuItem>
                                  )}

                                  {canAddRemarks && [
                                    <MenuItem
                                      key="remarks"
                                      onClick={() => {
                                        handleOpenRemarksModal(item._id);
                                        setOpenDropdown(null);
                                      }}
                                    >
                                      <EditIcon
                                        fontSize="small"
                                        sx={{ mr: 1 }}
                                        className="edit-icon"
                                      />
                                      <span className="edit-action-text">
                                        Remarks
                                      </span>
                                    </MenuItem>,
                                  ]}
                                  <MenuItem
                                    key="download"
                                    onClick={() => {
                                      handleExport(item);
                                      setOpenDropdown(null);
                                    }}
                                  >
                                    <DownloadIcon
                                      fontSize="small"
                                      sx={{ mr: 1 }}
                                      style={{ color: "#22b573" }}
                                    />
                                    <span
                                      style={{
                                        color: "#22b573",
                                        fontSize: "14px",
                                      }}
                                    >
                                      Download
                                    </span>
                                  </MenuItem>
                                </Menu>
                              </td>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="14" className="text-center py-4">
                          {!canRead
                            ? "You do not have permission to view this Data"
                            : "No data available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && commissionData?.length > 0 && (
                <div className="mt-4 d-flex">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </Card.Body>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header className="form-main-heading">
                <Modal.Title>Payment Details</Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleCloseModal}
                />
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Payment Process</Form.Label>
                    <Select
                      options={paymentProcessOptions}
                      classNamePrefix="custom-select"
                      value={
                        formik.values.universityPaymentReceived.b2bCommission
                          .paymentProcess
                          ? paymentProcessOptions.find(
                              (option) =>
                                option.value ===
                                formik.values.universityPaymentReceived
                                  .b2bCommission.paymentProcess
                            )
                          : null
                      }
                      onChange={(selectedOption) => {
                        formik.setFieldValue(
                          "universityPaymentReceived.b2bCommission.paymentProcess",
                          selectedOption.value
                        );
                      }}
                      isSearchable
                      isClearable
                      placeholder="Select payment process"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Payment Mode</Form.Label>
                    <Select
                      options={paymentModeOptions}
                      value={
                        paymentModeOptions.find(
                          (option) =>
                            option.value ===
                            formik.values.universityPaymentReceived.paymentMode
                        ) || null
                      }
                      onChange={(option) =>
                        formik.setFieldValue(
                          "universityPaymentReceived.paymentMode",
                          option ? option.value : ""
                        )
                      }
                      classNamePrefix="custom-select"
                      placeholder="Select payment mode"
                      styles={{
                        control: (base) => ({
                          ...base,
                          fontSize: "13px",
                        }),
                      }}
                    />
                    {formik.touched.universityPaymentReceived?.paymentMode &&
                      formik.errors.universityPaymentReceived?.paymentMode && (
                        <div className="text-danger mt-1">
                          {formik.errors.universityPaymentReceived?.paymentMode}
                        </div>
                      )}
                    {["GPay", "Bank", "UPI"].includes(
                      formik.values.universityPaymentReceived.paymentMode
                    ) && (
                      <>
                        <Select
                          className="mt-3"
                          options={bankOptions}
                          value={
                            bankOptions.find(
                              (option) =>
                                option.value ===
                                formik.values.universityPaymentReceived.bank
                            ) || null
                          }
                          onChange={(option) =>
                            formik.setFieldValue(
                              "universityPaymentReceived.bank",
                              option ? option.value : ""
                            )
                          }
                          classNamePrefix="custom-select"
                          placeholder="Select bank"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                            }),
                          }}
                        />
                        {formik.touched.universityPaymentReceived?.bank?.bank &&
                          formik.errors.universityPaymentReceived?.bank && (
                            <div className="text-danger mt-1">
                              {formik.errors.universityPaymentReceived?.bank}
                            </div>
                          )}
                      </>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Payment proof</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*,application/pdf"
                      className="custom-select-height"
                      onChange={(e) => setPaymentProofFile(e.target.files[0])}
                      disabled={hasPaymentProof}
                    />
                    {hasPaymentProof && (
                      <div
                        className="mt-2 text-success"
                        style={{ fontSize: "13px" }}
                      >
                        Document already uploaded.
                      </div>
                    )}
                  </Form.Group>

                  <Modal.Footer>
                    <Button
                      variant="primary"
                      type="submit"
                      className="custom-select-height"
                    >
                      Save
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>

            {/* Invoice Details Modal */}
            <Modal show={showInvoiceModal} onHide={handleCloseInvoiceModal}>
              <Modal.Header className="form-main-heading">
                <Modal.Title>Invoice Details</Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleCloseInvoiceModal}
                />
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Tax Invoice No.</Form.Label>
                    <Form.Control
                      type="text"
                      className="custom-select-height"
                      placeholder="Enter Tax Invoice Number"
                      value={invoiceDetails.invoiceNumber}
                      onChange={(e) =>
                        setInvoiceDetails({
                          ...invoiceDetails,
                          invoiceNumber: e.target.value,
                        })
                      }
                      readOnly={!isInvoiceEdit && invoiceDetails.invoiceNumber}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Date of Invoice</Form.Label>
                    <div style={{ position: "relative" }}>
                      <Form.Control
                        type="text"
                        className="custom-select-height"
                        placeholder="dd/mm/yyyy"
                        value={
                          invoiceDetails.invoiceDate
                            ? formatDate(parseDate(invoiceDetails.invoiceDate))
                            : ""
                        }
                        readOnly
                        ref={invoiceDateInputRef}
                        onClick={() => {
                          if (invoiceDetails.invoiceDate) {
                            setInvoiceDateValue(
                              parseDate(invoiceDetails.invoiceDate)
                            );
                          }
                          setShowInvoiceDateCalendar((show) => !show);
                        }}
                        style={{ cursor: "pointer", backgroundColor: "#fff" }}
                      />
                      {invoiceDetails.invoiceDate ? (
                        <button
                          type="button"
                          onClick={() => {
                            setInvoiceDetails({
                              ...invoiceDetails,
                              invoiceDate: "",
                            });
                            setInvoiceDateValue(null);
                            setShowInvoiceDateCalendar(false);
                          }}
                          style={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 16,
                            color: "#888",
                            padding: 0,
                            zIndex: 10000,
                          }}
                          aria-label="Clear date"
                        >
                          ×
                        </button>
                      ) : (
                        <MdCalendarToday
                          style={{
                            position: "absolute",
                            right: 10,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#888",
                            pointerEvents: "none",
                          }}
                          size={20}
                        />
                      )}
                      {showInvoiceDateCalendar && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            zIndex: 9999,
                            background: "#fff",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                            borderRadius: "8px",
                            marginTop: "4px",
                            width: 300,
                            minWidth: 300,
                            maxWidth: 300,
                          }}
                        >
                          <Calendar
                            className="form-control m-0 p-0 border-0"
                            onChange={(selectedDate) => {
                              setInvoiceDateValue(selectedDate);
                              setInvoiceDetails({
                                ...invoiceDetails,
                                invoiceDate: toISODate(selectedDate),
                              });
                              setShowInvoiceDateCalendar(false);
                            }}
                            value={invoiceDateValue}
                            locale="en-GB"
                          />
                        </div>
                      )}
                    </div>
                  </Form.Group>

                  <Modal.Footer>
                    {isSingleDownload ? (
                      !invoiceDetails.invoiceNumber ||
                      !invoiceDetails.invoiceDate ||
                      isInvoiceEdit ? (
                        <Button
                          variant="primary"
                          onClick={handleGenerateInvoice}
                          className="custom-select-height"
                        >
                          Save & Generate Invoice
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="primary"
                            className="custom-select-height me-2"
                            onClick={() => setIsInvoiceEdit(true)}
                          >
                            Edit Invoice Details
                          </Button>
                          <Button
                            variant="primary"
                            onClick={handleDownloadInvoiceOnly}
                            className="custom-select-height"
                          >
                            Generate Invoice
                          </Button>
                        </>
                      )
                    ) : isInvoiceEdit ||
                      !invoiceDetails.invoiceNumber ||
                      !invoiceDetails.invoiceDate ? (
                      <Button
                        variant="primary"
                        onClick={handleGenerateInvoice}
                        className="custom-select-height"
                      >
                        {isInvoiceEdit
                          ? "Save & Generate Invoice"
                          : "Generate Invoice"}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          className="custom-select-height me-2"
                          onClick={() => setIsInvoiceEdit(true)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleDownloadInvoiceOnly}
                          className="custom-select-height"
                        >
                          Generate Invoice
                        </Button>
                      </>
                    )}
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>

            {/* Remarks Modal */}
            <Modal show={showRemarksModal} onHide={handleCloseRemarksModal}>
              <Modal.Header className="form-main-heading">
                <Modal.Title>Add Remarks</Modal.Title>
                <AiOutlineClose
                  size={20}
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={handleCloseRemarksModal}
                />
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      className="rounded-4"
                      placeholder="Enter your remarks here..."
                      value={remarksText}
                      onChange={(e) => setRemarksText(e.target.value)}
                    />
                  </Form.Group>

                  <Modal.Footer>
                    <Button
                      variant="primary"
                      onClick={handleSaveRemarks}
                      className="custom-select-height"
                    >
                      Save
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default B2BCommission;
