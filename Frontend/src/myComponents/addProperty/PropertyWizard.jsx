// components/PropertyWizard.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';// Shadcn components
import {Step1 , Step2} from './Step';
import { nextStep, prevStep, updateFormData  } from '@/redux/PropertySlice';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


const PropertyWizard = () => {
    const dispatch = useDispatch();
    const { step, formData } = useSelector((state) => state.property);
    const { register, handleSubmit, control, watch } = useForm({
      defaultValues: formData,
    });
  
    const onSubmit = (data) => {
      dispatch(updateFormData(data));
      if (step === 1) {
        dispatch(nextStep());
      } else {
        console.log('Form Submitted:', data); // Replace with API call
      }
    };

  return (
    <Card className=" p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Add New Property - Step {step}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 ? (
          <Step1 register={register} control={control} watch={watch} formData={formData} />
        ) : (
          <Step2 register={register} formData={formData} />
        )}
        <div className="flex justify-between mt-6">
          {step === 2 && (
            <Button type="button" variant="outline" onClick={() => dispatch(prevStep())}>
              Previous
            </Button>
          )}
          <Button type="submit">
            {step === 1 ? 'Next' : 'Submit'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PropertyWizard;