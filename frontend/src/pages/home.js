import React from "react";
//import AuthButtons from "../components/authentication/AuthButtons"; 
//import { useNavigate } from "react-router-dom";
import Navbar from "./navbarhome";
import HeroSection from "./herosection";
import Features from "./features";
import Testimonials from "./testimonial";
import CTA from "./cta"
import Footer from "./footer";
import AboutUs from "./aboutus";
import SignupSteps from "./SignupSteps";
const Home = () => {
  // const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <Navbar />
      <HeroSection />
      <AboutUs />
      <Features />
      <Testimonials /> 
      <SignupSteps />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
