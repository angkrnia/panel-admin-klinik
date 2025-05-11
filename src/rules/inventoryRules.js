import { maxStringRule, requiredRule } from ".";

export const unitsRule = {
    name: [requiredRule(), maxStringRule(50)],
    description: [requiredRule(), maxStringRule(255)],
};

export const categoriesRule = {
    name: [requiredRule(), maxStringRule(50)],
    image: [maxStringRule(255)],
};

export const medicinesRule = {
    name: [requiredRule(), maxStringRule(100)],
    sku: [requiredRule(), maxStringRule(100)],
    stock: [requiredRule()],
    category_id: [],
    group_id: [],
    image: [maxStringRule(255)],
    type: [],
    side_effect: [],
    description: [],
    dosage: [],
    indication: [],
    units: [],
};

export const tindakanRule = {
    procedure_code: [requiredRule(), maxStringRule(50)],
    name: [requiredRule(), maxStringRule(50)],
    category: [maxStringRule(50)],
    description: [maxStringRule(255)],
};
