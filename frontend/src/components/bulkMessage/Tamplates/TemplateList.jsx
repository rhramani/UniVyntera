import TemplateCard from "./TemplateCard";
import { Modal, Button } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import DeleteConfirmModal from "../commonDeleteModal/DeleteConfirmModal";

const TemplateList = ({
  templates,
  isOpen,
  setIsOpen,
  confirmDelete,
  handleConfirmDelete,
  showDelete = true,
  showRadio = true,
  selectedTemplate,
  onTemplateSelect,
}) => {
  return (
    <>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {templates?.map((template, index) => (
          <div key={index} className="col">
            <TemplateCard
              template={template}
              onDelete={() => confirmDelete(template.name)}
              showDelete={showDelete}
              showRadio={showRadio}
              radioValue={template.name}
              selectedValue={selectedTemplate?.name}
              onRadioChange={() => onTemplateSelect(template)}
              isSelected={selectedTemplate?.name === template.name}
            />
          </div>
        ))}
      </div>

      {isOpen && (
        <DeleteConfirmModal
          show={isOpen}
          onHide={() => setIsOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default TemplateList;
