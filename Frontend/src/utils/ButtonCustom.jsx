import { MoveRight } from "lucide-react";
import React from "react";

const ButtonCustom = ({ title, onClick, theme }) => {
  return (
    <>
      <div
        onClick={onClick}
        className={`flex ${theme == "white" ? "text-[#001324]" : "text-white"} w-fit font-semibold items-center gap-3 cursor-pointer px-5 py-2 rounded-3xl ${theme == "white" ? "bg-white" : "bg-[#004e2e]"} `}
      >
        {" "}
        <p> {title} </p>
        <p>
          <MoveRight />
        </p>
      </div>
    </>
  );
};

export default ButtonCustom;
