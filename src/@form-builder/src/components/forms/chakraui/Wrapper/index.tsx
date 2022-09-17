import {
    FormControl,
    FormControlProps,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    forwardRef,
    Stack,
} from "@chakra-ui/react";
import { memo } from "react";

export interface FormWrapperProps extends FormControlProps {
    error: any;
    helper?: string;
}

const indexComponent = forwardRef<FormWrapperProps, "form">((props, ref) => {
    return (
        <FormControl
            as={Stack}
            {...ref}
            isInvalid={!!props.error?.[props.name as string]}
            isRequired={props.isRequired}
        >
            <FormLabel htmlFor={props.id ?? props.name}>
                {props.title}
            </FormLabel>
            {props.children}
            <FormHelperText>{props.helper}</FormHelperText>
            <FormErrorMessage>
                {props.error?.[props.name as string] as string}
            </FormErrorMessage>
        </FormControl>
    );
});

const index = memo(indexComponent);

export default index;
