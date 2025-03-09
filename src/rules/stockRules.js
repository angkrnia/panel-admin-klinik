import { maxStringRule, requiredRule } from ".";

export const stockEntryHeaderRule = {
  source: [requiredRule(), maxStringRule(255)],
  note: [maxStringRule(255)],
};

export const addProductStockEntryRule = {
  product_id: [requiredRule()],
  quantity: [requiredRule()],
  note: [maxStringRule(255)],
  buy_price: [requiredRule()],
};

export const updateProductStockEntryRule = {
  quantity: [requiredRule()],
  note: [maxStringRule(255)],
  buy_price: [requiredRule()],
};

export const stockOpnameHeaderRule = {
  code: [requiredRule(), maxStringRule(25)],
  pic: [requiredRule(), maxStringRule(255)],
  note: [maxStringRule(255)],
};
