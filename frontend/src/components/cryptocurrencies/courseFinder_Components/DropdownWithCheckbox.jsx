import { useState } from "react";
import { Form, Dropdown } from "react-bootstrap";

const DropdownWithCheckbox = ({
  label,
  items,
  selectedItems,
  onSelect,
  placeholder,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleItemClick = (item) => {
    onSelect(item);
  };

  return (
    <Form.Group >
      <Form.Label>{label}</Form.Label>
      <Dropdown
        show={showDropdown}
        onToggle={(isOpen) => setShowDropdown(isOpen)}
      >
        <Dropdown.Toggle
          className="month-dropdown-toggle custom-select-height w-100 text-start d-flex justify-content-between align-items-center"
          style={{ height: "auto", overflow: "hidden" }}
        >
          {selectedItems.length > 0 ? selectedItems.join(", ") : placeholder}
        </Dropdown.Toggle>

        <Dropdown.Menu className="month-dropdown-menu w-100">
          {items.map((item) => (
            <div key={item} onClick={() => handleItemClick(item)}>
              <Form.Check
                type="checkbox"
                id={`checkbox-${item}`}
                label={item}
                checked={selectedItems.includes(item)}
                onChange={() => handleItemClick(item)}
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: "none" }}
              />
            </div>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </Form.Group>
  );
};

export default DropdownWithCheckbox;