'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  maxCompletedStep: number;
  onStepClick: (step: number) => void;
}

const STEPS = [
  { step: 1, label: '1. Register RWA' },
  { step: 2, label: '2. Stealth Address' },
  { step: 3, label: '3. Transfer Asset' },
  { step: 4, label: '4. ZK Proof' },
];

export default function Stepper({ currentStep, maxCompletedStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Protocol Progress Steps" className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
      {STEPS.map((item) => {
        const isActive = currentStep === item.step;
        const isCompleted = item.step < currentStep || item.step <= maxCompletedStep;
        const isClickable = item.step <= maxCompletedStep + 1;

        return (
          <button
            key={item.step}
            type="button"
            onClick={() => {
              if (isClickable) {
                onStepClick(item.step);
              }
            }}
            disabled={!isClickable}
            className={cn(
              "flex items-center gap-2.5 px-3.5 py-3 border-2 border-black font-bold text-xs uppercase tracking-wider text-left transition-all",
              isActive && "bg-[#FFDD00] text-black shadow-[4px_4px_0px_#0A0A0A] translate-x-[-2px] translate-y-[-2px]",
              !isActive && isCompleted && "bg-white text-black shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_#0A0A0A] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer",
              !isActive && !isCompleted && isClickable && "bg-[#E8E8E3] text-black hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[3px_3px_0px_#0A0A0A] cursor-pointer",
              !isClickable && "bg-[#E8E8E3]/60 text-muted-foreground opacity-50 cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                "size-6 flex items-center justify-center border-2 border-black text-xs font-[900] shrink-0",
                isActive ? "bg-black text-[#FFDD00]" : isCompleted ? "bg-[#00C853] text-black" : "bg-white text-black"
              )}
            >
              {item.step < currentStep && item.step <= maxCompletedStep ? '✓' : item.step}
            </span>
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
