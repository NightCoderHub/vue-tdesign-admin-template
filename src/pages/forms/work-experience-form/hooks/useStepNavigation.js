// hooks/useStepNavigation.js
export function useStepNavigation(store) {
  const nextStep = () => {
    if (store.currentStep < 4) {
      store.setCurrentStep(store.currentStep + 1);
    }
  };

  const prevStep = () => {
    if (store.currentStep > 1) {
      store.setCurrentStep(store.currentStep - 1);
    }
  };

  return {
    nextStep,
    prevStep,
  };
}