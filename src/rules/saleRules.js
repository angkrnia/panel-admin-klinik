import { requiredRule } from ".";

export const manualTransactionRule = {
  patient_id: [requiredRule()],
};
