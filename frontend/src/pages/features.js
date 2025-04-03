// import React from "react";

// const features = [
//   { title: "Feature 1", description: "Description of feature 1." },
//   { title: "Feature 2", description: "Description of feature 2." },
//   { title: "Feature 3", description: "Description of feature 3." },
// ];

// const Features = () => {
//   return (
//     <section className="py-16 bg-primary">
//       <h2 className="text-3xl font-bold text-center text-gray-900">Our Features</h2>
//       <div className="grid md:grid-cols-3 gap-8 mt-8 px-6">
//         {features.map((feature, index) => (
//           <div key={index} className="p-6 bg-gray-100 rounded-lg shadow-md text-center">
//             <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
//             <p className="text-gray-600 mt-2">{feature.description}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Features;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// import { ScrollContainer, ScrollPage } from "react-scroll-motion";

const featureData = [
  {
    title: "Expense Tracking",
    description: "Monitor your spending with real-time insights.",
    image: "/images/bars.png",
  },
  {
    title: "Retirement Planning",
    description: "Plan ahead and secure your financial future.",
    image: "/images/retirement.png",
  },
  {
    title: "Financial Advice",
    description: "Expert guidance for smarter financial decisions.",
    image: "/images/expense-tracking.png",
  },
  {
    title: "Emergency Fund",
    description: "Prepare for unexpected expenses with ease.",
    image: "/images/money_grow.png",
  },
  {
    title: "Goal Setting",
    description: "Set and achieve your financial milestones.",
    image: "/images/Signup.png",
  },
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const Features = () => {
  const [index, setIndex] = useState(0);
  const visibleFeatures = featureData.slice(index, index + 3); // Show 3 at a time

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prevIndex) =>
        prevIndex + 3 >= featureData.length ? 0 : prevIndex + 1
      );
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearTimeout(timer); // Clear timer on unmount or button click
  }, [index]);

  const nextFeature = () => {
    if (index < featureData.length - 3) {
      setIndex(index + 1);
    }
  };
  

  const prevFeature = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <section className="py-16 bg-primary text-white text-center">
      <h2 className="text-3xl font-bold mb-6">Smart Financial Features</h2>

      <div className="relative flex items-center justify-center px-6 md:px-12">
      {index > 0 && (
  <button
    onClick={prevFeature}
    className="absolute top-[45%] -translate-y-1/2 left-2 md:left-4
               bg-primary text-white p-5 md:p-6 rounded-full shadow-lg 
               border-2 border-white border-opacity-50 hover:bg-opacity-80 
               text-2xl md:text-3xl transition-all duration-300"
  >
    ❮
  </button>
)}

        {/* Feature Cards */}
        <div className="flex space-x-6 overflow-hidden">
          {visibleFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              className="min-w-[280px] md:min-w-[320px] bg-white text-gray-900 p-6 rounded-xl shadow-lg"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-40 object-contain rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {index < featureData.length - 3 && (
  <button
    onClick={nextFeature}
    className="absolute top-[45%] -translate-y-1/2 right-2 md:right-4
               bg-primary text-white p-5 md:p-6 rounded-full shadow-lg 
               border-2 border-white border-opacity-50 hover:bg-opacity-80 
               text-2xl md:text-3xl transition-all duration-300"
  >
    ❯
  </button>
)}
      </div>
    </section>
  );
};

export default Features;