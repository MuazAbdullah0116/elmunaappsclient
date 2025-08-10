import React from "react";

interface IslamicLogoProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const IslamicLogo: React.FC<IslamicLogoProps> = ({ size = "md", animated = false }) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${animated ? "animate-pulse" : ""}`}>
      <img
        src="ico.png"
        alt="Islamic Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default IslamicLogo;
