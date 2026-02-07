import Select from "react-select";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Pageheader from "../../layouts/Pageheader";
import { Button, Card, Col, Form, Modal, Row } from "react-bootstrap";
import usePermissions from "../commonComponents/usePermissions";
import { useEffect, useRef, useState } from "react";
import DataTable from "../commonComponents/DataTable";
import Paginations from "../elements/Paginations";
import { AiOutlineClose } from "react-icons/ai";
import ItemsPerPageSelect from "../commonComponents/ItemsPerPageSelect";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { toast } from "react-toastify";
import {
  createGenerateInvoice,
  deleteGenerateInvoice,
  getAllGenerateInvoice,
  uniqueStudent,
  updateGenerateInvoice,
} from "../../redux/actions/Accountant/GenerateInvoice.action";
import { useDispatch } from "react-redux";
import { getAllMainPlan } from "../../redux/actions/Master/MainPlan.action";
import { getAllSubPlan } from "../../redux/actions/Master/SubPlan.action";
import { getAllBankingDetails } from "../../redux/actions/Master/Banking.action";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptIcon from "@mui/icons-material/Receipt";
import GenerateInvoicePDF from "./GenerateInvoicePDF";
import { MdCalendarToday } from "react-icons/md";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getAllBranch } from "../../redux/actions/Branch.action";
import { decryptData } from "../../utils/encryptionUtils";
import ALLImages from "../../common/Imagedata";
import { getAllConfigurations } from "../../redux/actions/Configuration.action";
import { BASEURL } from "../../baseUrl";
import getSymbolFromCurrency from "currency-symbol-map";
import { countryCodeISO } from "../../utils/countryISOCode";
import DeleteConfirmModal from "../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const PaymentInvoice = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [allGenerateInvoice, setAllGenerateInvoice] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [allUniqueStudent, setAllUniqueStudent] = useState([]);
  const [allMainPlan, setMainPlan] = useState([]);
  const [allSubPlan, setSubPlan] = useState([]);
  const [allBankingDetails, setAllBankingDetails] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const { canCreate, canRead, canUpdate, canDelete, canDownload } =
    usePermissions("Payments Invoice");
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalDueAmount, setTotalDueAmount] = useState(0);
  const [filters, setFilters] = useState({
    type: "",
    mainPlan: "",
    subPlan: "",
    startDate: "",
    endDate: "",
    status: { label: "All", value: "all" },
    showAll: true,
    branchId: "",
  });
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
  const [startDateValue, setStartDateValue] = useState(null);
  const startDateInputRef = useRef(null);
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
  const [endDateValue, setEndDateValue] = useState(null);
  const endDateInputRef = useRef(null);
  const startDateCalendarRef = useRef(null);
  const endDateCalendarRef = useRef(null);
  const [showPaidDateCalendar, setShowPaidDateCalendar] = useState(false);
  const [paidDateValue, setPaidDateValue] = useState(null);
  const paidDateInputRef = useRef(null);
  const paidDateCalendarRef = useRef(null);
  const [otherPaidSum, setOtherPaidSum] = useState(0);
  const [branchList, setBranchList] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("all");
  const userRole = decryptData(localStorage.getItem("role"));
  const branchId = decryptData(localStorage.getItem("userId"));
  const [dashboardLogo, setDashboardLogo] = useState(ALLImages("logo1"));
  const [configData, setConfigData] = useState(null);

  const storedEncryptedCurrency = decryptData(
    localStorage.getItem("crmCurrency"),
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        startDateInputRef.current &&
        !startDateInputRef.current.contains(event.target) &&
        startDateCalendarRef.current &&
        !startDateCalendarRef.current.contains(event.target)
      ) {
        setShowStartDateCalendar(false);
      }
      if (
        endDateInputRef.current &&
        !endDateInputRef.current.contains(event.target) &&
        endDateCalendarRef.current &&
        !endDateCalendarRef.current.contains(event.target)
      ) {
        setShowEndDateCalendar(false);
      }
      if (
        paidDateInputRef.current &&
        !paidDateInputRef.current.contains(event.target) &&
        paidDateCalendarRef.current &&
        !paidDateCalendarRef.current.contains(event.target)
      ) {
        setShowPaidDateCalendar(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [
    startDateInputRef,
    startDateCalendarRef,
    endDateInputRef,
    endDateCalendarRef,
    paidDateInputRef,
    paidDateCalendarRef,
  ]);

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

  const formik = useFormik({
    initialValues: {
      name: "",
      contactNo: "",
      mainPlan: null,
      subPlan: null,
      amount: "",
      discount: "",
      discountAmount: "",
      payableAmount: "",
      paymentType: "",
      paidAmount: { amount: "", bank: "", paymentMode: "", date: "", _id: "" },
      dueAmount: "",
      remarks: "",
      id: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Student selection is required"),
      contactNo: Yup.string().required("Phone Number is required"),
      mainPlan: Yup.string().required("Main Plan is required"),
      subPlan: Yup.string().required("Sub Plan is required"),
      discount: Yup.string().matches(
        /^\d+(\.\d+)?%$/,
        "Discount must be a valid percentage (e.g., 10%)",
      ),
      discountAmount: Yup.string(),
      paymentType: Yup.string(),
      paidAmount: Yup.object().shape({
        amount: Yup.string().required("Receive Amount is required"),
        paymentMode: Yup.string().required("Payment Mode is required"),
        date: Yup.string().required("Payment Date is required"),
        bank: Yup.string().when("paymentMode", {
          is: (paymentMode) => ["GPay", "Bank", "UPI"].includes(paymentMode),
          then: (schema) =>
            schema.required("Bank selection is required for this payment mode"),
          otherwise: (schema) => schema.optional(),
        }),
        _id: Yup.string(),
      }),
      amount: Yup.string(),
      payableAmount: Yup.string(),
      dueAmount: Yup.string(),
      id: Yup.string(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();

        if (values.id && canUpdate) {
          let firstCallPayload = {};
          if (values.paidAmount._id) {
            firstCallPayload = {
              paidAmountId: values.paidAmount._id,
              paidAmount: [
                {
                  amount: values.paidAmount.amount,
                  bank: values.paidAmount.bank || null,
                  paymentMode: values.paidAmount.paymentMode,
                  date: values.paidAmount.date,
                },
              ],
            };
          } else {
            firstCallPayload = {
              paidAmount: [
                {
                  amount: values.paidAmount.amount,
                  bank: values.paidAmount.bank || null,
                  paymentMode: values.paidAmount.paymentMode,
                  date: values.paidAmount.date,
                },
              ],
            };
          }

          if (Object.keys(firstCallPayload).length > 0) {
            const res1 = await dispatch(
              updateGenerateInvoice(firstCallPayload, values.id),
            );
            if (res1?.data?.code !== 200) {
              throw new Error("First API call failed");
            }
          }

          const fullPayload = {
            name: values.name || "",
            contactNo: values.contactNo || "",
            mainPlan: values.mainPlan || "",
            subPlan: values.subPlan || "",
            amount: values.amount || "",
            discount: values.discount || "",
            discountAmount: values.discountAmount || "",
            payableAmount: values.payableAmount || "",
            paymentType: values.paymentType || "",
            dueAmount: values.dueAmount || "",
            remarks: values.remarks || "",
          };
          const res2 = await dispatch(
            updateGenerateInvoice(fullPayload, values.id),
          );
          if (res2?.data?.code === 200) {
            toast.success("Payments Invoice updated successfully");
            handleCloseModal();
          }
        } else if (canCreate) {
          const createPayload = {
            name: values.name || "",
            contactNo: values.contactNo || "",
            mainPlan: values.mainPlan || "",
            subPlan: values.subPlan || "",
            amount: values.amount || "",
            discount: values.discount || "",
            discountAmount: values.discountAmount || "",
            payableAmount: values.payableAmount || "",
            paymentType: values.paymentType || "",
            paidAmount: [
              {
                amount: values.paidAmount.amount,
                bank: values.paidAmount.bank || null,
                paymentMode: values.paidAmount.paymentMode || "",
                date: values.paidAmount.date,
              },
            ],
            dueAmount: values.dueAmount || "",
            remarks: values.remarks || "",
          };
          const res = await dispatch(createGenerateInvoice(createPayload));
          if (res?.data?.code === 201) {
            toast.success("Payments Invoice added successfully");
            handleCloseModal();
          }
        }
        resetForm();
        if (canRead) {
          setCurrentPage(1);
          fetchGenerateInvoice(
            1,
            itemsPerPage,
            search,
            filters.type?.value,
            filters.mainPlan?.value,
            filters.subPlan?.value,
            filters.startDate,
            filters.endDate,
            filters.status?.value,
            filters.showAll,
            filters.branchId,
          );
        }
      } catch (error) {
        console.error(
          "Error submitting form:",
          error?.response?.data?.message || error.message,
        );
        toast.error(error?.response?.data?.message || error.message);
      }
    },
  });

  const billingFormik = useFormik({
    initialValues: {
      totalAmount: "",
      dueAmount: "",
      paidAmount: "",
      paymentMode: "",
      bank: "",
      date: "",
      id: "",
    },
    validationSchema: Yup.object({
      totalAmount: Yup.string().required("Total Amount is required"),
      dueAmount: Yup.string().required("Receivable Amount is required"),
      paidAmount: Yup.string()
        .required("Receive Amount is required")
        .matches(/^\d+$/, "Receive Amount must be a number")
        .test("max-due", "Cannot exceed Receivable Amount", function (value) {
          const due = parseFloat(this.parent.dueAmount) || 0;
          const paid = parseFloat(value) || 0;
          return paid <= due;
        }),
      paymentMode: Yup.string().required("Payment Mode is required"),
      date: Yup.string().required("Payment Date is required"),
      bank: Yup.string().when("paymentMode", {
        is: (paymentMode) => ["GPay", "Bank", "UPI"].includes(paymentMode),
        then: (schema) =>
          schema.required("Bank selection is required for this payment mode"),
        otherwise: (schema) => schema.optional(),
      }),
      id: Yup.string(),
    }),
    validateOnBlur: false,
    validateOnChange: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        toast.dismiss();
        const newPaid = parseFloat(values.paidAmount) || 0;
        const currentDue = parseFloat(values.dueAmount) || 0;
        const newDue = Math.max(0, currentDue - newPaid);
        const paidEntry = {
          amount: values.paidAmount,
          paymentMode: values.paymentMode,
          date: values.date,
        };
        if (values.bank) paidEntry.bank = values.bank;
        const payload = {
          dueAmount: newDue.toFixed(0),
          paidAmount: [paidEntry],
        };
        const res = await dispatch(updateGenerateInvoice(payload, values.id));
        if (res?.data?.code === 200) {
          toast.success("Billing details updated successfully");
          handleCloseBillingModal();
          resetForm();
          if (canRead) {
            setCurrentPage(1);
            fetchGenerateInvoice(
              1,
              itemsPerPage,
              search,
              filters.type?.value,
              filters.mainPlan?.value,
              filters.subPlan?.value,
              filters.startDate,
              filters.endDate,
              filters.status?.value,
              filters.showAll,
              filters.branchId,
            );
          }
        }
      } catch (error) {
        console.error("Error updating billing:", error);
        toast.error(
          error?.response?.data?.message || "Failed to update billing",
        );
      }
    },
  });

  useEffect(() => {
    const amount = parseFloat(formik.values.amount) || 0;

    // -------- % Discount ----------
    let discountPercent = formik.values.discount
      ?.toString()
      .replace("%", "")
      .trim();
    discountPercent = parseFloat(discountPercent) || 0;
    const discountFromPercent = (amount * discountPercent) / 100;

    // -------- Fixed Discount Amount ----------
    const discountFromAmount = parseFloat(formik.values.discountAmount) || 0;

    // -------- Total Discount ----------
    const totalDiscount = discountFromPercent + discountFromAmount;

    // -------- Payable Calculation ----------
    const payableAmount = amount - totalDiscount;

    formik.setFieldValue(
      "payableAmount",
      Math.max(0, payableAmount).toFixed(2),
    );
  }, [
    formik.values.amount,
    formik.values.discount,
    formik.values.discountAmount,
  ]);

  // -------- Due Amount ----------
  useEffect(() => {
    const payableAmount = parseFloat(formik.values.payableAmount) || 0;
    const paidAmount = parseFloat(formik.values.paidAmount.amount) || 0;
    const dueAmount = payableAmount - paidAmount - otherPaidSum;
    formik.setFieldValue("dueAmount", Math.max(0, dueAmount).toFixed(2));
  }, [
    formik.values.payableAmount,
    formik.values.paidAmount.amount,
    otherPaidSum,
  ]);

  useEffect(() => {
    const calculateTotals = () => {
      const paidTotal = allGenerateInvoice.reduce((sum, item) => {
        const paidSum =
          item.paidAmount?.reduce(
            (acc, entry) => acc + (parseFloat(entry.amount) || 0),
            0,
          ) || 0;
        return sum + paidSum;
      }, 0);

      const dueTotal = allGenerateInvoice.reduce(
        (sum, item) => sum + (parseFloat(item.dueAmount) || 0),
        0,
      );

      setTotalPaidAmount(
        paidTotal.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      );
      setTotalDueAmount(
        dueTotal.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      );
    };

    calculateTotals();
  }, [allGenerateInvoice]);

  const fetchDashboardLogo = async () => {
    try {
      const storedLogo = localStorage.getItem("companyLogo");
      if (storedLogo) {
        setDashboardLogo(storedLogo);
      } else {
        // const res = await dispatch(getAllSetting());
        const res = await dispatch(getAllConfigurations());
        if (res?.status === 200 && res.data.message[0].invoiceLogo) {
          setDashboardLogo(
            `${BASEURL}/${res.data.message[0].invoiceLogo}` ||
              ALLImages("logo1"),
          );
        }
      }
    } catch (error) {
      console.error("Fetch settings error:", error);
    }
  };

  const fetchConfigData = async () => {
    try {
      const res = await dispatch(getAllConfigurations());
      const responseData = res?.data;
      const config =
        responseData?.message?.[0]?.paymentInvoice ||
        responseData?.message?.[0]?.applicationFeeInvoice ||
        null;
      if (config) {
        setConfigData(config);
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
    }
  };

  useEffect(() => {
    fetchDashboardLogo();
    fetchConfigData();
  }, []);

  const handleEdit = async (item) => {
    try {
      if (allUniqueStudent.length === 0) {
        console.warn("No students loaded, fetching unique students...");
        await fetchUniqueStudent();
      }

      let studentId;
      if (typeof item.name === "object" && item.name?._id) {
        studentId = item.name._id;
      } else if (typeof item.name === "string") {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.name);
        if (isValidObjectId) {
          studentId = item.name;
        } else {
          const student = allUniqueStudent?.find((s) => s.name === item.name);
          if (student) {
            studentId = student._id;
          } else {
            console.warn(
              `Student with name ${item.name} not found in uniqueStudentOptions`,
            );
            toast.error(
              "Selected student not found. Please select a valid student.",
            );
            return;
          }
        }
      } else {
        console.warn("Invalid item.name format:", item.name);
        toast.error("Invalid student data. Please check the invoice.");
        return;
      }

      await fetchSubPlans(item.mainPlan._id);

      const otherSum =
        item.paidAmount
          ?.slice(1)
          .reduce((sum, entry) => sum + parseFloat(entry.amount || 0), 0) || 0;
      setOtherPaidSum(otherSum);

      formik.setValues({
        name: studentId || "",
        contactNo: item.contactNo || "",
        mainPlan: item.mainPlan?._id || "",
        subPlan: item.subPlan?._id || "",
        amount: item.amount || "",
        discount: item.discount || "",
        discountAmount: item.discountAmount || "",
        payableAmount: item.payableAmount || "",
        paymentType: item.paymentType || "",
        paidAmount: {
          amount: item.paidAmount?.[0]?.amount || "",
          bank: item.paidAmount?.[0]?.bank || "",
          paymentMode: item.paidAmount?.[0]?.paymentMode || "",
          date: item.paidAmount?.[0]?.date || "",
          _id: item.paidAmount?.[0]?._id || "",
        },
        dueAmount: item.dueAmount || "",
        remarks: item.remarks || "",
        id: item._id || "",
      });

      setPaidDateValue(parseDate(item.paidAmount?.[0]?.date) || null);

      const selectedStudent = uniqueStudentOptions?.find(
        (option) => option.label === item?.name,
      );
      if (!selectedStudent) {
        console.warn(
          `Student with ID ${item.name} not found in uniqueStudentOptions`,
        );
        toast.error(
          "Selected student not found. Please check the student list.",
        );
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error in handleEdit:", error);
      toast.error("Failed to edit invoice.");
    }
  };

  const handleBilling = (item) => {
    setSelectedItem(item);
    billingFormik.setValues({
      totalAmount: item.payableAmount || "",
      dueAmount: item.dueAmount || "",
      paidAmount: "",
      paymentMode: "",
      bank: "",
      date: "",
      id: item._id || "",
    });
    setPaidDateValue(null);
    setShowBillingModal(true);
  };

  const handleDelete = async (item) => {
    if (canDelete) {
      try {
        toast.dismiss();
        const res = await dispatch(deleteGenerateInvoice(item._id));
        if (res?.data?.code === 200) {
          toast.success("Payments Invoice deleted successfully");
          if (canRead) {
            setCurrentPage(1);
            fetchGenerateInvoice(
              1,
              itemsPerPage,
              search,
              filters.type?.value,
              filters.mainPlan?.value,
              filters.subPlan?.value,
              filters.startDate,
              filters.endDate,
              filters.status?.value,
              filters.showAll,
              filters.branchId,
            );
          }
        }
      } catch (error) {
        console.error("Error deleting Payments Invoice:", error);
        toast.error("Failed to delete Payments Invoice");
      }
    } else {
      toast.error("You do not have permission to delete.");
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    formik.resetForm();
    setPaidDateValue(null);
    setShowPaidDateCalendar(false);
    setOtherPaidSum(0);
  };

  const handleCloseBillingModal = () => {
    setShowBillingModal(false);
    billingFormik.resetForm();
    setSelectedItem(null);
    setPaidDateValue(null);
    setShowPaidDateCalendar(false);
  };

  const handleCloseUploadModal = () => {
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleAddNewInvoice = () => {
    formik.resetForm();
    formik.setFieldValue("paidAmount", {
      amount: "",
      bank: "",
      paymentMode: "",
      date: "",
      _id: "",
    });
    formik.setFieldValue("id", "");
    setPaidDateValue(null);
    setOtherPaidSum(0);
    setShowModal(true);
  };

  const handleSelectInvoice = (item) => {
    setSelectedInvoices((prev) =>
      prev.includes(item._id)
        ? prev.filter((id) => id !== item._id)
        : [...prev, item._id],
    );
  };

  const handleSelectAllInvoices = () => {
    if (selectedInvoices.length === allGenerateInvoice.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(allGenerateInvoice?.map((item) => item._id));
    }
  };

  const getStudentName = (studentId) => {
    const student = allUniqueStudent?.find((s) => s._id === studentId);
    return studentId ? studentId : "-";
  };

  const handleDownloadSingle = (item) => {
    const invoiceData = {
      customerName: getStudentName(item.name),
      invoiceNumber: item._id,
      invoiceDate: new Date().toLocaleDateString("en-GB"),
      students: [
        {
          name: getStudentName(item.name),
          contactNo: item.contactNo,
          mainPlan: item.mainPlan?.name || "-",
          subPlan: item.subPlan?.name || "-",
          amount: item.amount,
          discount: item.discount,
          discountAmount: item.discountAmount,
          payableAmount: item.payableAmount,
          paymentType: item.paymentType,
          paidAmount:
            item.paidAmount?.length > 0
              ? `${item.paidAmount[0].amount} (Bank: ${
                  allBankingDetails?.find(
                    (b) => b._id === item.paidAmount[0].bank,
                  )?.bankName || "N/A"
                }, Date: ${
                  formatDate(parseDate(item.paidAmount[0].date)) || "-"
                }) (${item.paidAmount[0].paymentMode || "-"})`
              : "-",
          dueAmount: item.dueAmount,
        },
      ],
    };
    const pdfGenerator = GenerateInvoicePDF({
      invoiceData,
      dashboardLogo,
      paymentInvoice: configData || {},
    });
    pdfGenerator.handleDownload();
    setOpenDropdown(null);
    setSelectedInvoices([]);
  };

  const handleBulkDownload = () => {
    const invoicesToDownload =
      selectedInvoices.length > 0
        ? allGenerateInvoice.filter((item) =>
            selectedInvoices.includes(item._id),
          )
        : allGenerateInvoice;

    if (invoicesToDownload.length === 0) {
      toast.error("No invoices available to download");
      return;
    }

    const invoiceData = {
      customerName: "Multiple Invoices",
      invoiceNumber: `BULK_${new Date()
        .toISOString()
        .replace(/[^a-zA-Z0-9]/g, "_")}`,
      invoiceDate: new Date().toLocaleDateString("en-GB"),
      students: invoicesToDownload?.map((item) => ({
        name: getStudentName(item.name),
        contactNo: item.contactNo,
        mainPlan: item.mainPlan?.name || "-",
        subPlan: item.subPlan?.name || "-",
        amount: item.amount,
        discount: item.discount,
        discountAmount: item.discountAmount,
        payableAmount: item.payableAmount,
        paymentType: item.paymentType,
        paidAmount:
          item.paidAmount?.length > 0
            ? `${item.paidAmount[0].amount} (Bank: ${
                allBankingDetails?.find(
                  (b) => b._id === item.paidAmount[0].bank,
                )?.bankName || "N/A"
              }, Date: ${
                formatDate(parseDate(item.paidAmount[0].date)) || "-"
              }) (${item.paidAmount[0].paymentMode || "-"})`
            : "-",
        dueAmount: item.dueAmount,
      })),
    };

    const pdfGenerator = GenerateInvoicePDF({
      invoiceData,
      dashboardLogo,
      paymentInvoice: configData || {},
    });
    pdfGenerator.handleDownload();
    setSelectedInvoices([]);
  };

  useEffect(() => {
    if (canRead) {
      fetchGenerateInvoice(
        currentPage,
        itemsPerPage,
        search,
        filters.type?.value,
        filters.mainPlan?.value,
        filters.subPlan?.value,
        filters.startDate,
        filters.endDate,
        filters.status?.value,
        filters.showAll,
        filters.branchId,
      );
    }
  }, [canRead, currentPage, itemsPerPage, search, filters]);

  const fetchGenerateInvoice = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
    type = filters.type?.value || "",
    mainPlan = filters.mainPlan?.value || "",
    subPlan = filters.subPlan?.value || "",
    startDate = filters.startDate || "",
    endDate = filters.endDate || "",
    status = filters.status?.value || "",
    showAll = filters.showAll,
    branchId = filters.branchId || "",
  ) => {
    try {
      const res = await dispatch(
        getAllGenerateInvoice(
          page,
          limit,
          searchTerm,
          type,
          mainPlan,
          subPlan,
          startDate,
          endDate,
          status,
          showAll,
          branchId,
        ),
      );
      const responseData = res?.data?.data || [];
      setAllGenerateInvoice(responseData?.data || []);
      setTotalRecords(responseData?.totalRecords || 0);
      setTotalPages(responseData?.totalPages || 0);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchAllBranches = async () => {
    try {
      const res = await dispatch(getAllBranch(1, 10000, ""));
      const responseData = res?.data?.data;
      setBranchList(responseData?.data || []);
    } catch (error) {
      console.log("Error fetching branches:", error);
      setBranchList([]);
    }
  };

  const fetchUniqueStudent = async () => {
    try {
      const res = await dispatch(uniqueStudent());
      setAllUniqueStudent(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchMainPlans = async () => {
    try {
      const res = await dispatch(getAllMainPlan(1, 1000, ""));
      setMainPlan(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching main plans:", error);
    }
  };

  const fetchBankingDetails = async () => {
    try {
      const res = await dispatch(getAllBankingDetails(1, 1000, ""));
      setAllBankingDetails(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching banking details:", error);
      setAllBankingDetails([]);
    }
  };

  useEffect(() => {
    fetchUniqueStudent();
    fetchMainPlans();
    fetchBankingDetails();
    fetchAllBranches();
  }, []);

  const fetchSubPlans = async (mainPlanId) => {
    try {
      const res = await dispatch(getAllSubPlan(1, 1000, "", mainPlanId));
      setSubPlan(res?.data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching sub plans:", error);
      setSubPlan([]);
    }
  };

  useEffect(() => {
    if (formik.values.mainPlan) {
      fetchSubPlans(formik.values.mainPlan);
    } else {
      setSubPlan([]);
      formik.setFieldValue("subPlan", "");
    }
  }, [formik.values.mainPlan]);

  useEffect(() => {
    if (formik.values.subPlan) {
      const selectedSubPlan = allSubPlan?.find(
        (plan) => plan._id === formik.values.subPlan,
      );
      if (selectedSubPlan && selectedSubPlan.totalAmount) {
        formik.setFieldValue("amount", selectedSubPlan.totalAmount.toString());
      } else {
        formik.setFieldValue("amount", "");
      }
    } else {
      formik.setFieldValue("amount", "");
    }
  }, [formik.values.subPlan, allSubPlan]);

  const columns = [
    {
      label: (
        <Form.Check
          type="checkbox"
          checked={
            selectedInvoices.length === allGenerateInvoice.length &&
            allGenerateInvoice.length > 0
          }
          onChange={handleSelectAllInvoices}
          className="custom-checkbox"
        />
      ),
      key: "checkbox",
      render: (item) => (
        <Form.Check
          type="checkbox"
          checked={selectedInvoices.includes(item._id)}
          onChange={() => handleSelectInvoice(item)}
          className="custom-checkbox"
        />
      ),
    },
    {
      label: "Date",
      render: (item) => formatDate(parseDate(item.createdAt)),
    },
    {
      label: "Student Name",
      key: "name",
    },
    { label: "Phone Number", key: "contactNo" },
    { label: "Main Plan", render: (item) => item?.mainPlan?.name || "-" },
    { label: "Sub Plan", render: (item) => item?.subPlan?.name || "-" },
    { label: "Plan Amount", key: "amount" },
    { label: "Discount", key: "discount" },
    { label: "Discount Amount", key: "discountAmount" },
    { label: "Payable Amount", key: "payableAmount" },
    {
      label: "Payment Mode",
      render: (item) => item?.paidAmount?.[0]?.paymentMode || "-",
    },
    {
      label: "Paid Date",
      render: (item) =>
        item?.paidAmount?.length > 0
          ? item.paidAmount
              ?.map((entry) => formatDate(parseDate(entry.date)))
              ?.join(", ")
          : "-",
    },
    {
      label: "Receive Amount",
      render: (item) => {
        if (!item?.paidAmount?.length) return "-";

        const paidDetails = item.paidAmount
          ?.map((entry) => {
            const bankInfo = entry.bank
              ? ` (Bank: ${
                  allBankingDetails?.find((b) => b._id === entry.bank)
                    ?.bankName || "N/A"
                })`
              : "";
            return `${entry.amount}${bankInfo}`;
          })
          ?.join(", ");

        return (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${item._id}`}>{paidDetails}</Tooltip>
            }
          >
            <span
              className="text-truncate d-inline-block"
              style={{ maxWidth: 150, cursor: "pointer" }}
            >
              {paidDetails}
            </span>
          </OverlayTrigger>
        );
      },
    },

    { label: "Receivable Amount", key: "dueAmount" },
  ];

  const renderActions = (item, index) => (
    <div className="d-flex">
      <IconButton
        aria-label="more"
        aria-controls={`menu-${index}`}
        aria-haspopup="true"
        onClick={(e) => {
          setOpenDropdown(openDropdown === index ? null : index);
          setAnchorEl(e.currentTarget);
        }}
      >
        <MoreVertIcon className="three-dots-icon" />
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
            minWidth: "150px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {canUpdate && (
          <MenuItem
            onClick={() => {
              handleEdit(item);
              setOpenDropdown(null);
            }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} className="edit-icon" />
            <span className="edit-action-text">Edit</span>
          </MenuItem>
        )}
        {canDelete && (
          <MenuItem
            onClick={() => {
              setSelectedItem(item);
              setShowDeleteModal(true);
              setOpenDropdown(null);
            }}
          >
            <DeleteIcon
              fontSize="small"
              sx={{ mr: 1 }}
              className="delete-icon"
            />
            <span className="delete-action-text">Delete</span>
          </MenuItem>
        )}
        <MenuItem
          key="download"
          onClick={() => {
            handleDownloadSingle(item);
          }}
        >
          <DownloadIcon
            fontSize="small"
            sx={{ mr: 1 }}
            className="download-icon"
          />
          <span className="download-action-text">Download</span>
        </MenuItem>
        {canUpdate && (
          <MenuItem
            key="billing"
            onClick={() => {
              handleBilling(item);
              setOpenDropdown(null);
            }}
          >
            <ReceiptIcon
              fontSize="small"
              sx={{ mr: 1 }}
              className="billing-icon"
            />
            <span className="billing-action-text">Billing</span>
          </MenuItem>
        )}
      </Menu>
    </div>
  );

  const modeOptions = [
    { label: "GPay", value: "GPay" },
    { label: "Bank", value: "Bank" },
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "UPI" },
  ];

  const bankOptions = allBankingDetails?.map((bank) => ({
    // label: `${bank.bankName} - ${bank.accountNumber}`,
    label: bank.bankName,
    value: bank._id,
  }));

  const paymentTypeOptions = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];

  const paymentFilterOptions = [
    { label: "Full", value: "Full" },
    { label: "Half", value: "Half" },
  ];

  const uniqueStudentOptions = allUniqueStudent?.map((student) => ({
    value: student._id,
    label: student.name,
  }));

  const mainPlanOptions = allMainPlan?.map((plan) => ({
    value: plan._id,
    label: plan.name,
  }));

  const subPlanOptions = allSubPlan?.map((plan) => ({
    value: plan._id,
    label: plan.name,
  }));

  const amountStatus = [
    { label: "All", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Due", value: "due" },
  ];

  return (
    <>
      <Pageheader
        mainheading="Payments Invoice"
        parentfolder="Accountant"
        activepage="Payments Invoice"
      />

      <Row className="mt-5 row-sm">
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              <div className="w-100 d-flex flex-wrap justify-content-end">
                {/* <div className="card-title">Payments Invoice</div> */}
                <div className="d-flex flex-wrap align-items-center gap-2">
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
                      placeholder="Search here..."
                      autoComplete="off"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                  {(canCreate || canUpdate) && (
                    <>
                      <div className="col-auto">
                        <Button
                          variant="primary"
                          className="custom-select-height px-3"
                          onClick={handleAddNewInvoice}
                        >
                          Add Invoice
                        </Button>
                      </div>
                      {canDownload && (
                        <div className="col-auto">
                          <Button
                            variant="primary"
                            className="custom-select-height px-3"
                            onClick={handleBulkDownload}
                          >
                            Generate Invoices
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {canRead && (
                <>
                  <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
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
                          style={{ cursor: "pointer", backgroundColor: "#fff" }}
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
                            ref={startDateCalendarRef}
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
                          style={{ cursor: "pointer", backgroundColor: "#fff" }}
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
                            ref={endDateCalendarRef}
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
                      <Form.Label>Status</Form.Label>
                      <Select
                        options={amountStatus}
                        value={filters.status}
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
                    {userRole !== "Branch" && (
                      <div className="filter-item">
                        <Form.Label>Branch</Form.Label>
                        <Select
                          className="filter-height"
                          styles={{
                            control: (base) => ({
                              ...base,
                              fontSize: "13px",
                              minHeight: "38px",
                            }),
                          }}
                          placeholder="Select Branch"
                          classNamePrefix="custom-select"
                          isClearable
                          isSearchable
                          options={[
                            { value: "all", label: "All" },
                            { value: "", label: "Head Office" },
                            ...(Array.isArray(branchList)
                              ? branchList
                                  .filter((branch) => {
                                    if (userRole === "Branch") {
                                      return branch._id === branchId;
                                    }
                                    return (
                                      branch.name && branch.name.trim() !== ""
                                    );
                                  })
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((branch) => ({
                                    value: branch._id,
                                    label: branch.name,
                                  }))
                              : []),
                          ]}
                          value={
                            selectedBranch !== null &&
                            selectedBranch !== undefined
                              ? {
                                  value: selectedBranch,
                                  label:
                                    selectedBranch === "all"
                                      ? "All"
                                      : selectedBranch === ""
                                        ? "Head Office"
                                        : branchList.find(
                                            (branch) =>
                                              branch._id === selectedBranch,
                                          )?.name || "Select Branch",
                                }
                              : null
                          }
                          onChange={(selectedOption) => {
                            setSelectedBranch(selectedOption?.value || "");
                            setFilters({
                              ...filters,
                              branchId:
                                selectedOption.value === "all"
                                  ? ""
                                  : selectedOption.value,
                              showAll:
                                selectedOption.value === "all" ? true : false,
                            });
                            setCurrentPage(1);
                          }}
                        />
                      </div>
                    )}
                    <div className="filter-item">
                      <Form.Label>Main Plan</Form.Label>
                      <Select
                        options={mainPlanOptions}
                        value={filters.mainPlan}
                        onChange={(option) => {
                          setFilters({
                            ...filters,
                            mainPlan: option,
                            subPlan: null,
                          });
                          setCurrentPage(1);

                          if (option?.value) {
                            fetchSubPlans(option.value);
                          } else {
                            setSubPlan([]);
                          }
                        }}
                        placeholder="Select Main Plan"
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
                      <Form.Label>Sub Plan</Form.Label>
                      <Select
                        options={subPlanOptions}
                        value={filters.subPlan}
                        onChange={(option) => {
                          setFilters({ ...filters, subPlan: option });
                          setCurrentPage(1);
                        }}
                        placeholder="Select Sub Plan"
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
                        Receive Amount:{" "}
                        <strong>
                          {storedEncryptedCurrency
                            ? getSymbolFromCurrency(storedEncryptedCurrency)
                            : "₹"}{" "}
                          {totalPaidAmount}
                        </strong>
                      </span>
                    </div>
                    <div className="custom-select-height px-3 mt-2 mt-md-0 d-flex align-items-center bg-danger bg-opacity-10 border border-danger rounded">
                      <span className="text-danger fw-semibold">
                        <i className="bi bi-exclamation-circle me-2"></i>
                        Receivable Amount:{" "}
                        <strong>
                          {storedEncryptedCurrency
                            ? getSymbolFromCurrency(storedEncryptedCurrency)
                            : "₹"}{" "}
                          {totalDueAmount}
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
                          Total Records: <strong> {totalRecords}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <DataTable
                columns={columns}
                data={allGenerateInvoice}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onDelete={handleDelete}
                canEdit={canUpdate}
                canDelete={canDelete}
                canRead={canRead}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={handleItemsPerPageChange}
                onEdit={handleEdit}
                renderActions={renderActions}
                itemsPerPageOptions={true}
                showNoColumn={false}
              />
              <DeleteConfirmModal
                show={showDeleteModal}
                onHide={handleCloseUploadModal}
                onConfirm={() => {
                  handleDelete(selectedItem);
                  handleCloseUploadModal();
                }}
              />

              <Modal
                show={showBillingModal}
                onHide={handleCloseBillingModal}
                centered
                size="lg"
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title className="fw-semibold">
                    Billing Details
                  </Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseBillingModal}
                  />
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={billingFormik.handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Total Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="totalAmount"
                            value={billingFormik.values.totalAmount}
                            onChange={billingFormik.handleChange}
                            className="custom-select-height"
                            placeholder="Enter total amount"
                            disabled
                          />
                          {billingFormik.touched.totalAmount &&
                            billingFormik.errors.totalAmount && (
                              <div className="text-danger">
                                {billingFormik.errors.totalAmount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receivable Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="dueAmount"
                            value={billingFormik.values.dueAmount}
                            onChange={billingFormik.handleChange}
                            className="custom-select-height"
                            placeholder="Enter Receivable Amount"
                            disabled
                          />
                          {billingFormik.touched.dueAmount &&
                            billingFormik.errors.dueAmount && (
                              <div className="text-danger">
                                {billingFormik.errors.dueAmount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Receive Amount</Form.Label>
                          <Form.Control
                            type="text"
                            name="paidAmount"
                            value={billingFormik.values.paidAmount}
                            onChange={billingFormik.handleChange}
                            className="custom-select-height"
                            placeholder="Enter Receive Amount"
                            disabled={
                              billingFormik.values.dueAmount === "0" || 0
                            }
                          />
                          {billingFormik.touched.paidAmount &&
                            billingFormik.errors.paidAmount && (
                              <div className="text-danger">
                                {billingFormik.errors.paidAmount}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Mode</Form.Label>
                          <Select
                            options={modeOptions}
                            value={
                              modeOptions?.find(
                                (option) =>
                                  option.value ===
                                  billingFormik.values.paymentMode,
                              ) || null
                            }
                            onChange={(option) =>
                              billingFormik.setFieldValue(
                                "paymentMode",
                                option ? option.value : "",
                              )
                            }
                            placeholder="Select Payment Mode"
                            classNamePrefix="custom-select"
                            styles={{
                              control: (base) => ({
                                ...base,
                                minHeight: "38px",
                                fontSize: "13px",
                              }),
                            }}
                            isDisabled={
                              billingFormik.values.dueAmount === "0" || 0
                            }
                          />
                          {billingFormik.touched.paymentMode &&
                            billingFormik.errors.paymentMode && (
                              <div className="text-danger">
                                {billingFormik.errors.paymentMode}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Payment Date</Form.Label>
                          <div style={{ position: "relative" }}>
                            <Form.Control
                              type="text"
                              name="date"
                              value={
                                billingFormik.values.date
                                  ? formatDate(
                                      parseDate(billingFormik.values.date),
                                    )
                                  : ""
                              }
                              disabled={
                                billingFormik.values.dueAmount === "0" || 0
                              }
                              ref={paidDateInputRef}
                              onClick={() => {
                                if (billingFormik.values.date) {
                                  setPaidDateValue(
                                    parseDate(billingFormik.values.date),
                                  );
                                }
                                setShowPaidDateCalendar((show) => !show);
                              }}
                              className="custom-select-height"
                              placeholder="dd/mm/yyyy"
                              style={{
                                cursor:
                                  billingFormik.values.dueAmount === "0" || 0
                                    ? "not-allowed"
                                    : "pointer",
                                backgroundColor: "#fff",
                              }}
                            />
                            {billingFormik.values.date ? (
                              <button
                                type="button"
                                onClick={() => {
                                  billingFormik.setFieldValue("date", "");
                                  setPaidDateValue(null);
                                  setShowPaidDateCalendar(false);
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
                            {showPaidDateCalendar && (
                              <div
                                ref={paidDateCalendarRef}
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
                                    setPaidDateValue(selectedDate);
                                    billingFormik.setFieldValue(
                                      "date",
                                      toISODate(selectedDate),
                                    );
                                    setShowPaidDateCalendar(false);
                                  }}
                                  value={paidDateValue}
                                  locale="en-GB"
                                />
                              </div>
                            )}
                          </div>
                          {billingFormik.touched.date &&
                            billingFormik.errors.date && (
                              <div className="text-danger">
                                {billingFormik.errors.date}
                              </div>
                            )}
                        </Form.Group>
                      </Col>
                      {["GPay", "Bank", "UPI"].includes(
                        billingFormik.values.paymentMode,
                      ) && (
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bank</Form.Label>
                            <Select
                              options={bankOptions}
                              value={
                                bankOptions?.find(
                                  (option) =>
                                    option.value === billingFormik.values.bank,
                                ) || null
                              }
                              onChange={(option) =>
                                billingFormik.setFieldValue(
                                  "bank",
                                  option ? option.value : "",
                                )
                              }
                              placeholder="Select Bank"
                              classNamePrefix="custom-select"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  minHeight: "38px",
                                  fontSize: "13px",
                                }),
                              }}
                            />
                            {billingFormik.touched.bank &&
                              billingFormik.errors.bank && (
                                <div className="text-danger">
                                  {billingFormik.errors.bank}
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      )}
                    </Row>
                    <Modal.Footer className="border-0">
                      <Button
                        variant="outline-primary"
                        className="custom-select-height"
                        onClick={handleCloseBillingModal}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        className="custom-select-height"
                      >
                        Update
                      </Button>
                    </Modal.Footer>
                  </Form>

                  {/* Payment History Section */}
                  {selectedItem?.paidAmount?.length > 0 && (
                    <div className="mt-4">
                      <h5
                        className="rounded-pill shadow-sm my-3 p-2"
                        style={{
                          backgroundColor: "#E9ECEF",
                          border: "1px solid #D3D3D3",
                        }}
                      >
                        Payment History
                      </h5>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Bank</th>
                              <th>Payment Mode</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedItem.paidAmount?.map((payment, index) => (
                              <tr key={index}>
                                <td>
                                  {formatDate(parseDate(payment.date)) || "-"}
                                </td>
                                <td>{payment.amount || "-"}</td>
                                <td>
                                  {payment.bank
                                    ? allBankingDetails?.find(
                                        (b) => b._id === payment.bank,
                                      )?.bankName || "N/A"
                                    : "-"}
                                </td>
                                <td>{payment.paymentMode || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </Modal.Body>
              </Modal>
              {totalPages > 1 && allGenerateInvoice.length > 0 && (
                <div className="mt-4 d-flex justify-content-end align-items-end">
                  <Paginations
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header className="form-main-heading">
          <Modal.Title>
            {formik.values.id ? "Update Invoice" : "Add Invoice"}
          </Modal.Title>
          <AiOutlineClose
            size={20}
            style={{ cursor: "pointer", color: "white" }}
            onClick={handleCloseModal}
          />
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              {/* ---- Student Name ---- */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Student Name</Form.Label>
                  <Select
                    options={uniqueStudentOptions}
                    value={
                      uniqueStudentOptions?.find(
                        (option) => option.value === formik.values.name,
                      ) || null
                    }
                    onChange={(option) =>
                      formik.setFieldValue("name", option ? option.value : "")
                    }
                    placeholder="Select student"
                    classNamePrefix="custom-select"
                    isSearchable
                    isClearable
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-danger">{formik.errors.name}</div>
                  )}
                </Form.Group>
              </Col>

              {/* ---- Phone Number ---- */}
              <Col md={6} className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <PhoneInput
                  country={countryCodeISO()}
                  value={formik.values.contactNo || ""}
                  onChange={(phone, data) => {
                    if (!phone || phone === data.dialCode) {
                      formik.setFieldValue("contactNo", "");
                    } else {
                      const dialCode = data.dialCode ? `+${data.dialCode}` : "";
                      const formattedPhone = `${dialCode} ${phone.replace(
                        data.dialCode,
                        "",
                      )}`.trim();
                      formik.setFieldValue("contactNo", formattedPhone);
                    }
                  }}
                  inputProps={{
                    name: "phone",
                    required: true,
                    className: "form-control custom-select-height",
                  }}
                  inputStyle={{
                    width: "100%",
                    paddingLeft: "65px",
                    borderRadius: "4px",
                  }}
                  buttonStyle={{
                    marginRight: "10px",
                  }}
                />
                {formik?.touched?.contactNo && formik.errors.contactNo && (
                  <div className="text-danger">{formik.errors.contactNo}</div>
                )}
              </Col>

              {/* ---- Main Plan ---- */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Main Plan</Form.Label>
                  <Select
                    options={mainPlanOptions}
                    value={
                      mainPlanOptions?.find(
                        (option) => option.value === formik.values.mainPlan,
                      ) || null
                    }
                    onChange={(option) =>
                      formik.setFieldValue(
                        "mainPlan",
                        option ? option.value : "",
                      )
                    }
                    placeholder="Select plan"
                    classNamePrefix="custom-select"
                    isSearchable
                    isClearable
                  />
                  {formik.touched.mainPlan && formik.errors.mainPlan && (
                    <div className="text-danger">{formik.errors.mainPlan}</div>
                  )}
                </Form.Group>
              </Col>

              {/* ---- Sub Plan ---- */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sub Plan</Form.Label>
                  <Select
                    options={subPlanOptions}
                    value={
                      subPlanOptions?.find(
                        (option) => option.value === formik.values.subPlan,
                      ) || null
                    }
                    onChange={(option) =>
                      formik.setFieldValue(
                        "subPlan",
                        option ? option.value : "",
                      )
                    }
                    placeholder="Select sub plan"
                    classNamePrefix="custom-select"
                    isSearchable
                    isClearable
                  />
                  {formik.touched.subPlan && formik.errors.subPlan && (
                    <div className="text-danger">{formik.errors.subPlan}</div>
                  )}
                </Form.Group>
              </Col>

              {/* ---- Plan Amount ---- */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Plan Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    disabled
                    readOnly
                  />
                  {formik.touched.amount && formik.errors.amount && (
                    <div className="text-danger">{formik.errors.amount}</div>
                  )}
                </Form.Group>
              </Col>

              {/* ---- Discount ---- */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="text"
                    name="discount"
                    value={formik.values.discount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    // placeholder="e.g., 10%"
                  />
                  {formik.touched.discount && formik.errors.discount && (
                    <div className="text-danger">{formik.errors.discount}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="discountAmount"
                    value={formik.values.discountAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    placeholder="e.g., 10"
                  />
                  {formik.touched.discountAmount &&
                    formik.errors.discountAmount && (
                      <div className="text-danger">
                        {formik.errors.discountAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              {/* ---- Payable Amount ---- */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payable Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="payableAmount"
                    value={formik.values.payableAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    disabled
                    readOnly
                  />
                  {formik.touched.payableAmount &&
                    formik.errors.payableAmount && (
                      <div className="text-danger">
                        {formik.errors.payableAmount}
                      </div>
                    )}
                </Form.Group>
              </Col>

              {/* ---- Paid Amount ---- */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Receive Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="paidAmount.amount"
                    value={formik.values.paidAmount.amount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    placeholder="Enter Receive Amount"
                  />
                  {formik.touched.paidAmount?.amount &&
                    formik.errors.paidAmount?.amount && (
                      <div className="text-danger mt-1">
                        {formik.errors.paidAmount.amount}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Mode</Form.Label>
                  <Select
                    options={modeOptions}
                    value={
                      modeOptions?.find(
                        (option) =>
                          option.value === formik.values.paidAmount.paymentMode,
                      ) || null
                    }
                    onChange={(option) =>
                      formik.setFieldValue(
                        "paidAmount.paymentMode",
                        option ? option.value : "",
                      )
                    }
                    placeholder="Select Payment Mode"
                    classNamePrefix="custom-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "38px",
                        fontSize: "13px",
                      }),
                    }}
                  />
                  {formik.touched.paidAmount?.paymentMode &&
                    formik.errors.paidAmount?.paymentMode && (
                      <div className="text-danger mt-1">
                        {formik.errors.paidAmount.paymentMode}
                      </div>
                    )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Paid Date</Form.Label>
                  <div style={{ position: "relative" }}>
                    <Form.Control
                      type="text"
                      name="paidAmount.date"
                      value={
                        formik.values.paidAmount.date
                          ? formatDate(parseDate(formik.values.paidAmount.date))
                          : ""
                      }
                      readOnly
                      ref={paidDateInputRef}
                      onClick={() => {
                        if (formik.values.paidAmount.date) {
                          setPaidDateValue(
                            parseDate(formik.values.paidAmount.date),
                          );
                        }
                        setShowPaidDateCalendar((show) => !show);
                      }}
                      className="custom-select-height"
                      placeholder="dd/mm/yyyy"
                      style={{ cursor: "pointer", backgroundColor: "#fff" }}
                    />
                    {formik.values.paidAmount.date ? (
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("paidAmount.date", "");
                          setPaidDateValue(null);
                          setShowPaidDateCalendar(false);
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
                    {showPaidDateCalendar && (
                      <div
                        ref={paidDateCalendarRef}
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
                            setPaidDateValue(selectedDate);
                            formik.setFieldValue(
                              "paidAmount.date",
                              toISODate(selectedDate),
                            );
                            setShowPaidDateCalendar(false);
                          }}
                          value={paidDateValue}
                          locale="en-GB"
                        />
                      </div>
                    )}
                  </div>
                  {formik.touched.paidAmount?.date &&
                    formik.errors.paidAmount?.date && (
                      <div className="text-danger mt-1">
                        {formik.errors.paidAmount.date}
                      </div>
                    )}
                </Form.Group>
              </Col>
              {["GPay", "Bank", "UPI"].includes(
                formik.values.paidAmount.paymentMode,
              ) && (
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Bank</Form.Label>
                    <Select
                      options={bankOptions}
                      value={
                        bankOptions?.find(
                          (option) =>
                            option.value === formik.values.paidAmount.bank,
                        ) || null
                      }
                      onChange={(option) =>
                        formik.setFieldValue(
                          "paidAmount.bank",
                          option ? option.value : "",
                        )
                      }
                      placeholder="Select Bank"
                      classNamePrefix="custom-select"
                      styles={{
                        control: (base) => ({
                          ...base,
                          minHeight: "38px",
                          fontSize: "13px",
                        }),
                      }}
                    />
                    {formik.touched.paidAmount?.bank &&
                      formik.errors.paidAmount?.bank && (
                        <div className="text-danger mt-1">
                          {formik.errors.paidAmount.bank}
                        </div>
                      )}
                  </Form.Group>
                </Col>
              )}

              {/* ---- Due Amount ---- */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Receivable Amount</Form.Label>
                  <Form.Control
                    type="text"
                    name="dueAmount"
                    value={formik.values.dueAmount}
                    onChange={formik.handleChange}
                    className="custom-select-height"
                    disabled
                    readOnly
                  />
                  {formik.touched.dueAmount && formik.errors.dueAmount && (
                    <div className="text-danger">{formik.errors.dueAmount}</div>
                  )}
                </Form.Group>
              </Col>

              {/* ---- Remarks ---- */}
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="remarks"
                    value={formik.values.remarks}
                    onChange={formik.handleChange}
                    className="rounded-4"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Modal.Footer>
              <Button
                variant="primary"
                type="submit"
                className="custom-select-height"
              >
                {formik.values.id ? "Update" : "Submit"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PaymentInvoice;
