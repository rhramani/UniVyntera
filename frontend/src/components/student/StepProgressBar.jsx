import PropTypes from 'prop-types';

const StepProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Enrollment', icon: '📝' },
    { id: 2, name: 'Counselling', icon: '👩‍🏫' },
    { id: 3, name: 'Application', icon: '📄' },
    { id: 4, name: 'Admission', icon: '🎓' },
    { id: 5, name: 'Visa', icon: '✈️' },
  ];

  return (
    <div className="step-progress-container d-flex align-items-center justify-content-between my-4">
      {steps.map((step, index) => (
        <div key={step.id} className="step-item text-center position-relative">
          {/* Step Circle */}
          <div
            className={`step-circle d-flex align-items-center justify-content-center rounded-circle mx-auto ${
              currentStep >= step.id ? 'active' : ''
            }`}
          >
            <span className="step-icon">{step.icon}</span>
          </div>
          {/* Step Label */}
          <span
            className={`d-block mt-2 small ${
              currentStep >= step.id ? 'text-primary' : 'text-muted'
            }`}
          >
            {step.name}
          </span>
          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={`step-connector position-absolute ${
                currentStep > step.id ? 'bg-primary' : 'bg-secondary'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

StepProgressBar.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default StepProgressBar;