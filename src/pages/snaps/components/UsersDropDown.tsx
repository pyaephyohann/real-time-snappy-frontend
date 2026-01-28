import { useState } from "react";

interface Option {
  id: number;
  name: string;
}

interface Props {
  options: Option[];
  placeholder?: string;
  onSelect: (id: number) => void;
}

const UsersDropDown: React.FC<Props> = ({
  options,
  placeholder = "Select an option",
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect(option.id);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selected ? selected.name : placeholder}
      </button>

      {/* Dropdown */}
      {open && (
        <ul className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.id}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-blue-50"
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersDropDown;
