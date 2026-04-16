import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4 px-2">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
        <div 
            className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center group">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              index < currentStep 
                ? "bg-blue-600 border-blue-600 text-white" 
                : index === currentStep 
                    ? "bg-slate-950 border-blue-600 text-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)] scale-110" 
                    : "bg-slate-950 border-slate-700 text-slate-500"
            )}>
              {index < currentStep ? (
                <Check className="w-6 h-6 animate-in zoom-in duration-300" />
              ) : (
                <span className="font-bold">{index + 1}</span>
              )}
            </div>
            <span className={cn(
              "absolute -bottom-8 whitespace-nowrap text-xs font-semibold uppercase tracking-widest transition-colors duration-300",
              index <= currentStep ? "text-blue-500" : "text-slate-600"
            )}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
