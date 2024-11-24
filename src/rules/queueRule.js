import { maxStringRule, requiredRule } from ".";

export const queueRule = {
  patient_id: [requiredRule()],
  doctor_id: [requiredRule()],
  complaint: [requiredRule(), maxStringRule(255)],
  blood_pressure: [requiredRule(), maxStringRule(10)],
  weight: [requiredRule(), maxStringRule(10)],
  height: [requiredRule(), maxStringRule(10)],
  temperature: [requiredRule(), maxStringRule(10)],
};
