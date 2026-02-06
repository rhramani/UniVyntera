// KpiCard.jsx
import { Card } from "react-bootstrap";

const UserDashboardTab = ({ title, value, iconClass, bgClass, textClass }) => {
    return (
        <>
            <Card className="custom-card h-100 border-0 shadow-sm kpi-hover-card">
                <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                        <div
                            className={`${bgClass} rounded-circle d-flex align-items-center justify-content-center me-3`}
                            style={{ width: "50px", height: "50px", minWidth: "50px" }}
                        >
                            <i className={`${iconClass} fs-20 ${textClass}`}></i>
                        </div>

                        <div className="flex-grow-1">
                            <p className="main-content-label mb-1 text-uppercase letter-spacing-1">
                                {title}
                            </p>
                            <div className="d-flex align-items-baseline">
                                <h3 className="text-muted mb-0" style={{ fontSize: "16px" }}>
                                    {value || 0}
                                </h3>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default UserDashboardTab;
