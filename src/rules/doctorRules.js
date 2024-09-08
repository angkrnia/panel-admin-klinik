import { emailRule, maxStringRule, minStringRule, requiredRule } from ".";

export const doctorRule = {
  fullname: [requiredRule(), maxStringRule(50)],
  email: [requiredRule(), emailRule()],
  password: [requiredRule(), minStringRule(4), maxStringRule(20)],
  phone: [requiredRule(), maxStringRule(20)],
  description: [requiredRule(), maxStringRule(255)],
  start_day: [requiredRule()],
  end_day: [requiredRule()],
  start_time: [requiredRule()],
  end_time: [requiredRule()],
  gender: [requiredRule()],
};

export const updateDoctorRule = {
  fullname: [requiredRule(), maxStringRule(50)],
  email: [requiredRule(), emailRule()],
  password: [minStringRule(4), maxStringRule(20)],
  phone: [requiredRule(), maxStringRule(20)],
  description: [requiredRule(), maxStringRule(255)],
  start_day: [requiredRule()],
  end_day: [requiredRule()],
  start_time: [requiredRule()],
  end_time: [requiredRule()],
  gender: [requiredRule()],
};
