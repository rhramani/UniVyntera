import { ProgressBar, Badge } from 'react-bootstrap';
import { FaCheckCircle, FaCircle, FaDotCircle } from 'react-icons/fa';

const ApplicationTracker = ({ activeTab, submittedTabs = [], userRole }) => {
  const tabs = [
    { id: 'personal', label: 'Personal Details', order: 1 },
    { id: 'document', label: 'Documents', order: 2 },
    { id: 'courseSelection', label: 'Course Selection', order: 3 },
    { id: 'visaApplication', label: 'Visa Application', order: 4 },
    { id: 'personal', label: 'Personal Details', order: 1 },
    { id: 'document', label: 'Documents', order: 2 },
    { id: 'courseSelection', label: 'Course Selection', order: 3 },
    { id: 'visaApplication', label: 'Visa Application', order: 4 },
    { id: 'personal', label: 'Personal Details', order: 1 },
    { id: 'document', label: 'Documents', order: 2 },
    { id: 'courseSelection', label: 'Course Selection', order: 3 },
    { id: 'visaApplication', label: 'Visa Application', order: 4 },
    { id: 'personal', label: 'Personal Details', order: 1 },
    { id: 'document', label: 'Documents', order: 2 },
    { id: 'courseSelection', label: 'Course Selection', order: 3 },
    { id: 'visaApplication', label: 'Visa Application', order: 4 },
    { id: 'personal', label: 'Personal Details', order: 1 },
    { id: 'document', label: 'Documents', order: 2 },
    { id: 'courseSelection', label: 'Course Selection', order: 3 },
    { id: 'visaApplication', label: 'Visa Application', order: 4 },
    { id: 'personal', label: 'Personal Details', order: 1 },
    { id: 'document', label: 'Documents', order: 2 },
    { id: 'courseSelection', label: 'Course Selection', order: 3 },
    { id: 'visaApplication', label: 'Visa Application', order: 4 },
    // Add more steps as needed, e.g., for 60-70 steps
    // { id: 'step5', label: 'Step 5', order: 5 },
    // ...
  ];

  const getStatus = (tabId) => {
    if (submittedTabs.includes(tabId)) return 'Submitted';
    if (activeTab === tabId) return 'In Progress';
    return 'Not Started';
  };

  const getProgress = () => {
    const completedTabs = tabs.filter((tab) => submittedTabs.includes(tab.id)).length;
    return (completedTabs / tabs.length) * 100;
  };

  return (
    <div style={{
      marginTop: '50px',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '30px',
      maxHeight: '600px', // Adjustable for 60-70 steps
      maxWidth: '500px',
      overflowY: 'auto',
      scrollbarWidth: 'thin', // For Firefox
    }}>
      <h5 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>
        Application Progress
      </h5>
      <ProgressBar
        now={getProgress()}
        style={{
          height: '10px',
          marginBottom: '20px',
          backgroundColor: '#e0e0e0',
        }}
        className="custom-progress-bar"
      />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        paddingLeft: '30px',
      }}>
        {tabs.map((tab, index) => {
          const status = getStatus(tab.id);
          const isActive = activeTab === tab.id;
          const isCompleted = status === 'true';

          return (
            <div
              key={tab.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                position: 'relative',
              }}
            >
              {/* Connecting Line */}
              {index < tabs.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: '11px',
                    top: '24px',
                    width: '2px',
                    height: 'calc(100% + 20px)',
                    backgroundColor: '#e0e0e0',
                    zIndex: 1,
                  }}
                />
              )}
              {/* Step Icon */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                  backgroundColor: '#f8f9fa',
                }}
              >
                {isCompleted ? (
                  <FaCheckCircle size={24} style={{ color: '#28a745' }} />
                ) : isActive ? (
                  <FaDotCircle size={24} style={{ color: '#007bff' }} />
                ) : (
                  <FaCircle size={24} style={{ color: '#6c757d' }} />
                )}
              </div>
              {/* Step Content */}
              <div className='d-flex align-items-center gap-3' style={{ marginTop: '5px',marginLeft: '15px', flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                }}>
                  {tab.label}
                </div>
                <Badge
                  bg={
                    status === 'Submitted'
                      ? 'success'
                      : status === 'In Progress'
                      ? 'primary'
                      : 'secondary'
                  }
                  style={{
                    // marginTop: '5px',
                    fontSize: '12px',
                    padding: '5px 10px',
                  }}
                >
                  {status}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTracker;