import React from "react";

const HeroSection = () => {
  return (
    <section className="h-screen flex flex-col md:flex-row items-center justify-center text-center md:text-left bg-white px-12 md:px-20 ">
      {/* Left Side (Text Content) */}
      <div className="md:w-1/2 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">Get your Finances under Control With Fiscal </h1>
        <p className="text-lg text-gray-600 mt-0 ">

        Smarter way to manage finances 
        </p>
        
        <div className="mt-3">
        <button className="bg-primary text-white text-lg px-14 py-4 rounded-xl hover:bg-orange-600 transition duration-300 shadow-[0_4px_10px_rgba(255,165,0,0.4)]">
  Get Started
</button>







        </div>
      </div>

      {/* Right Side (Image) */}
      <div className="md:w-1/2 flex justify-center mt-8 md:mt-0">
        <img
          src="/images/hero.png" // Change this to your image path
          alt="Hero"
          className="max-w-xs md:max-w-md"
        />
      </div>
    </section>
  );
};

export default HeroSection;
