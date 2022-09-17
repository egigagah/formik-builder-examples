import { mapDependenConditionToYup } from "./generator";
import { affectingType, dependedType } from "../types";
import { camalize } from "./utils";
import JsonQuery from "json-query";

/*
    this method for mapping dependecies action into view's rendering.
    returning boolean as condition meet the rule or not
*/
export const mapDependenActionToView = (
    data: dependedType,
    targetValue: any,
): boolean => {
    if (!data || data.rules?.length < 1 || !data.rules) return false;
    const { rules, action } = data;
    let res = false;
    rules.forEach((d) => {
        res = mapDependenConditionToYup(
            JsonQuery(d.by, { data: targetValue }).value,
            d.condition,
            d.value,
        );
        if (action === "show") res = !res;
        if (!res) return false;
    });

    return res;
};

/*
    this method for mapping value that has been affected by the affection.
    returning the value as condition result | undefined
*/
export const mapDefaultValueByDependenToView = (
    data: affectingType,
    targetValue: any,
    currField: string,
    actionProps: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined,
    ) => void,
): string | undefined => {
    if (!data) return undefined;
    let res = undefined;
    data.forEach((d) => {
        res = mapAffectingOtherValue(d.action as string, currField);
        console.log(d.other, res, "----");

        actionProps(
            d.other,
            typeof targetValue[d.other] === "number"
                ? res
                    ? parseInt(res)
                    : null
                : res,
        );
    });
    return res;
};

/*
    this method used as helper for mapping affection condition by their functionallity.
    returning the value as condition result
*/
export const mapAffectingOtherValue = (
    condition: string,
    initValue: string,
): any => {
    let res = "";
    switch (condition) {
        case "setValue":
            res = initValue;
            break;
        case "setValueCamelCase":
            res = camalize(initValue);
            break;
        case "calculateDate":
            res = Math.abs(
                new Date().getFullYear() - parseInt(initValue),
            ).toString() as string;
            break;
        case "resetValue":
            res = "";
            break;
        default:
            break;
    }

    return res;
};
