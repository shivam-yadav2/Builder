import ButtonCustom from "@/utils/ButtonCustom";
import React from "react";

const FootContact = () => {
  return (
    // <div className='bg-[#F2FAFF]'>
    //     <section className="container mx-auto py-5 lg:py-10 ">
    //         <div className='relative rounded-3xl overflow-hidden mx-3 '>
    //             <img src="/assets/img/image7.png" alt="" />
    //             <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-center items-center gap-4 md:gap-8" style={{
    //                 background:
    //                     "linear-gradient(180deg, rgba(2,0,36,0) 0%, rgba(0,0,0,0.22172619047619047) 61%, rgba(0,0,0,0.5662640056022409) 100%)",
    //             }}>
    //                 <h1 className='text-white text-center md:text-4xl text-xl font-semibold'>
    //                     Discover Properties That Match Your <span className='inline md:block'>Lifestyle!</span>
    //                 </h1>
    //                 <ButtonCustom title="Contact Us" theme="white" />
    //             </div>
    //         </div>
    //     </section>
    // </div>

    <div className="bg-[#F2FAFF]">
      <section className="container mx-auto py-5 lg:py-10 px-4 sm:px-6 md:px-8">
        <div className="relative rounded-3xl overflow-hidden mx-auto max-w-5xl">
          <img
            src="/assets/img/image7.png"
            alt=""
            className="w-full h-auto object-cover"
          />
          <div
            className="absolute inset-0 flex flex-col justify-center items-center gap-4 md:gap-8 p-4 sm:p-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(2,0,36,0) 0%, rgba(0,0,0,0.22) 61%, rgba(0,0,0,0.56) 100%)",
            }}
          >
            <h1 className="text-white text-center text-lg sm:text-xl md:text-3xl lg:text-4xl font-semibold leading-tight">
              Discover Properties That Match Your{" "}
              <span className="inline md:block">Lifestyle!</span>
            </h1>
            <ButtonCustom title="Contact Us" theme="white" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default FootContact;
