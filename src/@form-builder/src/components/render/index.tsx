import { Button, Code, HStack, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { TypeOfShape } from "yup/lib/object";
import { jsonShapeToYup } from "../../utils/generator";
import { FormRenderState, FormsShapes } from "../../types";
import { Formik, FormikHelpers } from "formik";
import SmartRender from "./SmartRender";
import FormContextRender from "@form-builder/src/context/FormContextRender";

export interface RenderFormComponentProps
    extends React.HTMLProps<HTMLDivElement> {
    formSchema: FormsShapes;
    initialValue?: any;
    uiKit?: "chakra-ui";
    showJson?: boolean;
    onHandleSubmit: (value: any, helper: FormikHelpers<any>) => void;
    btnSubmiTitle?: string;
    setBtnLoading?: boolean;
}

const RenderFormComponent: React.FC<RenderFormComponentProps> = ({
    formSchema,
    initialValue,
    onHandleSubmit,
    btnSubmiTitle,
    showJson = false,
    setBtnLoading = false,
}): JSX.Element => {
    const [validatorScheme, setValidatorScheme] = useState<
        TypeOfShape<any> | undefined
    >(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isBtnLoading, setIsBtnLoading] = useState(false);
    const [formState, setFormState] = useState<FormsShapes | undefined>(
        undefined,
    );
    const [state, dispatch] = useState<
        FormRenderState<FormsShapes | undefined>
    >(undefined as any);

    useEffect(() => {
        setIsLoading(true);
        if (formSchema && formSchema.data) {
            if (formSchema.data.length > 0) {
                const shapes = jsonShapeToYup(extractAllFormsMemo);
                setValidatorScheme(shapes);
            }
            setFormState(formSchema);
            setIsLoading(false);
        }
    }, [formSchema]);

    useEffect(() => {
        setIsLoading(true);
        dispatch({
            scheme: formState,
            theme: "chackra-ui",
            validator: validatorScheme,
            values: {},
        });
        setIsLoading(false);
    }, [formState, validatorScheme]);

    const extractAllFormsMemo = useMemo(
        () => extractAllForms(formSchema.data),
        [formSchema.data],
    );

    function extractAllForms(d: any, res: any[] = []): any[] {
        if (!d) return res;

        for (const item of d) {
            const currData = item.data;
            if (!item.as) res.push(item);
            else if (item.as === "forms") res.push(...currData);
            extractAllForms(currData, res);
        }
        return res;
    }

    return (
        <FormContextRender.Provider value={state}>
            {!isLoading && (
                <Formik
                    enableReinitialize
                    validateOnMount
                    validateOnChange
                    initialValues={initialValue || state.validator?.cast()}
                    validationSchema={state.validator}
                    onSubmit={(values, helper) =>
                        onHandleSubmit(values, helper)
                    }
                >
                    {(props) => (
                        <form onSubmit={props.handleSubmit}>
                            <Stack py={4} bg="white">
                                {state.scheme && (
                                    <SmartRender datas={state.scheme} />
                                )}
                                <Stack w="full">
                                    <HStack justifyContent="end" px={6}>
                                        {/* {handleResetScheme && (
                                            <Button
                                                colorScheme="gray"
                                                onClick={() => undefined}
                                            >
                                                Reset
                                            </Button>
                                        )} */}
                                        <Button
                                            isLoading={setBtnLoading}
                                            loadingText="Processing"
                                            type="submit"
                                            colorScheme="whatsapp"
                                            disabled={
                                                !(
                                                    props.isValid && props.dirty
                                                ) || setBtnLoading
                                            }
                                        >
                                            {btnSubmiTitle ?? "Submit"}
                                        </Button>
                                    </HStack>
                                    {showJson && (
                                        <Stack w="full" h="lg">
                                            <Text
                                                fontSize="xl"
                                                fontWeight="bold"
                                            >
                                                Object Form:
                                            </Text>
                                            <Text fontSize="sm">
                                                This object form only for
                                                development / create new form
                                                purpose
                                            </Text>
                                            <Code overflow="scroll">
                                                <pre>
                                                    {JSON.stringify(
                                                        props,
                                                        null,
                                                        4,
                                                    )}
                                                </pre>
                                            </Code>
                                        </Stack>
                                    )}
                                </Stack>
                            </Stack>
                        </form>
                    )}
                </Formik>
            )}
        </FormContextRender.Provider>
    );
};

export default RenderFormComponent;
