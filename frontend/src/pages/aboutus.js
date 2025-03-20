import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  const fadeInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="py-20 bg-gray-300 text-gray-900">
      {/* About Fiscal */}
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 px-6">
        <motion.div 
          className="md:w-1/2"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-4">Empowering Your Financial Journey</h2>
          <p className="text-lg">
            At <span className="font-semibold text-primary">Fiscal</span>, we believe financial well-being should be accessible to everyone.
            Our mission is to simplify personal finance with intuitive tools that empower you to take control of your financial future.
          </p>
        </motion.div>

        <motion.div 
          className="md:w-1/2"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img src="./images/AboutFirst.png" alt="About Fiscal" className="rounded-lg " />
        </motion.div>
      </div>

      {/* Our Mission */}
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12 px-6 mt-16">
        <motion.div 
          className="md:w-1/2 order-2 md:order-1"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img src="./images/aboutee.png" alt="Our Mission" className="rounded-lg " />
        </motion.div>

        <motion.div 
          className="md:w-1/2 order-1 md:order-2"
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg">
            Our goal is to make financial planning effortless. Whether it's **tracking expenses, setting goals, or making data-driven decisions**, Fiscal helps you every step of the way.
          </p>
        </motion.div>
      </div>

   {/* Why Choose Fiscal */}
<div className="container mx-auto flex flex-col md:flex-row items-center gap-12 px-8 mt-16">
  {/* Left Side - Text Section */}
  <motion.div 
    className="md:w-1/2 flex flex-col items-center text-center"
    variants={fadeInLeft}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
  >
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold mb-4">Why Choose Fiscal?</h2>
      <ul className="text-lg list-none space-y-2 ml-14">
        <li className="flex items-center gap-3">
          <span className="w-[24px] flex justify-center">🚀</span> <strong>AI-Powered Insights</strong>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-[24px] flex justify-center">🎯</span> <strong>User-Friendly Interface</strong>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-[24px] flex justify-center">🔒</span> <strong>Secure & Private Website</strong>
        </li>
        <li className="flex items-center gap-3">
          <span className="w-[24px] flex justify-center">💡</span> <strong>Financial Freedom Simplified</strong>
        </li>
      </ul>
    </div>
  </motion.div>

  {/* Right Side - Image Section */}
  <motion.div 
    className="md:w-1/2 flex justify-center"
    variants={fadeInRight}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
  >
    <img src="./images/a3.webp" alt="Why Choose Fiscal" className="rounded-lg max-w-sm" />
  </motion.div>
</div>


    </section>
  );
};

export default AboutUs;
