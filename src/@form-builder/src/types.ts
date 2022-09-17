import { CSSProperties, ElementType } from "react";
import {
    listAffectingActionType,
    listDependedActionType,
    listFieldType,
} from "./utils/utils";

type GeneratorTypeFromArray<T extends ReadonlyArray<unknown>> =
    T extends ReadonlyArray<infer GeneratorTypeFromArray>
        ? GeneratorTypeFromArray
        : never;

export type dependedActionType = GeneratorTypeFromArray<
    typeof listDependedActionType
>;

const typeInputFieldsList = [...listFieldType] as const;

export type typeInputFields = GeneratorTypeFromArray<
    typeof typeInputFieldsList
>;

export type dependedObjType = {
    by: string;
    condition: string;
    value: string;
};

const listTypeUiComponent = [
    "accordions",
    "forms",
    "wizards",
    "wrapper",
] as const;

export type uiComponentType = GeneratorTypeFromArray<
    typeof listTypeUiComponent
>;

export type dependedType = {
    rules: dependedObjType[];
    action?: dependedActionType;
};

export type affectingActionType = GeneratorTypeFromArray<
    typeof listAffectingActionType
>;

export interface operatorsProps {
    [key: string]: (a: any, b: any) => boolean;
}

export type affectingType = {
    other: string;
    action: affectingActionType;
}[];

export interface renderFormShape {
    id: string;
    name: string;
    label: string;
    type: typeInputFields;
    accept?: string;
    listValue?: string;
    required: boolean;
    isDepend: boolean;
    dependedRules?: dependedObjType[];
    dependedAction?: dependedActionType;
    isAppend: boolean;
    appended?: dependedType;
    appendedData?: renderFormShape[];
    isAffecting: boolean;
    affecting?: affectingType;
    errorMessage: string;
    helperMessage?: string;
    masking?: string;
    minLength?: number | string;
    maxLength?: number | string;
    max?: number | string | Date;
    min?: number | string | Date;
    default?: string | Date | boolean;
    style?: CSSProperties;
    element?: ElementType;
}

export interface FormBuilderShape {
    title: string;
    name: string;
    slug: string;
    forms: Array<renderFormShape[]>;
    active: boolean;
}

export interface FormsShapes {
    id?: string;
    refId?: string;
    title: string;
    active: boolean;
    data: FormBuilderShape[] | FormsShapes[] | renderFormShape[] | any[];
    as: uiComponentType;
    depended?: dependedType;
    name?: string;
    noTitle?: boolean;
    performance?: boolean;
}

export type FormBuilderAction<Values> = {
    type: "setSelected" | "setScheme" | "setEdit" | "init";
    data: Values;
};

export type FormBuilderState<Values> = {
    scheme?: Values;
    selected: any;
    editData: any;
};

export type FormRenderState<Values> = {
    scheme?: Values;
    values?: any;
    validator?: any;
    theme?: string;
    handleResetScheme?: (d: Values) => void;
};

export interface FormBuilderValues {
    [field: string]: any;
}

export interface FormBuilderHelper<Values> {
    setSelected: (d: any) => void;
    setScheme: (d: Values, id?: string) => void;
    setEdit: (d: any) => void;
}

export type FormContextBuilderType<Values> = FormBuilderState<Values> &
    FormBuilderHelper<Values>;
