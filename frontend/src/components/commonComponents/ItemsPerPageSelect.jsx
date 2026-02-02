import Select from "react-select";

const ItemsPerPageSelect = ({
  itemsPerPage,
  onChange,
  options = [5, 10, 15, 20, 30, 50],
}) => {
  const selectOptions = options.map((value) => ({
    value,
    label: `${value} rows`,
  }));

  const selectedOption = selectOptions.find(
    (option) => option.value === itemsPerPage
  );

  return (
    <Select
      classNamePrefix="custom-select"
      value={selectedOption}
      onChange={(selected) => onChange(Number(selected.value))}
      options={selectOptions}
      styles={{
        control: (provided) => ({
          ...provided,
          width: "120px",
        }),
      }}
    />
  );
};

export default ItemsPerPageSelect;