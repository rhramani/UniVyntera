import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TemplateList from "../Tamplates/TemplateList";
import CampaignMediaUploadModal from "./utils/CampaignMediaUploadModal";
import VariableMappingModal from "./utils/VariableMappingModal";
import { useNavigate } from "react-router-dom";
import { getTemplates } from "../../../redux/actions/BulkMessage/Template.action";
import { getAllExportContacts } from "../../../redux/actions/BulkMessage/Contact.action";
import { getAllCredential } from "../../../redux/actions/BulkMessage/Credential.action";
import {
  getAllGroup,
  getGroupById,
} from "../../../redux/actions/BulkMessage/Group.action";
import { createCampaign } from "../../../redux/actions/BulkMessage/Compaign.action";
import { Button, Card, Col, Form, Row, Alert } from "react-bootstrap";
import Select from "react-select";
import Pageheader from "../../../layouts/Pageheader";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import { toast } from "react-toastify";

const CreateCampaign = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [ownerName, setOwnerName] = useState("SmartX CRM");
  const [fromNumber, setFromNumber] = useState("917575888326");
  const [recipientType, setRecipientType] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [variableMappings, setVariableMappings] = useState({});
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [credential, setCredential] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupById, setGroupById] = useState({});

  const approvedTemplates = templates?.filter((t) => t.status === "APPROVED");

  const fetchAllTemplates = async (category = "") => {
    try {
      const res = await dispatch(getTemplates(category));
      if (res?.status === 200) {
        setTemplates(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to fetch templates");
    }
  };

  const fetchAllExportContacts = async () => {
    try {
      const res = await dispatch(getAllExportContacts());
      if (res?.status === 200) {
        setContacts(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to fetch contacts");
    }
  };

  const fetchAllGroup = async () => {
    try {
      const res = await dispatch(getAllGroup());
      if (res?.status === 200) {
        setGroups(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
      toast.error("Failed to fetch groups");
    }
  };

  const fetchGroupById = async (groupId) => {
    try {
      const res = await dispatch(getGroupById(groupId));
      if (res?.status === 200) {
        setGroupById(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching group by ID:", error);
      toast.error("Failed to fetch group details");
    }
  };

  const fetchAllCredential = async () => {
    try {
      const res = await dispatch(getAllCredential());
      if (res?.status === 200 && res?.data?.data?.length) {
        setCredential(res?.data?.data[0]);
      }
    } catch (error) {
      console.error("Error fetching credentials:", error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchAllGroup(),
          fetchAllTemplates(),
          fetchAllExportContacts(),
          fetchAllCredential(),
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const variableFields = React.useMemo(() => {
    const allContacts =
      recipientType === "contacts" ? contacts : groupById?.contactIds || [];

    const fieldSet = new Set();

    allContacts.forEach((contact) => {
      const keys = Object.keys(contact || {});

      if (keys.includes("fname")) fieldSet.add("firstName");
      if (keys.includes("lname")) fieldSet.add("lastName");

      if (contact.fname && contact.lname) {
        fieldSet.add("fullName");
      }
    });

    return Array.from(fieldSet);
  }, [recipientType, contacts, groupById?.contactIds]);

  useEffect(() => {
    if (credential?.registerdPhoneNumber) {
      setFromNumber(credential.registerdPhoneNumber);
    }
  }, [credential?.registerdPhoneNumber]);

  useEffect(() => {
    if (recipientType === "groups" && selectedGroup) {
      fetchGroupById(selectedGroup);
    }
  }, [recipientType, selectedGroup]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setMediaUrl(null);
    const header = template.components.find((c) => c.type === "HEADER");
    const isMedia = ["IMAGE", "VIDEO", "DOCUMENT"].includes(header?.format);
    if (isMedia) {
      setIsSampleModalOpen(true);
    }
  };

  const handleCancel = () => {
    setCampaignName("");
    setRecipientType("");
    setSelectedGroup("");
    setSelectedTemplate(null);
    setMediaUrl(null);
    setVariableMappings({});
  };

  const buildCampaignPayload = ({
    campaignName,
    selectedTemplate,
    recipientType,
    contacts,
    groupById,
    variableMappings,
    mediaUrl,
    uploadedFileName,
  }) => {
    let contactGroup = [];
    let allContacts = [];

    if (recipientType === "contacts") {
      allContacts = contacts.filter((c) => c.isSubscribed);
      contactGroup = allContacts.map((c) => c.phoneNumber);
    } else if (recipientType === "groups") {
      allContacts = (groupById?.contactIds || []).filter((c) => c.isSubscribed);
      contactGroup = allContacts.map((c) => c.phoneNumber);
    }

    const header = selectedTemplate.components.find((c) => c.type === "HEADER");
    const format = header?.format;
    const hasVariables = /{{\d+}}/.test(
      selectedTemplate.components.find((c) => c.type === "BODY")?.text || ""
    );

    let parameters = [];

    const getFieldValue = (contact, index) => {
      const mapping = variableMappings[index];
      if (!mapping) return "";
      switch (mapping.field) {
        case "firstName":
          return contact.fname || mapping.default || "";
        case "lastName":
          return contact.lname || mapping.default || "";
        case "fullName":
          return (
            `${contact.fname || ""} ${contact.lname || ""}`.trim() ||
            mapping.default ||
            ""
          );
        default:
          return contact?.[mapping.field] || mapping.default || "";
      }
    };

    if (["IMAGE", "VIDEO", "DOCUMENT"]?.includes(format) && mediaUrl) {
      if (hasVariables && Object.keys(variableMappings)?.length > 0) {
        parameters = allContacts.map((contact) => {
          const bodyParams = Object.keys(variableMappings)
            .sort((a, b) => +a - +b)
            .map((index) => getFieldValue(contact, index));

          return {
            header: {
              type: format.toLowerCase(),
              value: mediaUrl,
              filename: uploadedFileName,
            },
            body: bodyParams,
          };
        });
      } else {
        parameters = contactGroup.map(() => ({
          header: {
            type: format.toLowerCase(),
            value: mediaUrl,
            filename: uploadedFileName,
          },
          body: [],
        }));
      }
    } else if (hasVariables && Object.keys(variableMappings)?.length > 0) {
      parameters = allContacts.map((contact) => {
        const bodyParams = Object.keys(variableMappings)
          .sort((a, b) => +a - +b)
          .map((index) => getFieldValue(contact, index));
        return { body: bodyParams };
      });
    } else if (selectedTemplate.components?.some((c) => c.type === "BODY")) {
      parameters = contactGroup.map(() => ({ body: [] }));
    }

    return {
      name: campaignName,
      templateId: selectedTemplate.id || selectedTemplate.templateId,
      templateName: selectedTemplate.name,
      language: selectedTemplate.language || selectedTemplate.languageCode,
      contactGroup,
      fromNumberId: fromNumber,
      parameters,
    };
  };

  const validateForm = () => {
    if (!campaignName.trim()) {
      toast.error("Campaign name is required");
      return false;
    }
    if (!selectedTemplate) {
      toast.error("Please select a template");
      return false;
    }
    if (!recipientType) {
      toast.error("Please select recipients");
      return false;
    }
    if (recipientType === "groups" && !selectedGroup) {
      toast.error("Please select a group");
      return false;
    }

    // Check if template has media but no media uploaded
    const header = selectedTemplate.components.find((c) => c.type === "HEADER");
    const isMedia = ["IMAGE", "VIDEO", "DOCUMENT"].includes(header?.format);
    if (isMedia && !mediaUrl) {
      toast.error("Please upload media for this template");
      return false;
    }

    // Check contacts availability
    const contactsToSend =
      recipientType === "contacts" ? contacts : groupById?.contactIds || [];
    if (contactsToSend.length === 0) {
      toast.error("No contacts available to send campaign");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const payload = buildCampaignPayload({
        campaignName,
        selectedTemplate,
        recipientType,
        contacts,
        groupById,
        variableMappings,
        mediaUrl,
        uploadedFileName,
      });

      const response = await dispatch(createCampaign(payload));

      if (response && response.status === 200) {
        toast.success("Campaign created successfully!");
        setTimeout(() => {
          handleCancel();
          navigate("/campaigns"); // Fixed navigation path
        }, 2000);
      } else {
        throw new Error(response?.message || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error(
        error?.message || "Failed to create campaign. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const body = selectedTemplate?.components?.find(
    (c) => c.type === "BODY"
  )?.text;
  const hasVariables = /{{\d+}}/.test(body);

  return (
    <>
      {isLoading && (
        <div className="loaderAdd">
          <div className="loader_line">
            <img
              src={localStorage.getItem("logo")}
              className="w-[130px]"
              alt="Loading"
            />
          </div>
        </div>
      )}
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

      <div className="min-vh-100 bg-light pb-5 position-relative">
        <Pageheader
          mainheading="Create Campaign"
          parentfolder="Campaigns"
          activepage="Create Campaign"
        />

        <Row className="mt-5 row-sm">
          <Col md={12} lg={12} xl={12}>
            <Card className="custom-card transcation-crypto">
              <Card.Header className="border-bottom-0 mt-2">
                <div>
                  <div className="card-title">Create New Campaign</div>
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3 align-items-end">
                  <Col md={3} className="mb-3">
                    <Form.Label>
                      Campaign Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="custom-select-height"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Enter campaign name"
                    />
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Label>
                      Campaign Owner Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="custom-select-height"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Enter owner name"
                    />
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Label>From Number</Form.Label>
                    <Form.Control
                      type="text"
                      className="custom-select-height"
                      value={fromNumber}
                      onChange={(e) => setFromNumber(e.target.value)}
                      placeholder="Enter from number"
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Label>Select Recipients</Form.Label>
                    <div className="d-flex flex-column">
                      <Form.Check
                        type="radio"
                        label={`All Contacts (${contacts?.length || 0})`}
                        name="recipientType"
                        value="contacts"
                        checked={recipientType === "contacts"}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className="custom-radio-border"
                      />
                      <Form.Check
                        type="radio"
                        label="All Groups"
                        name="recipientType"
                        value="groups"
                        checked={recipientType === "groups"}
                        onChange={(e) => setRecipientType(e.target.value)}
                        className="custom-radio-border"
                      />
                    </div>
                  </Col>
                </Row>

                {recipientType === "groups" && (
                  <Row className="mb-3">
                    <Col md={3}>
                      <Form.Label>Select Group</Form.Label>
                      <Select
                        classNamePrefix="custom-select"
                        value={groups?.find(
                          (g) =>
                            g.id === selectedGroup || g._id === selectedGroup
                        )}
                        onChange={(selectedOption) =>
                          setSelectedGroup(
                            selectedOption?.id || selectedOption?._id
                          )
                        }
                        options={groups?.map((group) => ({
                          value: group.id || group._id,
                          label: `${group.name} (${
                            group?.contactIds?.length || 0
                          } contacts)`,
                          id: group.id || group._id,
                        }))}
                        placeholder="Select group"
                        isClearable
                      />
                    </Col>
                  </Row>
                )}

                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Label>Select Template</Form.Label>
                    {approvedTemplates?.length === 0 ? (
                      <div className="p-4 bg-light rounded-3 text-muted">
                        No approved templates available.
                      </div>
                    ) : (
                      <TemplateList
                        templates={approvedTemplates}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        showDelete={false}
                        showRadio={true}
                        selectedTemplate={selectedTemplate}
                        onTemplateSelect={handleTemplateSelect}
                      />
                    )}
                  </Col>
                </Row>

                <div style={{ paddingBottom: "80px" }}></div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {selectedTemplate && (
          <CampaignMediaUploadModal
            key={selectedTemplate.id || selectedTemplate.name}
            isOpen={isSampleModalOpen}
            onClose={() => setIsSampleModalOpen(false)}
            onCloseWithoutUpload={() => setSelectedTemplate(null)}
            headerFormat={
              selectedTemplate.components.find((c) => c.type === "HEADER")
                ?.format || ""
            }
            selectedTemplate={selectedTemplate}
            onUploadSuccess={({ mediaId, fileName }) => {
              setMediaUrl(mediaId);
              setUploadedFileName(fileName);
            }}
          />
        )}

        <VariableMappingModal
          isOpen={showVariableModal}
          onClose={() => setShowVariableModal(false)}
          messageBody={body}
          variableFields={variableFields}
          onSave={(mappings) => {
            setVariableMappings(mappings);
          }}
        />

        <div
          className="bottom-0 position-fixed bg-white py-3 px-4 d-flex flex-wrap justify-content-end align-items-center gap-3 border-top pe-5"
          style={{
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
            left: 0,
            right: 0,
          }}
        >
          <Button
            variant="outline-primary"
            className="custom-select-height"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            className="custom-select-height"
            onClick={() => setShowVariableModal(true)}
            disabled={!selectedTemplate || isLoading}
          >
            Add Variables
          </Button>

          <Button
            variant="success"
            className="custom-select-height px-4 me-5"
            onClick={handleSave}
            disabled={
              !campaignName || !selectedTemplate || !recipientType || isLoading
            }
          >
            Create Campaign
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateCampaign;
