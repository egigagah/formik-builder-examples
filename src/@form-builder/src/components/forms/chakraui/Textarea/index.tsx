import { forwardRef, Textarea, TextareaProps } from "@chakra-ui/react";
import { WrapperFields } from "..";

interface TextareaPropsType extends TextareaProps {
    error: any;
    helper?: string;
}

const index = forwardRef<TextareaPropsType, "input">((props, ref) => {
    return (
        <WrapperFields
            title={props.title}
            name={props.name}
            error={props.error}
            helper={props.helper}
            isRequired={props.isRequired}
        >
            <Textarea {...props} {...ref} />
        </WrapperFields>
    );
});

export default index;
