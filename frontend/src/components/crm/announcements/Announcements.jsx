import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { Button, Card, Col, Form, Row, Modal } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import Pageheader from "../../../layouts/Pageheader";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import {
  addAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  uploadAnnouncement,
} from "../../../redux/actions/Announcement.action";
import { useDispatch } from "react-redux";
import Select from "react-select";
import DataTable from "../../commonComponents/DataTable";
import ItemsPerPageSelect from "../../commonComponents/ItemsPerPageSelect";
import Paginations from "../../elements/Paginations";
import usePermissions from "../../commonComponents/usePermissions";
import { BASEURL, REACT_APP_API_URL } from "../../../baseUrl";
import { AiOutlineClose } from "react-icons/ai";
import { decryptData } from "../../../utils/encryptionUtils";
import { createPortal } from "react-dom";
import { getAllClientMailCategory } from "../../../redux/actions/Master/AddClientCategory.action";
import DeleteConfirmModal from "../../bulkMessage/commonDeleteModal/DeleteConfirmModal";

const Announcements = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [announcementData, setAnnouncementData] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { canCreate, canUpdate, canRead, canDelete } =
    usePermissions("Announcements");

  const [showPopup, setShowPopup] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 0 });
  const userRole = decryptData(localStorage.getItem("role"));
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorRange, setCursorRange] = useState(null);
  const [messageImage, setMessageImage] = useState(null);
  const [messageFile, setMessageFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const editorRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const [emojiPickerPosition, setEmojiPickerPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleEmojiButtonClick = () => {
    setShowEmojiPicker((prev) => {
      const next = !prev;
      if (next && emojiButtonRef.current) {
        const rect = emojiButtonRef.current.getBoundingClientRect();
        setEmojiPickerPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
        });
      }
      return next;
    });
    saveCursorPosition();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("fileUrl", file);
    } else {
      formik.setFieldValue("fileUrl", null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current?.querySelector("[contentEditable]");
    if (editor) {
      editor.focus();
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(editor, 0);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const editor = editorRef.current;
      const options = editor?.querySelector(".image-options");
      if (showOptions && options && !options.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  const handleShowPopup = (message) => {
    setSelectedMessage(message);
    setShowPopup(true);
  };

  const handleCloseUploadModal = () => {
    setShowDeleteModal(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedMessage("");
  };

  const handleCloseImagePreview = () => {
    setShowImagePreview(false);
    setPreviewImageSrc("");
  };

  const fetchAnnouncementData = async (
    page = 1,
    limit = itemsPerPage,
    searchTerm = "",
    role = userRole,
  ) => {
    try {
      const res = await dispatch(
        getAnnouncement(page, limit, searchTerm, role),
      );
      if (res?.status === 200) {
        const responseData = res?.data?.data || {};
        setAnnouncementData(responseData?.data || []);
        setTotalRecords(responseData?.totalRecords || 0);
        setTotalPages(responseData?.totalPages || 0);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncementData([]);
      setTotalRecords(0);
      setTotalPages(0);
      toast.error("Failed to fetch announcements.");
    }
  };

  const fetchCategoryOptions = async () => {
    try {
      const res = await dispatch(getAllClientMailCategory(1, 100, ""));
      if (res?.status === 200) {
        const categories = res?.data?.data?.data || [];
        setCategoryOptions(
          categories.map((category) => ({
            value: category._id,
            label: category.name || category.title || "Unnamed Category",
          })),
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchAnnouncementData(currentPage, itemsPerPage, search);
    fetchCategoryOptions();
  }, [currentPage, itemsPerPage, search]);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setMessageImage(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const imgSrc = event.target.result;
        const editor = editorRef.current.querySelector("[contentEditable]");
        editor.focus();

        const imgContainer = document.createElement("div");
        const img = document.createElement("img");
        img.src = imgSrc;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.display = "block";

        img.setAttribute("data-file-image", "true");
        img.setAttribute("data-file-name", file.name);

        img.onclick = (e) => handleImageClick(e);
        img.ondblclick = (e) => handleImageDoubleClick(e.target);
        imgContainer.appendChild(img);

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(imgContainer);

          range.setStartAfter(imgContainer);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          editor.appendChild(imgContainer);
        }

        editor.scrollTop = editor.scrollHeight;
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleImageClick = (e) => {
    const img = e.target;
    const rect = img.getBoundingClientRect();
    const containerRect = editorRef.current.getBoundingClientRect();
    setOptionsPosition({
      top: rect.bottom - containerRect.top + window.scrollY,
      left: rect.left - containerRect.left + window.scrollX,
    });
    setSelectedImage(img);
    img.style.border = img.style.border ? "" : "2px solid #4285f4";
    setShowOptions(true);
    e.stopPropagation();
  };

  const handleImageOption = (option) => {
    if (selectedImage) {
      switch (option) {
        case "Remove":
          if (selectedImage.parentNode) {
            selectedImage.parentNode.removeChild(selectedImage);
            setMessageImage(null);
          }
          setSelectedImage(null);
          break;
        default:
          break;
      }
      setShowOptions(false);
    }
  };

  const handleImageDoubleClick = (img) => {
    setPreviewImageSrc(img.src);
    setShowImagePreview(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
      "application/zip",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file format uploaded.");
      return;
    }

    setMessageFile(file);

    const handleRemoveFile = () => {
      setMessageFile(null);
      setFilePreview(null);
      e.target.value = "";
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileUrl = event.target.result;

      const openFile = () => {
        if (file.type.startsWith("image/") || file.type === "application/pdf") {
          const newTab = window.open();
          newTab.document.write(
            `<iframe src="${fileUrl}" width="100%" height="100%" style="border:none;"></iframe>`,
          );
        } else {
          const blob = new Blob([event.target.result], { type: file.type });
          const url = URL.createObjectURL(blob);
          window.open(url, "_blank");
        }
      };

      const previewElement = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "5px 10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f8f9fa",
            marginTop: "10px",
            maxWidth: "200px",
            wordWrap: "break-word",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            <span
              onClick={openFile}
              style={{
                color: "#007bff",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: "14px",
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {file.name} ({(file.size / 1024).toFixed(0)}K)
            </span>
            <button
              onClick={handleRemoveFile}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: "16px",
                color: "#dc3545",
                padding: 0,
                margin: 0,
                lineHeight: 1,
              }}
              title="Remove file"
            >
              ×
            </button>
          </div>

          {file.type.startsWith("image/") && (
            <img
              src={fileUrl}
              alt={file.name}
              style={{
                maxWidth: "100%",
                maxHeight: "100px",
                marginTop: "10px",
              }}
            />
          )}
        </div>
      );

      setFilePreview(previewElement);
    };

    reader.readAsDataURL(file);
  };

  const formik = useFormik({
    initialValues: {
      type: [],
      individualEmail: "",
      subject: "",
      message: "",
      fileUrl: null,
      categories: [],
    },
    validationSchema: Yup.object({
      type: Yup.array().min(1, "At least one type is required"),
      individualEmail: Yup.string().email("Invalid email format").nullable(),
      subject: Yup.string().required("Subject is required"),
      message: Yup.string().test(
        "message-or-media",
        "Message or media is required",
        function (value) {
          const { messageImage, messageFile } = this.parent;
          return value || messageImage || messageFile;
        },
      ),
      categories: Yup.array().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!(canCreate || canUpdate)) {
        toast.error("You do not have permission to create announcements.");
        return;
      }
      setIsLoading(true);
      try {
        let imageUrl = null;
        let fileUrl = null;

        if (messageImage || messageFile) {
          const mediaFormData = new FormData();
          if (messageImage) {
            mediaFormData.append("messageImage", messageImage);
          }
          if (messageFile) {
            mediaFormData.append("messageFile", messageFile);
          }

          const uploadRes = await dispatch(uploadAnnouncement(mediaFormData));
          if (uploadRes?.status !== 201) {
            throw new Error("Failed to upload media files");
          }

          imageUrl = uploadRes?.data?.imageUrl
            ? uploadRes.data.imageUrl.startsWith("http")
              ? uploadRes.data.imageUrl
              : `${BASEURL}/${uploadRes.data.imageUrl}`
            : null;
          fileUrl =
            uploadRes?.data?.fileUrl || uploadRes?.data?.fileId
              ? (uploadRes.data.fileUrl || uploadRes.data.fileId).startsWith(
                  "http",
                )
                ? uploadRes.data.fileUrl || uploadRes.data.fileId
                : `${BASEURL}/${
                    uploadRes.data.fileUrl || uploadRes.data.fileId
                  }`
              : null;
        }

        const editor = editorRef.current.querySelector("[contentEditable]");
        const editorContent = editor.cloneNode(true);

        let imageUrlUsed = false;
        let fileUrlUsed = false;

        const fileImages = editorContent.querySelectorAll(
          'img[data-file-image="true"]',
        );
        if (fileImages.length > 0) {
          fileImages.forEach((img) => {
            if (imageUrl && !imageUrlUsed) {
              // img.outerHTML = `<a href="${imageUrl}" target="_blank">Click to view</a>`;
              img.src = imageUrl;
              img.alt = messageImage?.name || "Uploaded image";
              imageUrlUsed = true;
            } else if (fileUrl && !fileUrlUsed) {
              img.outerHTML = `<a href="${fileUrl}" target="_blank">Click to view</a>`;
              fileUrlUsed = true;
            }
            img.removeAttribute("data-file-image");
            img.removeAttribute("data-file-name");
          });
        }

        if (imageUrl || fileUrl) {
          const fragment = document.createDocumentFragment();

          if (imageUrl && !imageUrlUsed) {
            const imageLink = document.createElement("a");
            imageLink.href = imageUrl;
            imageLink.target = "_blank";
            imageLink.textContent = `Click to view ${
              messageImage?.name || "image"
            }`;
            fragment.appendChild(document.createTextNode(" "));
            fragment.appendChild(imageLink);
          }

          if (fileUrl && !fileUrlUsed) {
            const fileLink = document.createElement("a");
            fileLink.href = fileUrl;
            fileLink.target = "_blank";
            fileLink.textContent = `Click to view ${
              messageFile?.name || "file"
            }`;
            fragment.appendChild(document.createTextNode(" "));
            fragment.appendChild(fileLink);
          }

          if (fragment.childNodes.length > 0) {
            editorContent.appendChild(fragment);
          }
        }

        const cleanedMessage = editorContent.innerHTML;

        // Prepare the announcement payload
        const announcementFormData = new FormData();
        values.type.forEach((typeValue) => {
          announcementFormData.append("type", typeValue);
        });
        announcementFormData.append(
          "individualEmail",
          values.individualEmail || "",
        );
        announcementFormData.append("subject", values.subject);
        announcementFormData.append("message", cleanedMessage);
        values.categories.forEach((category) => {
          announcementFormData.append("categories", category);
        });
        if (values.fileUrl) {
          announcementFormData.append("material", values.fileUrl);
        }
        const res = await dispatch(addAnnouncement(announcementFormData));
        if (res?.status === 200) {
          toast.success("Announcement sent successfully");
          resetForm();
          const editor = editorRef.current.querySelector("[contentEditable]");
          if (editor) {
            editor.innerHTML = "";
            document.execCommand("hiliteColor", false, "transparent");
            document.execCommand("foreColor", false, "#000000");
          }
          setMessageImage(null);
          setMessageFile(null);
          setFilePreview(null);
          formik.setFieldValue("fileUrl", null);

          const fileInput = document.querySelector(
            'input[type="file"][accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv,application/zip"]',
          );
          if (fileInput) fileInput.value = "";
          const imageInput = document.querySelector(
            'input[type="file"][accept="image/*"]',
          );
          if (imageInput) imageInput.value = "";
          const formFileInput = document.querySelector(
            'input[type="file"][name="fileUrl"]',
          );
          if (formFileInput) formFileInput.value = "";

          const bgColorInput = document.querySelector(
            'input[type="color"][title="Background Color"]',
          );
          const textColorInput = document.querySelector(
            'input[type="color"][title="Text Color"]',
          );
          if (bgColorInput) bgColorInput.value = "#ffffff";
          if (textColorInput) textColorInput.value = "#000000";

          setShowEmojiPicker(false);
          setSelectedImage(null);
          setShowOptions(false);
          setCurrentPage(1);
          await fetchAnnouncementData(1, itemsPerPage, search);
        } else {
          throw new Error("Failed to send announcement");
        }
      } catch (error) {
        console.error("Error submitting announcement:", error);
        toast.error(
          error?.response?.data?.message || "Failed to send announcement",
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleDelete = async (id) => {
    try {
      const res = await dispatch(deleteAnnouncement(id));
      if (res?.status === 200) {
        toast.success("Announcement deleted successfully");
        fetchAnnouncementData(currentPage, itemsPerPage, search, userRole);
      } else {
        toast.error("Failed to delete announcement");
      }
    } catch (error) {
      toast.error("Error while deleting");
    }
  };

  const saveCursorPosition = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setCursorRange(selection.getRangeAt(0));
    }
  };

  const insertEmojiAtCursor = (emoji) => {
    const editor = editorRef.current.querySelector("[contentEditable]");
    editor.focus();

    const selection = window.getSelection();
    selection.removeAllRanges();

    if (cursorRange) {
      selection.addRange(cursorRange);
    }

    const span = document.createTextNode(emoji);
    if (selection.getRangeAt && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);

      range.setStartAfter(span);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      formik.setFieldValue("message", editor.innerHTML);
    }

    setShowEmojiPicker(false);
  };

  const handleEditorInput = (e) => {
    const editor = editorRef.current.querySelector("[contentEditable]");
    const editorContent = editor.cloneNode(true);

    const images = editorContent.querySelectorAll("img");
    images.forEach((img) => {
      img.remove();
    });

    formik.setFieldValue("message", editorContent.innerHTML);
  };

  const handleEditorClick = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      setCursorRange(selection.getRangeAt(0).cloneRange());
    }
  };

  const typeOptions = [
    { value: "Inhouse", label: "Inhouse" },
    { value: "B2B", label: "B2B" },
    { value: "Branch", label: "Branch" },
    { value: "ClientMail", label: "Client Mail" },
  ];

  const fontStyleOptions = [
    { value: "Sans Serif", label: "Sans Serif" },
    { value: "Arial", label: "Arial" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Courier New", label: "Courier New" },
  ];

  const fontSizeOptions = [
    { value: "2", label: "Normal" },
    { value: "3", label: "Medium" },
    { value: "5", label: "Large" },
  ];

  const restoreCursor = () => {
    const editor = editorRef.current.querySelector("[contentEditable]");
    editor.focus();
    const selection = window.getSelection();
    selection.removeAllRanges();
    if (cursorRange) {
      selection.addRange(cursorRange);
    }
  };

  const handleFontStyleChange = (selectedOption) => {
    if (selectedOption) {
      restoreCursor();
      document.execCommand("fontName", false, selectedOption.value);
      formik.setFieldValue(
        "message",
        editorRef.current.querySelector("[contentEditable]").innerHTML,
      );
      saveCursorPosition();
    }
  };

  const handleFontSizeChange = (selectedOption) => {
    if (selectedOption) {
      restoreCursor();
      document.execCommand("fontSize", false, selectedOption.value);
      formik.setFieldValue(
        "message",
        editorRef.current.querySelector("[contentEditable]").innerHTML,
      );
      saveCursorPosition();
    }
  };

  const baseColumns = [
    {
      label: "Type",
      key: "type",
      render: (item) => item.type || "-",
    },
    {
      label: "Subject",
      key: "subject",
      render: (item) => item.subject || "-",
    },
    {
      label: "Message",
      key: "message",
      render: (item) =>
        item.message ? (
          <Button
            variant="link"
            onClick={() => handleShowPopup(item.message)}
            className="p-0 text-primary text-decoration-none"
          >
            View Message
          </Button>
        ) : (
          "-"
        ),
    },
    {
      label: "Sent By",
      key: "sentByName",
      render: (item) => item.sentByName || "-",
    },
    {
      label: "File",
      key: "fileUrl",
      render: (item) => {
        const fileUrl = item.fileUrl
          ? item.fileUrl.startsWith("http")
            ? item.fileUrl
            : `${REACT_APP_API_URL}/${item.fileUrl}`
          : null;

        return fileUrl ? (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        ) : (
          "-"
        );
      },
    },
    {
      label: "Created At",
      key: "createdAt",
      render: (item) =>
        item.createdAt
          ? (() => {
              const date = new Date(item.createdAt).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                },
              );
              const time = new Date(item.createdAt).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                },
              );
              return `${date}, ${time}`;
            })()
          : "-",
    },
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "none",
      background: "transparent",
      padding: "4px 6px",
      cursor: "pointer",
      fontSize: "14px",
      color: "#666",
      borderRadius: "4px",
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        backgroundColor: "#e0e0e0",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#666",
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: 0,
      borderRadius: 4,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e0e0e0" : "white",
      color: "#666",
      "&:hover": {
        backgroundColor: "#d0d0d0",
      },
    }),
  };

  const columns = canDelete
    ? [
        ...baseColumns,
        {
          label: "Action",
          key: "actions",
          render: (item) => (
            <span
              className="icon-border delete-icon ms-2"
              onClick={() => {
                setSelectedItem(item._id);
                setShowDeleteModal(true);
              }}
              title="Delete"
            >
              <DeleteIcon />
            </span>
          ),
        },
      ]
    : baseColumns;

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
          }}
        >
          <LoadMoreButton isLoading={isLoading} />
        </div>
      )}
      <Pageheader
        mainheading="Announcements"
        parentfolder="Home"
        activepage="Announcements"
      />
      <Row className="mt-3 mt-md-5 row-sm">
        <Col xs={12}>
          <Card className="premium-announcement-card shadow-lg mb-4">
            <Card.Header className="premium-announcement-header">
              <div className="card-title">
                <i className="bi bi-megaphone-fill me-2"></i>
                Create New Announcement
              </div>
            </Card.Header>
            <Card.Body className="p-4 p-md-5">
              {(canCreate || canUpdate) && (
                <Form onSubmit={formik.handleSubmit}>
                  <Row className="g-4 mb-4">
                    <Col md={6}>
                      <Form.Group controlId="type">
                        <Form.Label className="announcement-form-label">
                          <i className="bi bi-people-fill text-primary"></i>
                          Target Audience
                        </Form.Label>
                        <Select
                          name="type"
                          options={typeOptions}
                          value={typeOptions.filter((option) =>
                            formik.values.type.includes(option.value),
                          )}
                          isMulti
                          onChange={(selectedOption) => {
                            const newTypes = selectedOption
                              ? selectedOption.map((option) => option.value)
                              : [];
                            formik.setFieldValue("type", newTypes);

                            const needsEmail = newTypes.some((t) =>
                              ["Inhouse", "B2B", "Branch"].includes(t),
                            );
                            if (!needsEmail) {
                              formik.setFieldValue("individualEmail", "");
                              formik.setFieldTouched("individualEmail", false);
                            }
                          }}
                          onBlur={() => formik.setFieldTouched("type", true)}
                          placeholder="Select Type"
                          classNamePrefix="premium-select"
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderRadius: "12px",
                              borderColor: state.isFocused
                                ? "#6c5ffc"
                                : "#e2e8f0",
                              background: "#f8fafc",
                              minHeight: "48px",
                              height: "auto",
                              boxShadow: state.isFocused
                                ? "0 0 0 4px rgba(108, 95, 252, 0.1)"
                                : "none",
                              "&:hover": {
                                borderColor: "#6c5ffc",
                              },
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "#64748b",
                              fontSize: "14px",
                            }),
                          }}
                        />
                        {formik.touched.type && formik.errors.type && (
                          <div className="text-danger small mt-1">
                            {formik.errors.type}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="individualEmail">
                        <Form.Label className="announcement-form-label">
                          <i className="bi bi-envelope-at-fill text-primary"></i>
                          Individual Email (Optional)
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="individualEmail"
                          placeholder="name@example.com"
                          value={formik.values.individualEmail}
                          onChange={formik.handleChange}
                          onBlur={() =>
                            formik.setFieldTouched("individualEmail", true)
                          }
                          className="premium-form-control"
                        />
                        {formik.touched.individualEmail &&
                          formik.errors.individualEmail && (
                            <div className="text-danger small mt-1">
                              {formik.errors.individualEmail}
                            </div>
                          )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="categories">
                        <Form.Label className="announcement-form-label">
                          <i className="bi bi-tags-fill text-primary"></i>
                          Categories
                        </Form.Label>
                        <Select
                          name="categories"
                          options={categoryOptions}
                          value={categoryOptions.filter((option) =>
                            formik.values.categories.includes(option.value),
                          )}
                          isMulti
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "categories",
                              selectedOption
                                ? selectedOption.map((option) => option.value)
                                : [],
                            )
                          }
                          onBlur={() =>
                            formik.setFieldTouched("categories", true)
                          }
                          placeholder="Select Categories"
                          classNamePrefix="premium-select"
                          isDisabled={
                            !formik.values.type.includes("ClientMail")
                          }
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderRadius: "12px",
                              borderColor: state.isFocused
                                ? "#6c5ffc"
                                : "#e2e8f0",
                              background: state.isDisabled
                                ? "#f1f5f9"
                                : "#f8fafc",
                              minHeight: "48px",
                              height: "auto",
                              boxShadow: state.isFocused
                                ? "0 0 0 4px rgba(108, 95, 252, 0.1)"
                                : "none",
                              "&:hover": {
                                borderColor: "#6c5ffc",
                              },
                            }),
                            placeholder: (base) => ({
                              ...base,
                              color: "#64748b",
                              fontSize: "14px",
                            }),
                          }}
                        />
                        {formik.touched.categories &&
                          formik.errors.categories && (
                            <div className="text-danger small mt-1">
                              {formik.errors.categories}
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="subject">
                        <Form.Label className="announcement-form-label">
                          <i className="bi bi-type-h1 text-primary"></i>
                          Subject
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          placeholder="Announcement Title"
                          value={formik.values.subject}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="premium-form-control"
                        />
                        {formik.touched.subject && formik.errors.subject && (
                          <div className="text-danger small mt-1">
                            {formik.errors.subject}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="message">
                        <Form.Label className="announcement-form-label">
                          <i className="bi bi-card-text text-primary"></i>
                          Message Content
                        </Form.Label>
                        <div ref={editorRef} className="premium-editor-wrapper">
                          <div className="premium-gmail-toolbar">
                            <button
                              type="button"
                              onClick={() => document.execCommand("undo")}
                              data-tooltip="Undo"
                            >
                              <UndoIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => document.execCommand("redo")}
                              data-tooltip="Redo"
                            >
                              <RedoIcon />
                            </button>
                            <Select
                              options={fontStyleOptions}
                              onChange={handleFontStyleChange}
                              placeholder="Sans Serif"
                              className="react-select-container"
                              classNamePrefix="react-select"
                              styles={customStyles}
                              isSearchable={false}
                              title="Font Style"
                            />
                            <Select
                              options={fontSizeOptions}
                              onChange={handleFontSizeChange}
                              placeholder="Normal"
                              className="react-select-container"
                              classNamePrefix="react-select"
                              styles={customStyles}
                              isSearchable={false}
                              data-tooltip="Font Size"
                            />
                            <button
                              type="button"
                              onClick={() => document.execCommand("bold")}
                              data-tooltip="Bold"
                            >
                              <FormatBoldIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => document.execCommand("italic")}
                              data-tooltip="Italic"
                            >
                              <FormatItalicIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => document.execCommand("underline")}
                              data-tooltip="Underline"
                            >
                              <FormatUnderlinedIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                document.execCommand("strikeThrough")
                              }
                              data-tooltip="Strikethrough"
                            >
                              <StrikethroughSIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                document.execCommand("justifyLeft")
                              }
                              data-tooltip="Align Left"
                            >
                              <FormatAlignLeftIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                document.execCommand("justifyCenter")
                              }
                              data-tooltip="Align Center"
                            >
                              <FormatAlignCenterIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                document.execCommand("justifyRight")
                              }
                              data-tooltip="Align Right"
                            >
                              <FormatAlignRightIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                document.execCommand("insertUnorderedList")
                              }
                              data-tooltip="Bulleted List"
                            >
                              <FormatListBulletedIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                document.execCommand("insertOrderedList")
                              }
                              data-tooltip="Numbered List"
                            >
                              <FormatListNumberedIcon />
                            </button>
                            <div>
                              <label data-tooltip="Background Color">
                                <input
                                  type="color"
                                  onChange={(e) =>
                                    document.execCommand(
                                      "hiliteColor",
                                      false,
                                      e.target.value,
                                    )
                                  }
                                  data-tooltip="Background Color"
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    padding: "0",
                                    border: "none",
                                  }}
                                  defaultValue="#ffffff"
                                />
                              </label>
                            </div>
                            <div>
                              <label data-tooltip="Text Color">
                                <input
                                  type="color"
                                  onChange={(e) =>
                                    document.execCommand(
                                      "foreColor",
                                      false,
                                      e.target.value,
                                    )
                                  }
                                  data-tooltip="Text Color"
                                  style={{
                                    width: "30px",
                                    height: "30px",
                                    padding: "0",
                                    border: "none",
                                  }}
                                  defaultValue="#000000"
                                />
                              </label>
                            </div>
                            <label
                              className="file-input-label"
                              data-tooltip="Insert Image"
                            >
                              <ImageIcon />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: "none" }}
                              />
                            </label>
                            <button
                              ref={emojiButtonRef}
                              type="button"
                              onClick={handleEmojiButtonClick}
                              data-tooltip="Insert Emoji"
                            >
                              <EmojiEmotionsIcon />
                            </button>
                            <label
                              className="file-input-label"
                              data-tooltip="Insert File"
                            >
                              <AttachFileIcon />
                              <input
                                type="file"
                                accept="image/*,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv,application/zip"
                                onChange={handleFileUpload}
                                style={{ display: "none" }}
                              />
                            </label>
                          </div>
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            className="premium-text-editor"
                            dir="ltr"
                            onInput={handleEditorInput}
                            onClick={handleEditorClick}
                            placeholder="Type your announcement here..."
                          />
                          {showOptions && selectedImage && (
                            <div
                              className="image-options"
                              style={{
                                top: `${optionsPosition.top}px`,
                                left: `${optionsPosition.left}px`,
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div onClick={() => handleImageOption("Remove")}>
                                Remove
                              </div>
                            </div>
                          )}
                          {filePreview && (
                            <div style={{ marginTop: "10px" }}>
                              {filePreview}
                            </div>
                          )}
                          {showEmojiPicker &&
                            createPortal(
                              <div
                                ref={emojiPickerRef}
                                style={{
                                  position: "absolute",
                                  top: emojiPickerPosition.top,
                                  left: emojiPickerPosition.left,
                                  zIndex: 9999,
                                }}
                              >
                                <EmojiPicker
                                  onEmojiClick={(emojiData) =>
                                    insertEmojiAtCursor(emojiData.emoji)
                                  }
                                  height={350}
                                />
                              </div>,
                              document.body,
                            )}
                        </div>
                        {formik.touched.message && formik.errors.message && (
                          <div className="text-danger">
                            {formik.errors.message}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="fileUrl">
                        <Form.Label className="announcement-form-label">
                          <i className="bi bi-cloud-arrow-up-fill text-primary"></i>
                          Official Document Attachment
                        </Form.Label>
                        <div
                          className="file-attachment-zone"
                          onClick={() =>
                            document.getElementById("fileUrl").click()
                          }
                        >
                          <i className="bi bi-file-earmark-plus fs-2 text-muted mb-2 d-block"></i>
                          <span className="text-muted small">
                            {formik.values.fileUrl
                              ? formik.values.fileUrl.name
                              : "Click to upload or drag and drop files here"}
                          </span>
                          <Form.Control
                            type="file"
                            id="fileUrl"
                            name="fileUrl"
                            onChange={handleFileChange}
                            onBlur={formik.handleBlur}
                            className="d-none"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end align-items-center gap-3 mb-3">
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => formik.resetForm()}
                      style={{ borderRadius: "12px", padding: "12px 25px" }}
                    >
                      Clear Form
                    </Button>
                    <Button className="premium-send-btn" type="submit">
                      <i className="bi bi-send-fill me-2"></i>
                      Publish Announcement
                    </Button>
                  </div>
                </Form>
              )}

              {canRead && (
                <div className="form_right_section mb-3 mt-5">
                  <div className="contact-search3">
                    <button type="button" className="btn border-0">
                      <i
                        className="fe fe-search fw-semibold text-muted"
                        aria-hidden="true"
                      ></i>
                    </button>
                    <Form.Control
                      type="text"
                      className="custom-select-height h-6"
                      placeholder="Search here..."
                      autoComplete="off"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <ItemsPerPageSelect
                    itemsPerPage={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                  />

                  <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                    <span>
                      Total Records: <strong>{totalRecords}</strong>
                    </span>
                  </div>
                </div>
              )}

              {canRead ? (
                <>
                  <div
                    className="table-responsive modern-table-wrapper"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    <table
                      className="table table-hover modern-table table-nowrap"
                      style={{ tableLayout: "auto" }}
                    >
                      <thead className="bg-light border-bottom">
                        <tr>
                          <th scope="col" className="No-column">
                            No
                          </th>
                          {columns?.map((col, index) => (
                            <th
                              key={index}
                              scope="col"
                              className="dynamic-width"
                            >
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {announcementData?.length > 0 ? (
                          announcementData
                            ?.filter(Boolean)
                            ?.map((item, index) => (
                              <tr key={index} className="border-bottom">
                                <td className="No-column fw-semibold">
                                  {currentPage && itemsPerPage
                                    ? index +
                                      1 +
                                      (currentPage - 1) * itemsPerPage
                                    : index + 1}
                                </td>
                                {columns?.map((col, colIndex) => (
                                  <td key={colIndex} className="dynamic-width">
                                    {col.render
                                      ? col.render(item)
                                      : item[col.key] || "-"}
                                  </td>
                                ))}
                              </tr>
                            ))
                        ) : (
                          <tr className="no-data-row">
                            <td colSpan={columns?.length + 1}>
                              <div className="no-data-text">
                                No data available
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && announcementData.length > 0 && (
                    <div className="mt-4 d-flex justify-content-end align-items-end">
                      <Paginations
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center my-4">
                  <p>You do not have permission to view announcements.</p>
                </div>
              )}

              <Modal
                show={showPopup}
                onHide={handleClosePopup}
                size="lg"
                centered
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title>Message</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={() => handleClosePopup()}
                  />
                </Modal.Header>
                <Modal.Body>
                  <div
                    dangerouslySetInnerHTML={{ __html: selectedMessage }}
                    style={{
                      padding: "15px",
                      lineHeight: "1.6",
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      minHeight: "200px",
                    }}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleClosePopup}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              <Modal
                show={showImagePreview}
                onHide={handleCloseImagePreview}
                size="lg"
                centered
              >
                <Modal.Header className="form-main-heading">
                  <Modal.Title>Image Preview</Modal.Title>
                  <AiOutlineClose
                    size={20}
                    style={{ cursor: "pointer", color: "white" }}
                    onClick={handleCloseImagePreview}
                  />
                </Modal.Header>
                <Modal.Body className="text-center">
                  <img
                    src={previewImageSrc}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "80vh" }}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    className="custom-select-height"
                    onClick={handleCloseImagePreview}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

              <DeleteConfirmModal
                show={showDeleteModal}
                onHide={handleCloseUploadModal}
                onConfirm={() => {
                  handleDelete(selectedItem);
                  setShowDeleteModal(false);
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Announcements;
