import { getDropMenuSelection } from "./DropMenuDialog";

export interface DropMenuButtonProps {
  icon: string;
  options: { color?: string; icon: string; text: string; value: string }[];
  onSelect: (optionSelected: string) => void;
}

export default function DropMenuButton({
  icon,
  options,
  onSelect,
}: DropMenuButtonProps) {
  const handleClick = () => {
    getDropMenuSelection(options).then((o) => {
      if (o) onSelect(o);
    });
  };

  return (
    <button
      className="material-symbols-rounded icon-button"
      onClick={handleClick}
    >
      {icon}
    </button>
  );
}
