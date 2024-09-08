import { emailRule, maxStringRule, requiredRule } from ".";

export const patientRule = {
  fullname: [requiredRule(), maxStringRule(50)],
  gender: [requiredRule()],
  no_ktp: [maxStringRule(16)],
  phone: [requiredRule(), maxStringRule(20)],
  nama_keluarga: [requiredRule(), maxStringRule(16)],
  birthday: [maxStringRule(20)],
  age: [requiredRule()],
  address: [requiredRule(), maxStringRule(150)],
  record_no: [maxStringRule(16)],
};
