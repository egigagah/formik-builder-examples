import { forwardRef, Input, InputProps } from "@chakra-ui/react";
import { memo } from "react";
import ReactInputMask from "react-input-mask";
import { WrapperFields } from "..";

interface TextInputType extends InputProps {
    error: any;
    helper?: string;
    masking?: string;
}

const indexComponent = forwardRef<TextInputType, "input">((props, ref) => {
    return (
        <WrapperFields
            title={props.title}
            name={props.name}
            error={props.error}
            helper={props.helper}
            isRequired={props.isRequired}
        >
            {!props.masking && <Input {...props} {...ref} />}
            {props.masking && (
                <Input
                    as={ReactInputMask}
                    mask={props.masking}
                    maskChar={null}
                    {...props}
                    {...ref}
                />
            )}
        </WrapperFields>
    );
});

const index = memo(indexComponent);

export default index;
