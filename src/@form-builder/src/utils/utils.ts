import { cloneDeepWith, memoize, noop, values } from "lodash";

import { JSONSchema4 } from "json-schema";
import { FormsShapes, renderFormShape } from "./../types";

export function camalize(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

export const listDependedActionType = [
    "show",
    "required",
    "calculate",
    "show-required",
] as const;

export const listAffectingActionType = [
    "calculateDate",
    "setValue",
    "setValueCamelCase",
    "resetValue",
] as const;

export const listFieldType = [
    "appendix",
    "button",
    "checkbox",
    "code-editor",
    "date",
    "datetime",
    "email",
    "boolean",
    "file",
    "hidden",
    "hidden-array",
    "hidden-object",
    "image",
    "month",
    "number",
    "password",
    "radio",
    "range",
    "reset",
    "sign",
    "multiselect",
    "async-multiselect",
    "select",
    "select-string",
    "async-select",
    "submit",
    "tel",
    "text",
    "textarea",
    "time",
    "url",
];

export const listLogicalType = [
    { text: "greater", value: "greater", desc: "" },
    { text: "smaller", value: "smaller", desc: "" },
    { text: "greater or equal", value: "greaterOrEqual", desc: "" },
    { text: "smaller or equal", value: "smallerOrEqual", desc: "" },
    { text: "equal", value: "equal", desc: "" },
    { text: "not equal", value: "notEqual", desc: "" },
    { text: "contain", value: "contain", desc: "" },
    { text: "not contain", value: "notContain", desc: "" },
    { text: "not empty", value: "notEmpty", desc: "" },
    { text: "in", value: "in", desc: "" },
    { text: "not in", value: "notIn", desc: "" },
];

export const dataRenderForms: renderFormShape[] = [
    {
        id: "3d4a9767-6782-4b4b-842f-ea3f21fb01b6",
        name: "sex",
        type: "radio",
        listValue: "Laki,girl",
        label: "Sex",
        required: true,
        isDepend: false,
        isAffecting: false,
        isAppend: false,
        errorMessage: "Sex is required",
        default: "",
        style: {
            width: "min-content",
        },
    },
    {
        id: "8e94516b-d3b5-4806-b29a-fa0379a8a8bc",
        name: "email",
        type: "email",
        label: "Email",
        required: true,
        isAffecting: false,
        isAppend: false,
        isDepend: false,
        errorMessage: "Email is required",
        minLength: 1,
        maxLength: 10,
        default: "",
        style: {
            width: "100%",
        },
    },
    {
        id: "79aa16c9-f4d3-406e-9601-2d5176914597",
        name: "password",
        type: "password",
        label: "Password",
        required: false,
        isAffecting: false,
        isAppend: false,
        isDepend: true,
        dependedRules: [
            {
                by: "email",
                condition: "notEmpty",
                value: "",
            },
        ],
        dependedAction: "show",
        errorMessage: "Password is required",
        default: "",
        style: {
            width: "100%",
        },
    },
    {
        id: "ddb19738-803b-4abe-be25-18f3ae90ffdd",
        name: "name",
        type: "text",
        label: "Full Name",
        required: true,
        isAffecting: false,
        isAppend: false,
        isDepend: false,
        errorMessage: "Full Name is required",
        default: "",
        style: {
            width: "50%",
        },
    },
    {
        id: "79aa16c9-f4d3-406e-9601-2d5176914598",
        name: "dob",
        type: "date",
        label: "Date of Birth",
        required: true,
        isAffecting: true,
        isAppend: false,
        isDepend: false,
        affecting: [{ action: "calculateDate", other: "age" }],
        errorMessage: "Date of Birth is required",
        max: new Date(),
        min: undefined,
        default: "",
        style: {
            width: "50%",
        },
    },
    {
        id: "ddb19738-803b-4abe-be25-18f3ae91ffdd",
        name: "age",
        type: "number",
        label: "Age",
        required: false,
        isAffecting: false,
        isAppend: false,
        isDepend: true,
        errorMessage: "Age is required",
        default: "",
        style: {
            width: "50%",
        },
    },
    {
        id: "ddb19738-803b-4abe-be25-18f3ae91eedd",
        name: "ktp",
        type: "text",
        label: "KTP",
        required: false,
        isAffecting: false,
        isAppend: false,
        isDepend: true,
        dependedRules: [
            {
                by: "age",
                condition: "greater",
                value: "17",
            },
        ],
        dependedAction: "show",
        errorMessage: "KTP is required",
        default: "",
        style: {
            width: "50%",
        },
    },
    {
        id: "79aa16c9-f4d3-406e-9601-2d5176914590",
        name: "hobies",
        type: "checkbox",
        listValue: "Swimming,Hiking,Football,Game",
        label: "Hobbies",
        required: true,
        isAffecting: false,
        isAppend: false,
        isDepend: false,
        errorMessage: "Hobbies is required",
        default: "",
        style: {
            width: "50%",
        },
    },
    {
        id: "79aa16c9-f4d3-406e-9601-2d5176914591",
        name: "photo",
        type: "file",
        label: "Photo",
        required: true,
        isAffecting: false,
        isAppend: false,
        isDepend: false,
        errorMessage: "Photo is required",
        default: "",
        style: {
            width: "50%",
        },
    },
];

// export const dataResultObject: FormBuilderShape = {
//     title: "Profile",
//     active: true,
//     forms: dataRenderForms,
// };

export const dataForms: FormsShapes = {
    active: true,
    as: "forms",
    title: "Profile",
    data: dataRenderForms.slice(0, 3),
    refId: "profile-accordion1",
    id: "profile-forms",
};

export const dataAccordions: FormsShapes = {
    active: true,
    as: "accordions",
    title: "Coordion 1",
    data: [dataForms],
    refId: "wizard-1",
    id: "profile-accordion1",
};

export const dataForms1: FormsShapes = {
    active: true,
    as: "forms",
    title: "Profile 1",
    data: dataRenderForms.slice(3, 5),
    refId: "profile-accordion2",
    id: "profile-forms1",
};

export const dataAccordions1: FormsShapes = {
    active: true,
    as: "accordions",
    title: "Coordion 2",
    data: [dataForms1],
    refId: "wizard-1",
    id: "profile-accordion2",
};

export const dataForms2: FormsShapes = {
    active: true,
    as: "forms",
    title: "Profile 2",
    data: dataRenderForms.slice(5),
    refId: "wizard-1",
    id: "profile-forms2",
};

export const dataWizards: FormsShapes = {
    active: true,
    as: "wizards",
    title: "Wizard 1",
    data: [dataAccordions, dataAccordions1, dataForms2],
    id: "wizard-1",
};

export const jsonSchemaForm: JSONSchema4 = {
    title: "Form abc",
    items: [
        {
            properties: {
                email: {
                    title: "Email",
                    type: "string",
                    description: "Email",
                    format: "email",
                    pattern: "^\\S+@\\S+\\.\\S+$",
                    required: true,
                },
                name: {
                    title: "Name",
                    type: "string",
                    description: "Name",
                    required: true,
                },
                password: {
                    title: "Password",
                    type: "string",
                    description: "password",
                    format: "password",
                    required: true,
                },
                age: {
                    title: "Age",
                    type: "number",
                },
                sex: {
                    title: "Gender",
                    type: "object",
                    oneOf: [
                        {
                            properties: {
                                boy: {
                                    type: "string",
                                    required: true,
                                },
                            },
                        },
                        {
                            properties: {
                                girl: {
                                    type: "string",
                                    required: true,
                                },
                            },
                        },
                    ],
                    required: true,
                },
            },
            dependencies: {
                age: ["sex"],
            },
        },
    ],
};

const editObjectScheme = (datas: any, modify: any) => {
    return cloneDeepWith(datas, (value: any) => {
        return value?.id === modify.id ? { ...value, ...modify } : noop();
    });
};

const removeObjectScheme = (datas: any, target: any, parent: any) => {
    return cloneDeepWith(datas, (value: any, key: any) => {
        if (value?.id === parent) {
            const idx = value?.data?.map((i: any) => i.id).indexOf(target);
            if (idx >= 0) {
                value?.data?.splice(idx, 1);
                return value;
            }
        }
        return noop();
    });
};

export { editObjectScheme, removeObjectScheme };

export const findSchemeByIdMemoize = memoize(findObjectScheme, (...args) =>
    values(args).join("_"),
);

export const editSchemeMemoize = memoize(editObjectScheme, (...args) =>
    values(args).join("_"),
);

export const removeSchemeMemoize = memoize(removeObjectScheme, (...args) =>
    values(args).join("_"),
);

export function findObjectScheme(
    datas: any,
    targetId?: string,
    noFilter = true,
): any {
    if (datas.id === targetId) {
        console.log("--found", datas);
        return datas;
    }

    if (datas.data) {
        let i = 0;
        const len = datas?.data?.length;
        const item = datas?.data;
        while (i < len) {
            if (!item[i].as && noFilter) return;
            const x: FormsShapes | renderFormShape = findObjectScheme(
                item[i],
                targetId,
            );
            if (x) return x;
            i++;
        }
    }

    return;
}

export function getAllNode(scheme: any, res: any[] = []): any[] {
    if (!scheme) return res;

    scheme.forEach((item: any, idx: number) => {
        if (item.as !== "forms") {
            res.push(item);
        }
        getAllNode(item.data, res);
    });
    return res;
}

export function breakObjectReference(d: any): any {
    return JSON.parse(JSON.stringify(d));
}

export function createMask(string: string): string {
    if (string.length >= 8)
        return string.replace(/(\w{2})(\w{3})(\w{2})/, "$1-$2-$3");
    else if (string.length >= 5)
        return string.replace(/(\w{2})(\w{3})/, "$1-$2");
    else if (string.length >= 2) return string.replace(/(\w{2})/, "$1-");
    else return destroyMask(string);
}

export function destroyMask(string: string): string {
    return string.replace(/\W/g, "").substring(0, 8);
}
