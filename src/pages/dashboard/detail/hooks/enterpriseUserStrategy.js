export const enterpriseUserStrategy = {
  getFormFields: (initialForm) => ({
    companySize: initialForm.companySize || '',
    establishTime: initialForm.establishTime || '',
    legalPerson: initialForm.legalPerson || '',
  }),
  getRules: () => ({
    companySize: [{ required: true, message: "请输入企业规模", trigger: "blur" }],
    establishTime: [{ required: true, message: "请选择成立时间", trigger: "change" }],
    legalPerson: [{ required: true, message: "请输入法定代表人", trigger: "blur" }],
  }),
  clearFields: (form) => {
    form.age = '';
    form.occupation = '';
  }
};