import { dependedType, renderFormShape } from "../types";
import * as Yup from "yup";
import { TypeOfShape } from "yup/lib/object";
import moment from "moment";
import { yupDateTypeList, yupNumberTypeList, yupObjectTypeList } from "./data";

/*
    this method is used to convert json shape model into yup schemas.
    result should be something like (Yup shapes schema):
    {
      name: Yup.string().required(errMsg),
      email: Yup.string().email().required(errMsg).
    }
*/
export const jsonShapeToYup = (json: renderFormShape[]): TypeOfShape<any> => {
    const data = [...json];
    const shapes = data?.reduce((prev: any, curr: renderFormShape) => {
        // ((prev[curr.name] = curr), prev)
        let obj = undefined;

        // get YupScheme from type
        if (yupDateTypeList.includes(curr.type)) {
            obj = mapDateScheme(obj, curr);
        } else if (yupObjectTypeList.includes(curr.type)) {
            obj = mapObjectScheme(obj, curr);
        } else if (curr.type === "checkbox") {
            obj = mapArrayScheme(obj, curr);
        } else if (curr.type === "boolean") {
            obj = Yup.boolean().default(!!curr.default);
        } else if (curr.type === "hidden-array") {
            obj = Yup.array().default([]);
        } else if (curr.type === "appendix") {
            obj = Yup.array();
            if (curr.appendedData && curr.appendedData?.length > 0) {
                const defaultData = jsonShapeToYup(curr.appendedData);
                obj.of(defaultData as Yup.AnySchema<any, any, any>);
            }
        } else obj = mapStringOrNumberScheme(obj, curr);

        // nullable / required
        if (curr.required)
            obj = obj.required(
                curr.errorMessage
                    ? curr.errorMessage
                    : "This field is required",
            );
        else if (curr.isDepend && curr.dependedRules) {
            obj = mapDependentSchema(obj, {
                rules: curr.dependedRules,
                action: curr.dependedAction,
            });
        } else obj = obj.nullable();

        return (prev[curr.name] = obj), prev;
    }, {});

    return Yup.object().shape(shapes);
};

function mapDependentSchema(obj: any, curr: dependedType) {
    let tmp = obj;
    const { rules, action } = curr;
    rules.forEach((data) => {
        const { by, condition, value } = data;
        tmp = tmp.when(by, (other: any, schema: Yup.AnySchema) =>
            mapDependenConditionToYup(other, condition, value) &&
            action === "required"
                ? schema.required()
                : schema,
        );
    });
    obj = tmp;
    return obj;
}

function mapStringOrNumberScheme(yupObj: any, obj: renderFormShape) {
    let currYup = yupObj;

    if (yupNumberTypeList.includes(obj.type)) {
        currYup = Yup.number();
        if (obj.min) currYup = currYup.moreThan(obj.min);
        if (obj.max) currYup = currYup.lessThan(obj.max);

        if (typeof obj.default === "number")
            currYup = currYup.default(obj.default);
    } else {
        currYup = Yup.string();
        if (obj.type === "email") currYup = currYup.email();
        else if (obj.type === "url") currYup = currYup.url();
        else if (obj.type === "radio") {
            const arr = obj.listValue?.split(",");
            if (arr && arr.length > 0) currYup = Yup.mixed().oneOf(arr);
        }

        if (obj.minLength) currYup = currYup.min(obj.minLength);
        if (obj.maxLength) currYup = currYup.max(obj.maxLength);

        currYup = currYup.default(
            typeof obj.default === "string" ? obj.default : "",
        );
    }

    return currYup;
}

function mapDateScheme(yupObj: any, obj: renderFormShape) {
    let currYup = yupObj ?? Yup.date();

    if (obj.min) currYup = currYup.min(obj.min);
    if (obj.max) currYup = currYup.max(obj.max);

    currYup = currYup.default(
        obj.default instanceof Date ? obj.default : new Date(),
    );
    return currYup;
}

function mapObjectScheme(yupObj: any, obj: renderFormShape) {
    let currYup = yupObj ?? Yup.object();
    currYup = currYup.default(
        typeof obj.default != "object" ? {} : obj.default,
    );
    return currYup;
}

function mapArrayScheme(yupObj: any, obj: renderFormShape) {
    let currYup = yupObj ?? Yup.array();

    const arr = obj.listValue?.split(",");
    currYup = currYup.compact((value: string) => {
        arr?.forEach((d) => {
            return value !== d;
        });
    });

    currYup = currYup.default(obj.default instanceof Array ? obj.default : []);
    return currYup;
}

/*
    this method for mapping dependecies condition by their rules.
    returning boolean as condition meet the rule or not
*/
export function mapDependenConditionToYup(
    by: string,
    condition: string,
    value: string,
): boolean {
    let res = false;
    switch (condition) {
        case "greater":
            res = parseInt(by) > parseInt(value);
            break;
        case "smaller":
            res = parseInt(by) < parseInt(value);
            break;
        case "greaterOrEqual":
            res = parseInt(by) >= parseInt(value);
            break;
        case "smallerOrEqual":
            res = parseInt(by) <= parseInt(value);
            break;
        case "equal":
            res = by === value;
            break;
        case "notEqual":
            res = by !== value;
            break;
        case "contain":
            res = !!by === true ? by.includes(value) : false;
            break;
        case "notContain":
            res = !(!!by === true ? by.includes(value) : false);
            break;
        case "notEmpty":
            res = !!by;
            break;
        case "in":
            res = value.split(",").includes(by);
            break;
        case "notIn":
            res = !value.split(",").includes(by);
            break;
        default:
            break;
    }

    return res;
}
