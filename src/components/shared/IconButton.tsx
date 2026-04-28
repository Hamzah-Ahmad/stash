import React, { type JSX } from "react";

const IconButton = ({
  icon: Icon,
  onClick,
  className = "",
}: {
  icon: () => JSX.Element;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-transparent ${className} cursor-pointer`}
    >
      <Icon />
    </button>
  );
};

export default IconButton;
