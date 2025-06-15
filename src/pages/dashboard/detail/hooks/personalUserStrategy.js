export const personalUserStrategy = {
  getFormFields: (initialForm) => ({
    age: initialForm.age || '',
    occupation: initialForm.occupation || '',
  }),
  getRules: () => ({
    age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
    occupation: [{ required: true, message: "请输入职业", trigger: "blur" }],
  }),
  clearFields: (form) => {
    form.companySize = '';
    form.establishTime = '';
    form.legalPerson = '';
  }
};