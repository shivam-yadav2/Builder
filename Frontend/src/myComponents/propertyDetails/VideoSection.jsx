import React from "react";

const videoData = {
  url: ""
};
export default function VideoSection({video}) {
  return (
    <>
    <div className=" my-6 border border-gray-200 rounded-xl">
      <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl pb-4 font-semibold">Video</h1>
        <video
          className="w-full rounded-2xl"
          controls
          autoPlay
        //   muted
        //   loop
        >
          <source src={videoData.url}  />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
    </>
  );
}
