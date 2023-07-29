import React from "react";
import stc from "string-to-color";

export type IconProps = {
  icon: string;
};

const Icon: React.FC<IconProps> = ({ icon }) => {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/icons/filled/${icon}`}
      alt={icon}
      className="w-18 h-18 px-2"
      draggable="false"
    />
  );
};

export default Icon;
