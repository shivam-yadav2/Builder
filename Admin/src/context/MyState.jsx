import React, { useEffect, useState } from "react";
import MyContext from "./MyContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const MyState = ({ children }) => {
  const [categoryCourse, setCategoryCourse] = useState([]);

  const getCategoryCourse = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://adminfashioncadamy.traficoanalytica.com/api/v1/category/get-category",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setCategoryCourse(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://adminfashioncadamy.traficoanalytica.com/api/v1/course/get-course",
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .request(config)
      .then((response) => {
        //console.log(response?.data?.data);
        setCourses(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to update course
  const updateCourse = async (courseData) => {
    const toastId = toast.loading("Updating Course...");

    const config = {
      method: "post",
      url: "https://adminfashioncadamy.traficoanalytica.com/api/v1/course/update-course",
      headers: {
        "Content-Type": "application/json",
      },
      data: courseData, // send the updated data
    };

    try {
      const response = await axios.request(config);
      toast.success("Course updated successfully", { id: toastId });
      await getCourses(); // Refresh courses data
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  useEffect(() => {
    getCategoryCourse();
    getCourses();
  }, []);


  

  return (
    <MyContext.Provider
      value={{ categoryCourse, courses, getCourses, getCategoryCourse, updateCourse }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default MyState;
