// import React from "react";

// const testimonials = [
//   { name: "User 1", feedback: "This platform changed my life!" },
//   { name: "User 2", feedback: "Highly recommend to everyone!" },
//   { name: "User 3", feedback: "Amazing experience, 10/10!" },
// ];

// const Testimonials = () => {
//   return (
//     <section className="py-16 bg-gray-50">
//       <h2 className="text-3xl font-bold text-center text-gray-900">What Our Users Say</h2>
//       <div className="flex flex-wrap justify-center gap-8 mt-8 px-6">
//         {testimonials.map((testimonial, index) => (
//           <div key={index} className="p-6 bg-white rounded-lg shadow-lg text-center max-w-sm">
//             <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
//             <h3 className="mt-4 text-lg font-semibold text-gray-800">- {testimonial.name}</h3>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Testimonials;
import React from "react";

const testimonials = [
  {
    name: "Yousaf Zahid",
    feedback: "This platform changed my life! I finally got my finances on track.",
    image: "/images/yousaf.jpeg",
    rating: 5,
  },
  {
    name: "Faiqa Malik",
    feedback: "Highly recommend to everyone! The features are outstanding.",
    image: "/images/Faiqa.jpeg",
    rating: 4,
  },
  {
    name: "Fahad Ashfaq",
    feedback: "Amazing experience, 10/10! It made financial planning so easy.",
    image: "/images/Fahad.png",
    rating: 5,
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="flex justify-center mt-2">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"}>
          ★
        </span>
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-300">
      <h2 className="text-3xl font-bold text-center text-gray-900">What Our Users Say</h2>
      <div className="flex flex-wrap justify-center gap-8 mt-8 px-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="p-6 bg-background rounded-xl shadow-lg text-center max-w-xs transition-transform transform hover:scale-105">
            {/* User Image */}
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-20 h-20 object-cover rounded-full mx-auto border-4 border-primary"
            />

            {/* Star Rating */}
            <StarRating rating={testimonial.rating} />

            {/* Feedback */}
            <p className="text-gray-700 italic mt-3">"{testimonial.feedback}"</p>

            {/* Name */}
            <h3 className="mt-4 text-lg font-semibold text-gray-800">- {testimonial.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
