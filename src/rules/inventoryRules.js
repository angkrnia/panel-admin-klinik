import { maxStringRule, requiredRule } from ".";

export const unitsRule = {
    name: [requiredRule(), maxStringRule(50)],
    description: [requiredRule(), maxStringRule(255)],
};

export const categoriesRule = {
    name: [requiredRule(), maxStringRule(50)],
    image: [maxStringRule(255)],
};

export const suppliersRule = {
    supplier_code: [requiredRule(), maxStringRule(100)],
    supplier_name: [requiredRule(), maxStringRule(255)],
    is_pbf: [requiredRule()],
    pic_name: [maxStringRule(255)],
    phone: [maxStringRule(50)],
    address: [],
    status: [requiredRule()],
};

export const medicinesRule = {
    name: [requiredRule(), maxStringRule(100)],
    sku: [requiredRule(), maxStringRule(100)],
    stock: [requiredRule()],
    min_stock: [],
    safe_stock: [],
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


export const tipeLayananRule = {
    name: [requiredRule(), maxStringRule(100)],
    price: [requiredRule()],
    doctor_fee: [requiredRule()],
    nurse_fee: [requiredRule()],
    other_fee: [requiredRule()],
    description: [requiredRule(),maxStringRule(255)],
};



