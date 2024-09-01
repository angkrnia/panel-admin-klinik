export const requiredValMsg = () => `Data ini harus diisi.`;

export const requiredRule = (
  message = requiredValMsg(),
  required = true,
  trigger = ["change"]
) => {
  return {
    message: message,
    required: required,
    trigger: trigger,
  };
};

export const minStringRule = (min, trigger = ["blur", "change"], message) => {
  return {
    min: min,
    trigger: trigger,
    message: message ? message : `Minimal ${min} karakter!`,
  };
};

export const maxStringRule = (max, trigger = ["blur", "change"], message) => {
  return {
    max: max,
    trigger: trigger,
    message: message ? message : `Maksimal ${max} karakter!`,
  };
};

export const emailRule = (
  message = "Format email salah!",
  trigger = ["blur", "change"],
  type = "email"
) => {
  return {
    message: message,
    trigger: trigger,
    type: type,
  };
};

export const minNumberRule = (
  inputNumber = 1,
  trigger = ["blur", "change"]
) => {
  return {
    validator: (_, value) => value >= inputNumber,
    message: `Harus lebih besar atau sama dengan ${inputNumber}!`,
    trigger: trigger,
  };
};

export const minNumberNotEqualRule = (
  inputNumber = 0,
  trigger = ["blur", "change"]
) => {
  return {
    validator: (_, value) => value > inputNumber,
    message: `Harus lebih besar ${inputNumber}!`,
    trigger: trigger,
  };
};

export const maxNumberRule = (
  inputNumber = 2147483647,
  trigger = ["blur", "change"]
) => {
  return {
    validator: (_, value) => value < inputNumber,
    message: `Harus lebih kecil atau sama dengan ${inputNumber}!`,
    trigger: trigger,
  };
};

export const arrayRule = (message = "Wajib isi, setidaknya 1 item") => {
  return {
    message: message,
    type: "array",
    required: true,
    len: 1,
    fields: {
      0: { type: "string" || "object", required: true },
    },
  };
};

export const arrayObjectRule = (
  object = {},
  message = "Wajib isi, setidaknya 1 item"
) => {
  return {
    message: message,
    type: "array",
    required: true,
    len: 1,
    fields: {
      0: {
        type: "object",
        required: true,
        fields: object,
      },
    },
  };
};
