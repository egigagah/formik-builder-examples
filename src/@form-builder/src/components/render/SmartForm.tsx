import {
    Box,
    Button,
    Checkbox,
    Divider,
    Flex,
    Radio,
    Stack,
    Text,
} from "@chakra-ui/react";
import {
    FastField,
    FastFieldProps,
    FieldArray,
    FormikContextType,
    FormikProps,
    useFormikContext,
} from "formik";
import { FC, Fragment, useEffect, useMemo, useState } from "react";
import {
    inputSelectTypeList,
    inputStringTypeList,
    yupNumberTypeList,
} from "../../utils/data";
import "react-datepicker/dist/react-datepicker.css";
import { dependedType, renderFormShape } from "@form-builder/src/types";
import {
    breakObjectReference,
    mapDefaultValueByDependenToView,
    mapDependenActionToView,
} from "@form-builder/src/utils";
import { ChakraUi, CodeEditor } from "../forms";
import JsonQuery from "json-query";
import { cloneDeepWith, noop } from "lodash";

export interface SmartFormComponentProps {
    datas: any;
    showJson?: boolean;
    btnSubmiTitle?: string;
    onHandleSubmit?: (d: any) => void;
    noTitle?: boolean;
}

type AppendixFieldProps = {
    item: renderFormShape;
    props: FormikProps<any>;
    setChange: (a: any, b: any, c: renderFormShape) => void;
};

type RenderingFormsType = {
    datas: {
        item: renderFormShape;
        idx: number;
    };
    props: FormikProps<any>;
    setChange: (a: any, b: any, c: renderFormShape) => void;
};

function getValueByName(form: any, name: string) {
    const datas = JsonQuery(name, { data: form.values });
    return datas.value;
}

function AppendixField({ item, props, setChange }: AppendixFieldProps) {
    return (
        <>
            {item.appendedData && (
                <FieldArray name={item.name}>
                    {({ form, push, remove }) => (
                        <Box>
                            <Text fontWeight="medium" mb={0}>
                                {item.label}
                            </Text>
                            <Stack px={8}>
                                {getValueByName(form, item.name) &&
                                    getValueByName(form, item.name).length >
                                        0 &&
                                    getValueByName(form, item.name).map(
                                        (d: any, i: number) => {
                                            return (
                                                <Stack key={i} py={4}>
                                                    {Object.keys(d).map(
                                                        (el) => {
                                                            const fil =
                                                                item.appendedData
                                                                    ? item?.appendedData.filter(
                                                                          (
                                                                              x: renderFormShape,
                                                                          ) =>
                                                                              x.name ===
                                                                              el,
                                                                      )
                                                                    : [];
                                                            const currItem = {
                                                                ...fil[0],
                                                                name: `${item.name}.${i}.${el}`,
                                                                id: `${item.name}.${i}.${el}`,
                                                            };
                                                            return (
                                                                <RenderingForms
                                                                    key={`${item.name}.${i}.${el}`}
                                                                    datas={{
                                                                        item: currItem,
                                                                        idx: i,
                                                                    }}
                                                                    props={
                                                                        props
                                                                    }
                                                                    setChange={
                                                                        setChange
                                                                    }
                                                                />
                                                            );
                                                        },
                                                    )}

                                                    <Button
                                                        colorScheme="red"
                                                        onClick={() =>
                                                            remove(i)
                                                        }
                                                        variant="outline"
                                                    >
                                                        Delete this {item.label}
                                                    </Button>
                                                    <Divider />
                                                </Stack>
                                            );
                                        },
                                    )}
                            </Stack>
                            <Button
                                float="right"
                                onClick={() => {
                                    const dataForm: any = {};
                                    const x = [
                                        ...(item?.appendedData as renderFormShape[]),
                                    ];
                                    x.forEach((d: renderFormShape) => {
                                        const x = breakObjectReference(d);
                                        dataForm[x.name] = x.default;
                                    });
                                    push(dataForm);
                                }}
                                colorScheme="teal"
                                variant="outline"
                            >
                                Add {item.label}
                            </Button>
                        </Box>
                    )}
                </FieldArray>
            )}
        </>
    );
}

function RenderingForms({ datas, props, setChange }: RenderingFormsType) {
    const { item, idx } = datas;

    function mapDepended() {
        const newName = extractNamedMemoized;
        const mappedItem = cloneDeepWith(item, (value) => {
            if (!!value?.isDepend && !!value?.dependedRules) {
                const tmp = breakObjectReference(item?.dependedRules);
                const newRules = value.dependedRules.map(
                    (y: any, idx: number) => {
                        const by = newName ? `${newName}.` : "";
                        return { ...y, by: `${by}${tmp[idx].by}` };
                    },
                );
                value.dependedRules = newRules;
                return { ...value };
            } else return noop();
        });

        return mapDependenActionToView(
            {
                rules: mappedItem?.dependedRules,
                action: mappedItem?.dependedAction,
            } as dependedType,
            props.values,
        );
    }

    function extractNamed(data: any) {
        const named = breakObjectReference(data.name);
        const nameSpliting = named.split(".");
        nameSpliting.splice(nameSpliting.length - 1, 1);
        return nameSpliting.length > 0
            ? breakObjectReference(nameSpliting.join("."))
            : null;
    }
    const extractNamedMemoized = useMemo(() => extractNamed(item), [item]);

    return (
        <Fragment>
            <Box
                key={`${item.name}-${item.id}`}
                w={item?.style?.width}
                p={2}
                hidden={mapDepended()}
            >
                {item.type === "appendix" && (
                    <AppendixField
                        item={item}
                        props={props}
                        setChange={setChange}
                    />
                )}
                {item.type !== "textarea" &&
                    (inputStringTypeList
                        .concat(yupNumberTypeList)
                        .includes(item.type) ||
                        item.type === "date") && (
                        <FastField name={item.name}>
                            {({ form }: FastFieldProps<any>) => (
                                <ChakraUi.TextInput
                                    id={`${idx}-${item.id}`}
                                    type={item.type}
                                    name={item.name}
                                    title={item.label}
                                    value={getValueByName(form, item.name)}
                                    onChange={(e: any) =>
                                        setChange(form, e.target.value, item)
                                    }
                                    isInvalid={!!form.errors[item.name]}
                                    min={item.min}
                                    max={item.max}
                                    maxLength={item.maxLength}
                                    minLength={item.minLength}
                                    error={form.errors}
                                    helper={item.helperMessage}
                                    isRequired={item.required}
                                    masking={item.masking}
                                />
                            )}
                        </FastField>
                    )}
                {item.type === "textarea" && (
                    <FastField name={item.name}>
                        {({ form }: FastFieldProps<any>) => (
                            <ChakraUi.TextareaInput
                                id={`${idx}-${item.id}`}
                                name={item.name}
                                title={item.label}
                                value={getValueByName(form, item.name)}
                                onChange={(e: any) =>
                                    setChange(form, e.target.value, item)
                                }
                                resize="vertical"
                                isInvalid={!!form.errors[item.name]}
                                w="full"
                                size="xs"
                                maxLength={item.maxLength as number}
                                minLength={item.minLength as number}
                                error={form.errors}
                                helper={item.helperMessage}
                                isRequired={item.required}
                            />
                        )}
                    </FastField>
                )}
                {item.listValue && item.type === "checkbox" && (
                    <FastField name={item.name}>
                        {({ form }: FastFieldProps<any>) => (
                            <ChakraUi.CheckboxInput
                                title={item.label}
                                name={item.name}
                                colorScheme="facebook"
                                defaultValue={getValueByName(form, item.name)}
                                onChange={(d) => setChange(form, d, item)}
                                error={form.errors}
                                helper={item.helperMessage}
                                isRequired={item.required}
                            >
                                {item?.listValue &&
                                    item.listValue
                                        .split(",")
                                        .map((d: string, i: number) => (
                                            <Checkbox
                                                key={`${d}-${i}`}
                                                value={d}
                                                isChecked={false}
                                            >
                                                {d}
                                            </Checkbox>
                                        ))}
                            </ChakraUi.CheckboxInput>
                        )}
                    </FastField>
                )}
                {item.listValue && item.type === "radio" && (
                    <FastField name={item.name}>
                        {({ form }: FastFieldProps<any>) => (
                            <ChakraUi.RadioInput
                                id={`${idx}-${item.id}`}
                                name={item.name}
                                title={item.label}
                                onChange={(e: any) => setChange(form, e, item)}
                                value={getValueByName(form, item.name)}
                                error={form.errors}
                                helper={item.helperMessage}
                                isRequired={item.required}
                            >
                                <Stack direction="row">
                                    {item.listValue &&
                                        item.listValue
                                            .split(",")
                                            .map((d: string, i: number) => (
                                                <Radio
                                                    key={`${d}-${i}`}
                                                    value={d}
                                                >
                                                    {d}
                                                </Radio>
                                            ))}
                                </Stack>
                            </ChakraUi.RadioInput>
                        )}
                    </FastField>
                )}
                {item.type === "boolean" && (
                    <FastField name={item.name}>
                        {({ form }: FastFieldProps<any>) => (
                            <ChakraUi.SwitchInput
                                id={`${idx}-${item.id}`}
                                name={item.name}
                                title={item.label}
                                value={getValueByName(form, item.name)}
                                onChange={(e: any) =>
                                    setChange(form, e.target.checked, item)
                                }
                                defaultChecked={form.values[item.name]}
                                isChecked={form.values[item.name]}
                                error={form.errors}
                                helper={item.helperMessage}
                            />
                        )}
                    </FastField>
                )}
                {item.listValue && inputSelectTypeList.includes(item.type) && (
                    <FastField name={item.name}>
                        {({ form }: FastFieldProps<any>) => {
                            return (
                                <ChakraUi.SelectInput
                                    id={`${idx}-${item.id}`}
                                    name={item.name}
                                    title={item.label}
                                    isMulti={item.type === "multiselect"}
                                    returnString={item.type === "select-string"}
                                    onChange={(e: any) => {
                                        setChange(
                                            form,
                                            item.type === "select-string"
                                                ? e.value
                                                : e,
                                            item,
                                        );
                                    }}
                                    value={getValueByName(form, item.name)}
                                    options={
                                        item.listValue
                                            ? item?.listValue
                                                  .split(",")
                                                  .map((d: string) => ({
                                                      value: d,
                                                      label: d,
                                                  }))
                                            : []
                                    }
                                    error={form.errors}
                                    helper={item.helperMessage}
                                    isRequired={item.required}
                                ></ChakraUi.SelectInput>
                            );
                        }}
                    </FastField>
                )}
                {(item.type === "file" || item.type === "image") && (
                    <FastField name={item.name}>
                        {({ form }: FastFieldProps<any>) => (
                            <ChakraUi.TextInput
                                id={`${idx}-${item.id}`}
                                type={item.type}
                                name={item.name}
                                title={item.label}
                                value={getValueByName(form, item.name)}
                                onChange={(e: any) =>
                                    setChange(form, e.target.value, item)
                                }
                                min={item.min}
                                max={item.max}
                                maxLength={item.maxLength}
                                minLength={item.minLength}
                                accept="image/*,.pdf"
                                error={form.errors}
                                helper={item.helperMessage}
                                isRequired={item.required}
                            />
                        )}
                    </FastField>
                )}
                {item.type === "code-editor" && (
                    <FastField name={item.name}>
                        {({ form }: FastFieldProps<any>) => (
                            <CodeEditor
                                id={`${idx}-${item.id}`}
                                name={item.name}
                                title={item.label}
                                value={JSON.stringify(
                                    getValueByName(form, item.name),
                                    null,
                                    4,
                                )}
                                error={form.errors}
                                helper={item.helperMessage}
                                isRequired={item.required}
                                onSave={(d) => setChange(form, d, item)}
                            />
                        )}
                    </FastField>
                )}
            </Box>
        </Fragment>
    );
}

const SmartFormComponent: FC<SmartFormComponentProps> = ({
    datas,
    showJson,
    btnSubmiTitle,
    onHandleSubmit,
    noTitle = false,
}): JSX.Element => {
    const [isShowJson, setShowJson] = useState(showJson ?? true);
    const props: FormikContextType<renderFormShape> =
        useFormikContext<renderFormShape>();

    useEffect(() => {
        if (showJson !== null || showJson !== undefined)
            setShowJson(showJson as boolean);
    }, [showJson]);

    const setChange = (
        propsForm: any,
        value: any,
        objItem: renderFormShape,
    ) => {
        propsForm.setFieldValue(objItem.name, value);

        if (
            objItem.isAffecting &&
            objItem.affecting &&
            objItem.affecting?.length > 0
        ) {
            mapDefaultValueByDependenToView(
                objItem.affecting,
                propsForm.values,
                value,
                propsForm.setFieldValue,
            );
        }
    };

    return (
        <Fragment>
            {props.values && (
                <Flex w="full" flexWrap="wrap" bg="white" p={4} rounded="xl">
                    {!noTitle && (
                        <Box w="full" pb={4}>
                            <Text fontSize="xl" fontWeight="bold" mb={4}>
                                {datas.title}
                            </Text>
                            <Divider />
                        </Box>
                    )}

                    {datas?.data &&
                        datas.data.map((item: any, idx: number) => (
                            <RenderingForms
                                key={`${item.id}-${idx}`}
                                datas={{ item, idx }}
                                props={props}
                                setChange={setChange}
                            />
                        ))}
                </Flex>
            )}
        </Fragment>
    );
};

export default SmartFormComponent;
