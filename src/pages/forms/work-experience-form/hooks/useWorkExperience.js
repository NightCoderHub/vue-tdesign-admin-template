// hooks/useWorkExperience.js
import { computed } from "vue";

export function useWorkExperience(store) {
  const workExperiences = computed(() => store.step2.workExperiences);

  const addWorkExperience = () => {
    store.addWorkExperienceItem();
  };

  const removeWorkExperience = (index) => {
    store.removeWorkExperienceItem(index);
  };

  return {
    workExperiences,
    addWorkExperience,
    removeWorkExperience,
  };
}
