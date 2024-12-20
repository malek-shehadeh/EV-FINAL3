
//////////////
import bg from "../../assets/download (1).png";
import Wave from "./Wave";
import Intro from "./Intro";
import React from "react";

const Hero = ({ darkMode }) => {
  return (
    <div className="relative h-[800px] overflow-hidden bg-slate-800 dark:bg-slate-500 dark:text-slate-400 md:p-16 p-5">
      <div className="absolute inset-0 inset-y-3 flex justify-end items-center animate-slideLeft">
        <img src={bg} alt="bg-image" className="object-cover" />
      </div>
      <Intro />
      <Wave darkMode={darkMode} />
    </div>
  );
};

// Define the animation keyframes
const style = document.createElement("style");
style.textContent = `
  @keyframes slideLeft {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .animate-slideLeft {
    animation: slideLeft 1.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default Hero;
