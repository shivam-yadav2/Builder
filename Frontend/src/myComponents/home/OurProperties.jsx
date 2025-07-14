import ButtonCustom from "@/utils/ButtonCustom";
import TextContentCard from "@/utils/TextContentCard";
import React from "react";
import { useNavigate } from "react-router-dom";

const OurProperties = () => {
   const navigate = useNavigate()
  return (
    <section className="container  mx-auto mt-[90px]">
      <div className="grid grid-cols-6 gap-7 p-1">
        <div className="lg:col-span-4 col-span-6 lg:p-6 bg-[#ececec] rounded-xl shadow-lg flex flex-col justify-between">
          <div className="p-5  flex flex-col gap-5 lg:gap-12  h-full">
            <div className="flex flex-col gap-2 justify-between items-start">
              <h1 className="text-2xl lg:text-4xl font-semibold ">
                Explore Our Featured Properties and Projects
              </h1>
              <p className="text-sm lg:text-lg font-semibold text-gray-700 lg:mt-6 capitalize lg:w-4/5 mt-2">
                Discover the properties and projects that showcase Rsusb2sbuilders Foundation’s commitment to excellence. From luxurious residential homes to thriving commercial spaces, and even custom civil construction projects, we help clients achieve their dreams with unmatched dedication and expertise.
              </p>
            </div>
            <div className="mt-5">
              <ButtonCustom
                title={"Get In Touch"}
                onClick={() => navigate('/contact')}
              />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 col-span-6 mx-5 md:mx-0">
          <TextContentCard src="assets/img/image6.png" title="Green Valey" des="Austin, Texas" />
        </div>

        <div className="lg:col-span-2 col-span-3 ml-5 md:ml-0">
          <TextContentCard src="assets/img/image6.png" title="Green Valey" des="Austin, Texas" />
        </div>

        <div className="lg:col-span-2 col-span-3 mr-5 md:mr-0">
          <TextContentCard src="assets/img/image6.png" title="Green Valey" des="Austin, Texas" />
        </div>

        <div className="lg:col-span-2 col-span-6 mx-5 md:mx-0">
          <TextContentCard src="assets/img/image6.png" title="Green Valey" des="Austin, Texas" />
        </div>
      </div>
    </section>
  );
};

export default OurProperties;
