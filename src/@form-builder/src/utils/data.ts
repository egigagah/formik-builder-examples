// list collection types
export const inputStringTypeList = [
    "text",
    "email",
    "password",
    "tel",
    "textarea",
];

export const inputSelectTypeList = [
    "multiselect",
    "Async multiselect",
    "select",
    "select-string",
    "Async select",
];
export const yupStringTypeList = ["text", "email", "password", "radio", "tel"];
export const yupNumberTypeList = ["tel", "number"];
export const yupDateTypeList = ["date", "datetime"];
export const yupSelectTypeList = [
    "multiselect",
    "async-multiselect",
    "select",
    "async-select",
];
export const yupObjectTypeList = [
    "code-editor",
    "hidden-object",
    ...yupSelectTypeList,
];
export const yupMultipleSelectTypeList = [
    "multiple-select",
    "multiple-select-async",
];
