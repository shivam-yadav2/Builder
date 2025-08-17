import React from "react";
import ButtonCustom from "@/utils/ButtonCustom"; // Custom button component
import Layout from "@/layout/Layout"; // Layout component
import FootContact from "@/myComponents/home/FootContact";
import Content from "@/myComponents/about/Content";
import WhoWeAre from "@/myComponents/about/WhoWeAre";
import WhyChooseUs from "@/myComponents/about/WhyChooseUs";
import WhatWeOffer from "@/myComponents/about/WhatWeOffer";
import ContactSection from "@/myComponents/home/ContactSection";

const AboutUs = () => {
  return (
    <Layout>
      <Content />
      {/* SECTION 2*/}
      <WhoWeAre />
      <WhatWeOffer/>
      <WhyChooseUs />
      {/* <FootContact /> */}
      <ContactSection/>

    </Layout>
  );
};

export default AboutUs;
