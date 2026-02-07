import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import TemplateList from "./TemplateList";
import {
  deleteTemplate,
  getTemplates,
} from "../../../redux/actions/BulkMessage/Template.action";
import { Button, Card, Row, Col, Nav } from "react-bootstrap";
import LoadMoreButton from "../../commonComponents/LoadMoreButton";
import Pageheader from "../../../layouts/Pageheader";
import { toast } from "react-toastify";

const WhatsAppTemplates = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [templates, setTemplates] = useState([]);

  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchAllTemplates = async (category = "") => {
    setIsLoading(true);
    try {
      const res = await dispatch(getTemplates(category));
      if (res?.status === 200) {
        setTemplates(res?.data?.data);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const approvedTemplates = templates?.filter((t) => t.status === "APPROVED");
  const rejectedTemplates = templates?.filter((t) => t.status === "REJECTED");
  const pendingTemplates = templates?.filter((t) => t.status === "PENDING");

  const confirmDelete = (templateName) => {
    setTemplateToDelete(templateName);
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const res = await dispatch(deleteTemplate(templateToDelete));
      if (res?.status === 200) {
        toast.success("Template deleted successfully");
        setIsOpen(false);
        fetchAllTemplates();
      }
    } catch (error) {
      console.error("Error deleting template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTemplates();
  }, [dispatch]);

  const tabs = [
    { key: 0, label: "Approved Templates" },
    { key: 1, label: "Pending Approval Templates" },
    { key: 2, label: "Rejected Templates" },
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useLayoutEffect(() => {
    const timer = setTimeout(() => checkScroll(), 0);
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [tabIndex]);

  const currentList =
    tabIndex === 0
      ? approvedTemplates
      : tabIndex === 1
      ? pendingTemplates
      : rejectedTemplates;
  const totalRecords = currentList?.length;

  return (
    <>
      <Pageheader
        mainheading="Templates"
        parentfolder="WA Daddy"
        activepage="Templates"
      />
      <Row className="mt-5 row-sm">
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
        <Col md={12} lg={12} xl={12}>
          <Card className="custom-card transcation-crypto">
            <Card.Header className="border-bottom-0">
              {/* <div className="card-title">Templates</div> */}
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
                <Link to="/templates/create-template">
                  <Button variant="primary" className="custom-select-height">
                    + Create New Template
                  </Button>
                </Link>
              </div>

              <Nav
                variant="tabs"
                activeKey={tabIndex}
                onSelect={(selectedKey) => setTabIndex(parseInt(selectedKey))}
                className="mb-3"
              >
                <Nav.Item>
                  <Nav.Link eventKey={0}>Approved Templates</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={1}>Pending Approval Templates</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={2}>Rejected Templates</Nav.Link>
                </Nav.Item>
              </Nav>

              <Row className="mb-3">
                <Col className="d-flex align-items-start justify-content-end gap-2">
                  <div className="custom-select-height total-records px-3 mt-2 mt-md-0 d-flex align-items-center h-6">
                    <span>
                      Total Records :<strong>&nbsp;{totalRecords}</strong>
                    </span>
                  </div>
                </Col>
              </Row>

              {tabIndex === 0 && (
                // approvedTemplates.length === 0 ? (
                //   <div className="text-center p-5 bg-light rounded-3 border shadow-sm">
                //     <i className="bi bi-check-circle text-secondary mb-2" style={{ fontSize: "2rem" }}></i>
                //     <h6 className="fw-bold">No Approved Templates</h6>
                //     <p className="text-muted small">Once your template is approved, it will appear here.</p>
                //   </div>
                // ) : (
                //   <TemplateList
                //     templates={approvedTemplates}
                //     isOpen={isOpen}
                //     setIsOpen={setIsOpen}
                //     confirmDelete={confirmDelete}
                //     handleConfirmDelete={handleConfirmDelete}
                //     templateToDelete={templateToDelete}
                //     showDelete={true}
                //     showRadio={false}
                //   />
                // )

                <TemplateList
                  templates={approvedTemplates}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  confirmDelete={confirmDelete}
                  handleConfirmDelete={handleConfirmDelete}
                  templateToDelete={templateToDelete}
                  showDelete={true}
                  showRadio={false}
                />
              )}

              {tabIndex === 1 && (
                <TemplateList
                  templates={pendingTemplates}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  confirmDelete={confirmDelete}
                  handleConfirmDelete={handleConfirmDelete}
                  templateToDelete={templateToDelete}
                  showDelete={true}
                  showRadio={false}
                />
              )}

              {tabIndex === 2 && (
                // rejectedTemplates.length === 0 ? (
                //   <div className="text-center p-5 bg-light rounded-3 border shadow-sm">
                //     <i className="bi bi-x-circle text-danger mb-2" style={{ fontSize: "2rem" }}></i>
                //     <h6 className="fw-bold mb-1">No Rejected Templates</h6>
                //     <p className="text-muted small mb-0">Rejected templates will appear here along with rejection reasons.</p>
                //   </div>
                // ) : (
                //   <TemplateList
                //     templates={rejectedTemplates}
                //     isOpen={isOpen}
                //     setIsOpen={setIsOpen}
                //     confirmDelete={confirmDelete}
                //     handleConfirmDelete={handleConfirmDelete}
                //     templateToDelete={templateToDelete}
                //     showDelete={true}
                //     showRadio={false}
                //   />
                // )

                <TemplateList
                  templates={rejectedTemplates}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  confirmDelete={confirmDelete}
                  handleConfirmDelete={handleConfirmDelete}
                  templateToDelete={templateToDelete}
                  showDelete={true}
                  showRadio={false}
                />
              )}

              {templates?.length > 0 && (
                <>
                  <h6 className="fw-bold mb-2">
                    WhatsApp Template Complete Response
                  </h6>

                  <style>{`
                  .json-scroll {
                    max-height: 320px;
                    overflow: auto;
                  }
                  .json-scroll::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                  }
                  .json-scroll::-webkit-scrollbar-track {
                    background: #f5f7fb;
                    border-radius: 8px;
                  }
                  .json-scroll::-webkit-scrollbar-thumb {
                    background: #bfc6d4;
                    border-radius: 8px;
                  }
                  .json-scroll::-webkit-scrollbar-thumb:hover {
                    background: #9aa3b5;
                  }
                  /* Optional scrollbar buttons (up/down) */
                  .json-scroll::-webkit-scrollbar-button:single-button {
                    height: 10px;
                    background: transparent;
                  }
                `}</style>
                  <div className="bg-light p-3 rounded-3">
                    <pre
                      className="bg-white p-3 rounded json-scroll"
                      style={{ margin: 0 }}
                    >
                      <code
                        style={{
                          display: "block",
                          whiteSpace: "pre",
                          wordBreak: "normal",
                        }}
                      >
                        {JSON.stringify(templates, null, 2)}
                      </code>
                    </pre>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default WhatsAppTemplates;
