import { minStringRule, requiredRule } from ".";

export const loginRule = {
  phone: [requiredRule(), minStringRule(5)],
  password: [requiredRule(), minStringRule(3)],
};
