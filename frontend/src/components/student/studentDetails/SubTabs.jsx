import { Button } from "react-bootstrap";

const Subtabs = ({ activeSubtab, setActiveSubtab, subtabs }) => (
  <div className="d-flex gap-2 mb-4">
    {subtabs.map((subtab) => (
      <Button
        key={subtab.id}
        variant={activeSubtab === subtab.id ? "primary" : "outline-primary"}
        className="custom-select-height"
        onClick={() => setActiveSubtab(subtab.id)}
      >
        {subtab.label}
      </Button>
    ))}
  </div>
);

export default Subtabs;