// import {ProgressBar} from "react-bootstrap";

// const ProgressSteps = ({ progressSteps }) => {
//   console.log("progressSteps", progressSteps)
//   const completedSteps = progressSteps?.filter((step) => step.completed).length;
//   const totalSteps = progressSteps?.length;
//   const progressPercentage = (completedSteps / totalSteps) * 100;

//   return (
//     <div className="mb-4 progress-wrapper">
//       <div className="progress-container">
//         {progressSteps?.map((step, index) => (
//           <div key={index} className="progress-step">
//             <div
//               className={`progress-circle ${
//                 step.completed
//                   ? "completed"
//                   : index === completedSteps
//                   ? "active"
//                   : ""
//               }`}
//             >
//               {step.completed ? "✔" : index + 1}
//             </div>
//             <div
//               className={`progress-label ${
//                 step.completed
//                   ? "completed"
//                   : index === completedSteps
//                   ? "active"
//                   : ""
//               }`}
//             >
//               {step.name}
//             </div>
//             {index < totalSteps - 1 && (
//               <div
//                 className={`progress-connector ${
//                   index < completedSteps ? "completed" : ""
//                 }`}
//               ></div>
//             )}
//             {step.completed && step.completedDate && (
//               <div className="progress-date">
//                 {new Date(step.completedDate).toLocaleDateString("en-US", {
//                   year: "numeric",
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* <ProgressBar
//         now={progressPercentage}
//         label={`${Math.round(progressPercentage)}%`}
//         variant="primary"
//         className="custom-progress mt-3"
//       /> */}
//     </div>
//   );
// };

// export default ProgressSteps;
import { ProgressBar } from "react-bootstrap";
import { getOneStudentApplication } from "../../../redux/actions/Student/StudentApplication.action";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import usePermissions from "../../commonComponents/usePermissions";
import { decryptData } from "../../../utils/encryptionUtils";

const ProgressSteps = ({ id }) => {
  const dispatch = useDispatch();
  const userRole = decryptData(localStorage.getItem("role"));
  const personalPermissions = usePermissions("Student Applications", "Personal Details");
  const documentPermissions = usePermissions("Student Applications", "Document");
  const courseSelectionPermissions = usePermissions("Student Applications", "Course Selection");
  const visaApplicationPermissions = usePermissions("Student Applications", "Visa Application");

  const stepOptions = [
    { value: "personal", label: "Personal Details", canShow: userRole === "Super Admin" ? true : personalPermissions.canShow },
    { value: "document", label: "Document", canShow: userRole === "Super Admin" ? true : documentPermissions.canShow },
    { value: "courseSelection", label: "Course Selection", canShow: userRole === "Super Admin" ? true : courseSelectionPermissions.canShow },
    { value: "visaApplication", label: "Visa Application", canShow: userRole === "Super Admin" ? true : visaApplicationPermissions.canShow },
  ];

  const [submittedTabs, setSubmittedTabs] = useState([]);
  
  const visibleSteps = stepOptions?.filter((step) => step.canShow);
  const totalSteps = visibleSteps.length;

  const fetchStudentDetailsProgress = async () => {
    try {
      const res = await dispatch(getOneStudentApplication(id));
      setSubmittedTabs(res?.data?.data?.submittedTabs || []);
    } catch (error) {
      console.log("Error fetching student details:", error);
    }
  };

  useEffect(() => {
    fetchStudentDetailsProgress();
  }, [id]);

  const completedSteps = visibleSteps?.filter((step) => submittedTabs?.includes(step.value)).length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="mb-4 progress-wrapper">
      <div className="progress-container">
        {visibleSteps?.map((step, index) => {
          const isCompleted = submittedTabs?.includes(step.value);
          const isActive = !isCompleted && index === completedSteps;

          return (
            <div key={index} className="progress-step">
              <div
                className={`progress-circle ${
                  isCompleted ? "completed" : isActive ? "active" : ""
                }`}
              >
                {isCompleted ? "✔" : index + 1}
              </div>
              <div
                className={`progress-label ${
                  isCompleted ? "completed" : isActive ? "active" : ""
                }`}
              >
                {step.label}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`progress-connector ${
                    index < completedSteps ? "completed" : ""
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      <ProgressBar
        now={progressPercentage}
        label={`${Math?.round(progressPercentage)}%`}
        variant="primary"
        className="custom-progress mt-3"
      />
    </div>
  );
};

export default ProgressSteps;