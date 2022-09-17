import {
    Box,
    Button,
    Center,
    Divider,
    HStack,
    IconButton,
    Stack,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import useFormContextBuilder from "@form-builder/src/hooks/useFormContextBuilder";
import useWindowSize from "@form-builder/src/hooks/useWindowSize";
import { FormsShapes, renderFormShape } from "@form-builder/src/types";
import {
    breakObjectReference,
    editObjectScheme,
    findObjectScheme,
} from "@form-builder/src/utils";
import { FormikHelpers } from "formik";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState } from "react";
import ReactFocusLock from "react-focus-lock";
import { AiFillDelete } from "react-icons/ai";
import { PopoverConfirmation } from ".";
import DragnDropWrapper from "../dragndrop";
import RenderFormComponent from "../render";

const TitleField: renderFormShape = {
    default: "",
    id: "title",
    name: "title",
    label: "Title",
    type: "text",
    required: false,
    isDepend: false,
    isAppend: false,
    isAffecting: false,
    errorMessage: "Title is Required",
    style: {
        width: "100%",
    },
};

const formLayout: FormsShapes = {
    id: "form-layout",
    active: true,
    as: "forms",
    title: "Form Layout",
    data: [
        TitleField,
        {
            default: "wizards",
            id: "as",
            name: "as",
            label: "As",
            type: "select-string",
            listValue: "accordions,forms,wizards,wrapper",
            required: true,
            isDepend: false,
            isAppend: false,
            isAffecting: false,
            errorMessage: "As is Required",
            style: {
                width: "100%",
            },
        },
        {
            default: "",
            id: "refId",
            name: "refId",
            label: "Refference Id",
            type: "text",
            required: false,
            isDepend: false,
            isAppend: false,
            isAffecting: false,
            errorMessage: "Refference Id is Required",
            style: {
                width: "100%",
            },
        },
        {
            id: "active",
            default: true,
            name: "active",
            label: "Active",
            type: "boolean",
            required: true,
            isDepend: false,
            isAppend: false,
            isAffecting: false,
            errorMessage: "",
        },
        {
            id: "noTitle",
            default: false,
            name: "noTitle",
            label: "Hide Title",
            type: "boolean",
            required: true,
            isDepend: false,
            isAppend: false,
            isAffecting: false,
            errorMessage: "",
        },
        {
            default: "",
            id: "data",
            name: "data",
            label: "data",
            type: "hidden-array",
            required: false,
            isDepend: false,
            isAppend: false,
            isAffecting: false,
            errorMessage: "",
            style: {
                width: "100%",
            },
        },
    ],
};

const mandatoryField: FormsShapes = {
    id: "form-fields-wrapper",
    active: true,
    as: "forms",
    title: "Field Data",
    noTitle: true,
    data: [
        {
            id: "name",
            default: "",
            name: "name",
            label: "name",
            type: "text",
            required: true,
            isDepend: false,
            isAppend: false,
            isAffecting: false,
            errorMessage: "",
            style: {
                width: "100%",
            },
        },
        {
            id: "label",
            default: "",
            name: "label",
            label: "label",
            type: "text",
            required: true,
            isDepend: false,
            isAppend: false,
            isAffecting: false,
            errorMessage: "",
            style: {
                width: "100%",
            },
        },
        {
            id: "type",
            default: "text",
            name: "type",
            label: "type",
            type: "select-string",
            listValue:
                "checkbox,date,datetime,email,boolean,file,hidden,hidden-array,hidden-object,image,month,number,password,radio,range,sign,multiselect,async-multiselect,select,select-string,async-select,submit,tel,text,textarea,time,url",
            required: true,
            isDepend: false,
            isAppend: false,
            isAffecting: true,
            affecting: [
                {
                    other: "masking",
                    action: "resetValue",
                },
                {
                    other: "listValue",
                    action: "resetValue",
                },
            ],
            errorMessage: "",
            style: {
                width: "100%",
            },
        },
        {
            id: "masking",
            default: "",
            name: "masking",
            label: "Masking",
            type: "text",
            required: false,
            isDepend: true,
            isAppend: false,
            dependedRules: [
                {
                    by: "type",
                    condition: "in",
                    value: "text,number,tel",
                },
            ],
            dependedAction: "show",
            isAffecting: false,
            errorMessage: "",
            style: {
                width: "100%",
            },
            helperMessage:
                "This expression will masking the input text; eg: '**-****-**'; * = alphanumeric; a: alphabeth; 9: numeric;",
        },
        {
            id: "listValue",
            default: "",
            name: "listValue",
            label: "List Value",
            type: "text",
            required: false,
            isDepend: true,
            dependedRules: [
                {
                    by: "type",
                    condition: "in",
                    value: "multiselect,async-multiselect,select,select-string,async-select,radio,checkbox",
                },
            ],
            dependedAction: "show",
            isAppend: false,
            isAffecting: false,
            errorMessage: "",
            helperMessage: "separate by comma without space",
            style: {
                width: "100%",
            },
        },
    ],
};

const optionsField: renderFormShape[] = [
    {
        id: "default",
        default: undefined,
        name: "default",
        label: "Default",
        type: "text",
        required: false,
        isDepend: false,
        isAppend: false,
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "100%",
        },
        helperMessage: "This is default value for this field",
    },
    {
        id: "min",
        default: undefined,
        name: "min",
        label: "Min",
        type: "number",
        required: false,
        isDepend: true,
        dependedRules: [
            {
                by: "type",
                condition: "equal",
                value: "number",
            },
        ],
        dependedAction: "show",
        isAppend: false,
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "50%",
        },
        helperMessage: "This is min value for number type field",
    },
    {
        id: "max",
        default: undefined,
        name: "max",
        label: "Max",
        type: "number",
        required: false,
        isDepend: true,
        dependedRules: [
            {
                by: "type",
                condition: "equal",
                value: "number",
            },
        ],
        dependedAction: "show",
        isAppend: false,
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "50%",
        },
        helperMessage: "This is max value for number type field",
    },
    {
        id: "minLength",
        default: undefined,
        name: "minLength",
        label: "Min Length",
        type: "number",
        required: false,
        isDepend: true,
        dependedRules: [
            {
                by: "type",
                condition: "in",
                value: "text,textarea,email,password",
            },
        ],
        dependedAction: "show",
        isAppend: false,
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "50%",
        },
        helperMessage: "This is min value for number type field",
    },
    {
        id: "maxLength",
        default: undefined,
        name: "maxLength",
        label: "Max Length",
        type: "number",
        required: false,
        isDepend: true,
        dependedRules: [
            {
                by: "type",
                condition: "in",
                value: "text,textarea,email,password",
            },
        ],
        dependedAction: "show",
        isAppend: false,
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "50%",
        },
        helperMessage: "This is max value for number type field",
    },
    {
        id: "required",
        default: "",
        name: "required",
        label: "required",
        type: "boolean",
        required: true,
        isDepend: false,
        isAppend: false,
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "100%",
        },
    },
    {
        id: "errorMessage",
        default: "",
        name: "errorMessage",
        label: "errorMessage",
        type: "text",
        required: false,
        isDepend: true,
        isAppend: false,
        dependedRules: [
            {
                by: "required",
                condition: "notEmpty",
                value: "",
            },
        ],
        dependedAction: "show",
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "100%",
        },
        helperMessage: "This message will show on field is error",
    },
    {
        id: "isDepend",
        default: "",
        name: "isDepend",
        label: "isDepend",
        type: "boolean",
        required: true,
        isDepend: false,
        isAppend: false,
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "100%",
        },
    },
    {
        default: "",
        id: "dependedRules",
        name: "dependedRules",
        label: "Depended Rules",
        type: "appendix",
        required: false,
        isDepend: true,
        dependedRules: [
            {
                by: "isDepend",
                condition: "notEmpty",
                value: "",
            },
        ],
        dependedAction: "show",
        isAppend: true,
        appendedData: [
            {
                id: "by",
                default: "",
                name: "by",
                label: "by",
                type: "text",
                required: true,
                isDepend: false,
                isAffecting: false,
                isAppend: false,
                errorMessage: "",
                style: {
                    width: "100%",
                },
            },
            {
                id: "condition",
                default: "",
                name: "condition",
                label: "condition",
                type: "select-string",
                listValue:
                    "greater,smaller,greaterOrEqual,smallerOrEqual,equal,notEqual,contain,notContain,notEmpty",
                required: true,
                isDepend: false,
                isAffecting: false,
                isAppend: false,
                errorMessage: "",
                style: {
                    width: "100%",
                },
            },
            {
                id: "value",
                default: "",
                name: "value",
                label: "value",
                type: "text",
                required: true,
                isDepend: false,
                isAffecting: false,
                isAppend: false,
                errorMessage: "",
                style: {
                    width: "100%",
                },
            },
        ],
        isAffecting: false,
        errorMessage: "Depended is Required",
        style: {
            width: "100%",
        },
    },
    {
        default: "",
        id: "dependedAction",
        name: "dependedAction",
        label: "Depended Action",
        type: "select-string",
        listValue: "show,required,calculate,show-required",
        required: false,
        isDepend: true,
        dependedRules: [
            {
                by: "isDepend",
                condition: "notEmpty",
                value: "",
            },
        ],
        dependedAction: "show",
        isAppend: false,
        isAffecting: false,
        errorMessage: "Depended is Required",
        style: {
            width: "100%",
        },
    },
    {
        id: "isAffecting",
        default: "",
        name: "isAffecting",
        label: "isAffecting",
        type: "boolean",
        required: true,
        isDepend: false,
        isAppend: false,
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "100%",
        },
    },
    {
        default: "",
        id: "affecting",
        name: "affecting",
        label: "affecting",
        type: "appendix",
        required: false,
        isDepend: true,
        dependedRules: [
            {
                by: "isAffecting",
                condition: "notEmpty",
                value: "",
            },
        ],
        dependedAction: "show",
        isAppend: true,
        appendedData: [
            {
                id: "other",
                default: "",
                name: "other",
                label: "other",
                type: "text",
                required: true,
                isDepend: false,
                isAffecting: false,
                isAppend: false,
                errorMessage: "",
                style: {
                    width: "100%",
                },
            },
            {
                id: "action",
                default: "",
                name: "action",
                label: "action",
                type: "select-string",
                listValue: "calculateDate,setValue,setValueCamelCase",
                required: true,
                isDepend: false,
                isAffecting: false,
                isAppend: false,
                errorMessage: "",
                style: {
                    width: "100%",
                },
            },
        ],
        isAffecting: false,
        errorMessage: "Depended is Required",
        style: {
            width: "100%",
        },
    },
    {
        id: "isAppend",
        default: "",
        name: "isAppend",
        label: "isAppend",
        type: "boolean",
        required: true,
        isDepend: false,
        isAppend: false,
        isAffecting: false,
        errorMessage: "",
        style: {
            width: "100%",
        },
    },
];

const appendField: renderFormShape = {
    default: "",
    id: "append",
    name: "append",
    label: "Append",
    type: "appendix",
    required: false,
    isDepend: true,
    dependedRules: [
        {
            by: "isAppend",
            condition: "notEmpty",
            value: "",
        },
    ],
    dependedAction: "show",
    isAppend: true,
    appendedData: [
        {
            id: "name",
            default: "",
            name: "name",
            label: "name",
            type: "text",
            required: true,
            isDepend: false,
            isAppend: false,
            isAffecting: false,
            errorMessage: "",
            style: {
                width: "100%",
            },
        },
        {
            id: "label",
            default: "",
            name: "label",
            label: "label",
            type: "text",
            required: true,
            isDepend: false,
            isAppend: false,
            isAffecting: false,
            errorMessage: "",
            style: {
                width: "100%",
            },
        },
        {
            id: "type",
            default: "text",
            name: "type",
            label: "type",
            type: "select-string",
            listValue:
                "checkbox,date,datetime,email,boolean,file,hidden,hidden-array,hidden-object,image,month,number,password,radio,range,sign,multiselect,async-multiselect,select,select-string,async-select,submit,tel,text,textarea,time,url",
            required: true,
            isDepend: false,
            isAppend: false,
            isAffecting: true,
            affecting: [
                { other: "masking", action: "resetValue" },
                { other: "listValue", action: "resetValue" },
            ],
            errorMessage: "",
            style: {
                width: "100%",
            },
        },
        {
            id: "masking",
            default: "",
            name: "masking",
            label: "Masking",
            type: "text",
            required: false,
            isDepend: true,
            isAppend: false,
            dependedRules: [
                {
                    by: "type",
                    condition: "in",
                    value: "text,number,tel,sllaslaslsasl",
                },
            ],
            dependedAction: "show",
            isAffecting: false,
            errorMessage: "",
            style: {
                width: "100%",
            },
            helperMessage:
                "This expression will masking the input text; eg: '**-****-**'; * = alphanumeric; a: alphabeth; 9: numeric;",
        },
        {
            id: "listValue",
            default: "",
            name: "listValue",
            label: "List Value",
            type: "text",
            required: false,
            isDepend: true,
            dependedRules: [
                {
                    by: "type",
                    condition: "in",
                    value: "multiselect,async-multiselect,select,select-string,async-select,radio,checkbox",
                },
            ],
            dependedAction: "show",
            isAppend: false,
            isAffecting: false,
            errorMessage: "",
            helperMessage: "separate by comma without space",
            style: {
                width: "100%",
            },
        },
        ...optionsField,
    ],
    isAffecting: false,
    errorMessage: "Depended is Required",
    style: {
        width: "100%",
    },
};

const formField: FormsShapes = {
    id: "form-fields",
    active: true,
    as: "wrapper",
    title: "Form Fields",
    data: [
        {
            id: "form-fields-wizards",
            active: true,
            as: "wizards",
            title: "",
            noTitle: true,
            data: [
                { ...mandatoryField },
                {
                    id: "form-fields-accordion",
                    active: true,
                    as: "forms",
                    title: "Configuration",
                    noTitle: true,
                    data: [...optionsField, appendField],
                },
                {
                    id: "form-fields-style",
                    active: true,
                    as: "forms",
                    title: "Style",
                    noTitle: true,
                    data: [
                        {
                            id: "style",
                            default: "",
                            name: "style",
                            label: "Style",
                            type: "code-editor",
                            required: false,
                            isDepend: false,
                            isAppend: false,
                            isAffecting: false,
                            errorMessage: "",
                            helperMessage: "Write a valid CSS code",
                            style: {
                                width: "100%",
                            },
                        },
                    ],
                },
            ],
        },
    ],
};

const Forms = (): JSX.Element => {
    const { scheme, selected, setScheme, setSelected, setEdit, editData } =
        useFormContextBuilder<FormsShapes>();
    const [state, setState] = useState<string>("form-layouts");
    const tmpScheme = useRef(scheme);

    useEffect(() => {
        if (scheme) tmpScheme.current = scheme;
    }, [scheme]);

    const onSubmitForm = (values: any, helper: FormikHelpers<any>) => {
        if (editData) editSubmission(values, helper);
        else {
            if (state === "form-layouts") submitLayouts(values, helper);
            else if (state === "form-fields") submitFields(values, helper);
        }
    };

    function submitLayouts(values: any, helper: FormikHelpers<any>) {
        const { resetForm, setFieldValue, validateForm } = helper;
        const data = breakObjectReference(values);
        data.id = nanoid(10);
        data.refId = selected.id || null;
        if (data.refId !== "") {
            const x = findObjectScheme(scheme, data.refId);
            x.data.push(breakObjectReference(data));
            setScheme(breakObjectReference(scheme));
        } else {
            setScheme(data);
        }
        resetForm();
        setFieldValue("refId", data.id);
        validateForm();
        setSelected(data);
    }

    function submitFields(values: any, helper: FormikHelpers<any>) {
        const { resetForm, validateForm } = helper;
        const data = breakObjectReference(values);
        data.id = nanoid(10);
        data.refId = selected.id || null;
        if (selected && selected.id) {
            const x = findObjectScheme(scheme, selected.id);
            x.data.push(breakObjectReference(data));
            setScheme(breakObjectReference(scheme));
        } else {
            setScheme(data);
        }
        resetForm();
        validateForm();
    }

    function editSubmission(values: any, helper: FormikHelpers<any>) {
        const { resetForm, validateForm } = helper;
        const data = { ...values };
        const res = editObjectScheme(scheme, data);

        setScheme(res);
        resetForm();
        validateForm();
        setEdit(undefined);
    }

    useEffect(() => {
        if (selected && selected.as === "forms") setState("form-fields");
        else setState("form-layouts");
    }, [selected]);

    useEffect(() => {
        if (editData && !editData.as) setState("form-fields");
        else setState("form-layouts");
    }, [editData]);

    const refDiv = useRef<HTMLDivElement | null>(null);
    const [height, setHeight] = useState<number | string>("full");

    const size = useWindowSize();

    useEffect(() => {
        setHeight(size.height - (refDiv?.current?.offsetTop || 0));
    }, [size]);

    return (
        <HStack
            ref={refDiv}
            w="full"
            h={height}
            overflow="scroll"
            alignItems="start"
            px={4}
            rounded="xl"
        >
            <Stack
                justifyContent="start"
                alignItems="flex-start"
                maxW="max-content"
            >
                <Stack
                    flex={1}
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    position="fixed"
                    left={0}
                    pt={16}
                >
                    <Button
                        size="sm"
                        colorScheme="teal"
                        variant="ghost"
                        disabled={state === "form-fields"}
                        isActive={state === "form-layout"}
                        onClick={() => setState("form-layouts")}
                    >
                        Layouts Form
                    </Button>
                    <Button
                        size="sm"
                        colorScheme="teal"
                        variant="ghost"
                        disabled={
                            selected?.as !== "forms" && state !== "form-fields"
                        }
                        onClick={() => setState("form-fields")}
                        isActive={state === "form-fields"}
                    >
                        Fields Form
                    </Button>
                </Stack>
            </Stack>
            <Stack flex={1} py={8} bg="grey.100">
                <Center>
                    <Stack w="lg">
                        <Text pt={2} fontSize="sm">
                            This form layouts & fields is generated by Form
                            builder
                        </Text>
                        <Stack w="full">
                            <Box bg="white" px={4} rounded="2xl">
                                <ReactFocusLock>
                                    {state === "form-layouts" && (
                                        <RenderFormComponent
                                            formSchema={formLayout}
                                            initialValue={editData}
                                            showJson={true}
                                            onHandleSubmit={(d, helper) =>
                                                onSubmitForm(d, helper)
                                            }
                                        />
                                    )}
                                    {state === "form-fields" && (
                                        <RenderFormComponent
                                            formSchema={formField}
                                            initialValue={editData}
                                            showJson={true}
                                            onHandleSubmit={(d, helper) =>
                                                onSubmitForm(d, helper)
                                            }
                                        />
                                    )}
                                </ReactFocusLock>
                            </Box>
                        </Stack>
                    </Stack>
                </Center>
            </Stack>
            <Stack justifyContent="start" alignItems="flex-start" w="md">
                <Stack
                    width="md"
                    // position="sticky"
                    right={0}
                    flexDirection="row"
                    height="full"
                    bg="white"
                    overflow="scroll"
                >
                    <Stack flex={1}>
                        <HStack p={4} justifyContent="space-between">
                            <Text fontSize="xl" fontWeight="bold" mb={0}>
                                Component List
                            </Text>
                            {scheme && (
                                <Tooltip label="Delete All Scheme">
                                    <PopoverConfirmation
                                        action={() =>
                                            setScheme(undefined as any)
                                        }
                                        message="Are you sure to delete all scheme?"
                                    >
                                        <IconButton
                                            aria-label="delete-all"
                                            icon={<AiFillDelete size={15} />}
                                            variant="ghost"
                                            colorScheme="blackAlpha"
                                        />
                                    </PopoverConfirmation>
                                </Tooltip>
                            )}
                        </HStack>
                        <Divider />
                        <DragnDropWrapper
                            flex={1}
                            justifyContent="space-between"
                            alignItems="stretch"
                        />
                    </Stack>
                </Stack>
            </Stack>
        </HStack>
    );
};

export default Forms;
