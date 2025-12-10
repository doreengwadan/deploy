'use client';

import Link from 'next/link';

interface Step {
  id: number;
  title: string;
  href: string;
}

interface ProgressIndicatorProps {
  currentStep: number;
}

const steps: Step[] = [
  { id: 1, title: 'Dashboard', href: '/application/dashboard' },
  { id: 2, title: 'Select Application Type', href: '/application/select-type' },
  { id: 3, title: 'Personal Details', href: '/application/personal-details' },
  { id: 4, title: 'Contact Details', href: '/application/contact-details' },
  { id: 5, title: 'Next of Kin', href: '/application/next-of-kin' },
  { id: 6, title: 'High School Records', href: '/application/high-school-records' },
  { id: 7, title: 'Program Selection', href: '/application/program-selection' },
  { id: 8, title: 'Documents', href: '/application/documents' },
  { id: 9, title: 'Application Fees', href: '/application/application-fees' },
  { id: 10, title: 'Submit', href: '/application/submit' },
];

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <>
      <nav
        aria-label="Progress"
        className="fixed top-16 left-0 right-0 z-40 bg-white shadow-md px-4 py-3"
      >
        <ol className="flex justify-between w-full relative">
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <li key={step.id} className="flex-1 flex flex-col items-center relative">
                {/* Connector line */}
                {idx !== steps.length - 1 && (
                  <span
                    className={`absolute top-4 left-1/2 h-0.5 w-full transform -translate-x-1/2 ${
                      isCompleted ? 'bg-green-900' : 'bg-gray-300'
                    }`}
                    style={{ zIndex: 0 }}
                  />
                )}

                {/* Circle indicator */}
                {isCompleted ? (
                  <Link
                    href={step.href}
                    className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-green-800 text-white hover:bg-teal-700"
                  >
                    ✓
                  </Link>
                ) : isActive ? (
                  <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-green-900 text-green-900 font-semibold">
                    {step.id}
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 text-red-500">
                    {step.id}
                  </span>
                )}

                {/* Step label */}
                <p
                  className={`mt-2 text-xs text-center ${
                    isActive ? 'text-mzuni-green font-semibold' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Spacer to offset fixed nav */}
      <div className="h-36" />
    </>
  );
}
