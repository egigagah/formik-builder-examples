import {
    Box,
    Button,
    ButtonGroup,
    HStack,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverProps,
    PopoverTrigger,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import FormContextBuilder from "@form-builder/src/context/FormContextBuilder";
import {
    FormBuilderAction,
    FormBuilderState,
    FormBuilderValues,
    FormsShapes,
} from "@form-builder/src/types";
import { dataWizards } from "@form-builder/src/utils";
import {
    forwardRef,
    PropsWithChildren,
    Reducer,
    useEffect,
    useReducer,
    useRef,
} from "react";
import MainBuilder from "./Main";
import FocusLock from "react-focus-lock";

export type RenderFormBuilderComponentProps<T> = {
    defaultSchema?: FormsShapes;
    slug?: string;
};

function formBuilderReducer<Values>(
    state: FormBuilderState<Values>,
    action: FormBuilderAction<Values>,
) {
    const { data, type } = action;
    switch (type) {
        case "setScheme":
            return { ...state, scheme: data };
        case "setSelected":
            return { ...state, selected: data, editData: undefined };
        case "setEdit":
            return { ...state, editData: data, selected: undefined };
        default:
            return { ...state };
    }
}

function useContextBuilder<
    Values extends FormBuilderValues = FormBuilderValues,
>() {
    const [state, dispatch] = useReducer<
        Reducer<FormBuilderState<Values>, FormBuilderAction<Values>>
    >(formBuilderReducer, {
        scheme: undefined,
        selected: undefined,
        editData: undefined,
    });

    function setSelected(d: any) {
        dispatch({ type: "setSelected", data: d });
    }

    function setScheme(d: any, id?: any) {
        dispatch({ type: "setScheme", data: d });
    }

    function setEdit(d: any) {
        dispatch({ type: "setEdit", data: d });
    }

    const ctx = {
        ...state,
        setSelected,
        setScheme,
        setEdit,
    };

    return ctx;
}

function RenderFormBuilderComponent<
    Values extends FormBuilderValues = FormBuilderValues,
>({
    slug,
    defaultSchema,
}: RenderFormBuilderComponentProps<Values>): JSX.Element {
    const formBuildeCtx = useContextBuilder();

    useEffect(() => {
        console.log(slug);
        if (slug) formBuildeCtx.setScheme(dataWizards);
        else formBuildeCtx.setScheme(undefined);
    }, [slug]);

    return (
        <FormContextBuilder.Provider value={formBuildeCtx}>
            <HStack h="full" alignItems="flex-start">
                <Stack flex={1}>
                    <MainBuilder />
                </Stack>
            </HStack>
        </FormContextBuilder.Provider>
    );
}

export default RenderFormBuilderComponent;

interface WarningPopupProps extends PropsWithChildren {
    message: string;
    action?: () => void;
    tooltipLabel?: string;
}

export const PopoverConfirmation = forwardRef<PopoverProps, WarningPopupProps>(
    ({ message, action, children }, ref) => {
        const { onOpen, onClose, isOpen } = useDisclosure();
        const firstFieldRef = useRef(null);
        return (
            <Popover
                isOpen={isOpen}
                initialFocusRef={firstFieldRef}
                onOpen={onOpen}
                onClose={onClose}
                placement="bottom-start"
            >
                <PopoverTrigger {...ref}>{children}</PopoverTrigger>
                <PopoverContent>
                    <FocusLock />
                    <PopoverArrow />
                    <PopoverHeader fontSize="lg" fontWeight="medium">
                        Confirmation
                    </PopoverHeader>
                    {/* <PopoverCloseButton /> */}
                    <PopoverBody>
                        <Text>{message}</Text>
                    </PopoverBody>
                    <PopoverFooter display="flex" justifyContent="flex-end">
                        <ButtonGroup>
                            <Button
                                colorScheme="red"
                                onClick={() => {
                                    if (action) action();
                                    onClose();
                                }}
                            >
                                Yes
                            </Button>
                            <Button onClick={onClose}>No, Abort this</Button>
                        </ButtonGroup>
                    </PopoverFooter>
                </PopoverContent>
            </Popover>
        );
    },
);
