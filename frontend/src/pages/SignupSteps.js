

// import React from 'react';

// const SignupSteps = () => {
//   const steps = [
//     { icon: '✏️', text: 'Enter Details' },
//     { icon: '👤', text: 'Create Account' },
//     { icon: '👍', text: 'Enjoy plans' },
//   ];

//   return (
//     <div className="text-center bg-orange-500 py-8">
//       <h2 className="text-white text-2xl font-bold mb-8">Easy Sign Up in just 3 steps</h2>
//       <div className="flex justify-center items-center space-x-8">
//         {steps.map((step, index) => (
//           <div key={index} className="relative flex flex-col items-center">
//             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl text-orange-500">
//               {step.icon}
//             </div>
//             <p className="text-white mt-2">{step.text}</p>
//             {index < steps.length - 1 && (
//               <div className="absolute top-1/2 left-full w-24 h-0.5 bg-white transform -translate-y-1/2"></div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SignupSteps;
import React from 'react';

const SignupSteps = () => {
  const steps = [
    { icon: '/images/Enter.png', text: 'Enter Details' },
    { icon: '/images/acount.png', text: 'Create Account' },
    { icon: '/images/Enjoyy.png', text: 'Enjoy plans' },
  ];

  return (
    <div className="bg-orange-500 py-8 px-12">
      <h2 className="text-white text-2xl font-bold mb-8">Easy Sign Up in just 3 steps</h2>
      <div className="grid grid-cols-3 items-center">
        {steps.map((step, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <img src={step.icon} alt={step.text} className="w-10 h-10" />
            </div>
            <p className="text-white mt-2">{step.text}</p>
            {index < steps.length - 1 && (
              <div className="absolute top-1/2 left-full w-24 h-0.5 bg-white transform -translate-y-1/2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignupSteps;
