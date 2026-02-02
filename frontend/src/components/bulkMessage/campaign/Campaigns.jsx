import { useEffect, useState } from "react";
import {
  Table,
  Button,
  OverlayTrigger,
  Tooltip,
  Row,
  Col,
  Card,
  Popover,
} from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FiUsers, FiSend, FiAlertTriangle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCampaign } from "../../../redux/actions/BulkMessage/Compaign.action";
import Pageheader from "../../../layouts/Pageheader";

const Campaigns = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [campaignList, setCampaignList] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchAllCompaigns = async () => {
    try {
      setLoader(true);
      const response = await dispatch(getCampaign());
      setCampaignList(response?.data?.result?.data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchAllCompaigns();
  }, []);

  const truncateText = (text, length = 40) =>
    text.length > length ? text.slice(0, length) + "..." : text;

  return (
    <>
      {loader && (
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

      <div className="min-vh-100 bg-light pb-5 position-relative">
        <Pageheader
          mainheading="Campaigns"
          parentfolder="WA Daddy"
          activepage="Campaigns"
        />
        <Row className="mt-5 row-sm">
          <Col md={12} lg={12} xl={12}>
            <Card className="custom-card transcation-crypto">
              <Card.Header className="border-bottom-0 mt-2">
                <div className="w-100 d-flex flex-wrap justify-content-between align-items-center">
                  <div className="card-title">Campaigns</div>
                  <Button
                    variant="primary"
                    className="custom-btn custom-select-height px-3"
                    onClick={() => navigate("/campaigns/create-campaign")}
                  >
                    + Create New Campaign
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table className="text-nowrap border">
                    <thead>
                      <tr>
                        <th>Campaign Name</th>
                        <th>Created Date</th>
                        <th>Status</th>
                        <th>Contacts</th>
                        <th>Created By</th>
                        <th>Sent</th>
                        <th>Failed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignList?.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center text-muted">
                            No campaigns available.
                          </td>
                        </tr>
                      ) : (
                        campaignList?.map((campaign, index) => {
                          const bodyText = Array.isArray(campaign.message)
                            ? campaign.message?.find((m) => m.type === "BODY")
                                ?.text
                            : null;

                          return (
                            <tr key={index}>
                              <td>
                                <strong
                                  style={{
                                    color:
                                      index % 2 === 0
                                        ? "#2ecc71"
                                        : index % 3 === 0
                                        ? "#9b59b6"
                                        : "#333",
                                  }}
                                >
                                  {campaign?.name}
                                </strong>

                                {bodyText ? (
                                  <OverlayTrigger
                                    trigger={["hover", "focus"]}
                                    placement="top"
                                    overlay={
                                      <Popover
                                        id={`popover-${index}`}
                                        style={{ maxWidth: "300px" }}
                                      >
                                        <Popover.Body
                                          style={{
                                            whiteSpace: "pre-wrap",
                                            fontSize: "0.9rem",
                                          }}
                                        >
                                          {bodyText}
                                        </Popover.Body>
                                      </Popover>
                                    }
                                  >
                                    <p
                                      className="text-primary mb-1"
                                      style={{
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      {truncateText(bodyText)}
                                    </p>
                                  </OverlayTrigger>
                                ) : (
                                  <p className="text-muted mb-1 fw-bold">
                                    No message
                                  </p>
                                )}
                                {campaign?.description && (
                                  <small className="text-secondary">
                                    {campaign?.description}
                                  </small>
                                )}
                              </td>
                              <td>
                                {campaign.createdAt
                                  ? new Date(campaign.createdAt).toLocaleString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                      }
                                    )
                                  : ""}
                              </td>
                              <td>
                                <span
                                  className="d-flex align-items-center gap-1"
                                  style={{
                                    color:
                                      campaign?.status === "failed"
                                        ? "#e74c3c"
                                        : "#2ecc71",
                                  }}
                                >
                                  {campaign?.status === "failed" ? (
                                    <FaTimesCircle />
                                  ) : (
                                    <FaCheckCircle />
                                  )}
                                  {campaign?.status || "N/A"}
                                </span>
                              </td>
                              <td className="text-muted">
                                <FiUsers />{" "}
                                {campaign.contactGroup?.length || "0"}
                              </td>
                              <td>{campaign?.createdByName || "N/A"}</td>
                              <td className="text-muted">
                                <FiSend /> {campaign?.sentCount || "0"}
                              </td>
                              <td className="text-danger">
                                <FiAlertTriangle />{" "}
                                {campaign?.failedCount || "0"} Failed
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                </div>
                {/* {campaignList?.length > 0 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Button
                      variant="primary"
                      className="custom-select-height"
                    >
                      View All
                    </Button>
                  </div>
                )} */}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Campaigns;
