import { emailRule, minStringRule, requiredRule } from ".";

export const loginRule = {
  email: [requiredRule(), emailRule()],
  password: [requiredRule(), minStringRule(3)],
};
