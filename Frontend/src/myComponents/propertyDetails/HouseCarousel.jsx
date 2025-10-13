import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Adjust the path based on your setup

const HouseCarousel = ({ property }) => {

  const imageArr = property?.images
  //console.log(imageArr  )
  const houses = [
    "/assets/img/bg_banner.png", // Replace with house2.jpg
    "/assets/img/bg_banner.png", // Replace with house1.jpg
  ];

  return (
    <div className=" w-full p-5  md:py-8 px-0">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {imageArr?.map((image, index) => (
            <CarouselItem
              key={index}
              className="pl-2 basis-1/1"
            >
              <div>
                <img
                  src={`https://backend.rsusb2sbuildersconstructions.com/${image}`}
                  alt={`House ${index + 1}`}
                  className="w-full h-[30vh] md:h-[40vh] lg:h-[75vh] object-fill  rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2" />
      </Carousel>
    </div>
  );
};

export default HouseCarousel;