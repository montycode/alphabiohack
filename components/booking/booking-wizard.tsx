"use client";

import { BookingStepper } from "./booking-stepper";
import { Card } from "@/components/ui/card";
import { DoctorInfo } from "./doctor-info";
import { StepFour } from "./steps/step-four";
import { StepOne } from "./steps/step-one";
import { StepThree } from "./steps/step-three";
import { StepTwo } from "./steps/step-two";
import { StepZero } from "./steps/step-zero";
import { useState } from "react";
import { useTranslations } from "next-intl";

const steps = [StepZero, StepOne, StepTwo, StepThree, StepFour];

export function BookingWizard() {
  const [step, setStep] = useState(0);
  const t = useTranslations('Booking');

  const StepComponent = steps[step];

  return (
    <div className="w-full p-2 mx-auto">
      <BookingStepper 
        steps={steps.map((_, index) => ({
          id: index,
          name: [
            t('appointmentType'),
            t('specialty'), 
            t('dateTime'),
            t('basicInformation'),
            t('confirmationStep')
          ][index],
          status: index < step ? "complete" : index === step ? "current" : "upcoming"
        }))} 
      />
      
      {/* Información del Doctor/Terapeuta */}
      <DoctorInfo />
      
      <Card className="w-full bg-muted">
        <StepComponent
          onNext={() => setStep((s) => s + 1)}
          onBack={() => setStep((s) => s - 1)}
          isFirst={step === 0}
        />
      </Card>
    </div>
  );
}