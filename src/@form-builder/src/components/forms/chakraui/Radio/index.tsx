import { RadioGroup, RadioGroupProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import { WrapperFields } from "..";

export interface RadioComponentProps extends RadioGroupProps {
    title: string;
    name: string;
    error: any;
    helper?: string;
    isRequired?: boolean;
}

const index = forwardRef<RadioComponentProps, RadioComponentProps>(
    (props, ref) => {
        return (
            <WrapperFields
                title={props.title}
                name={props.name}
                error={props.error}
                helper={props.helper}
                isRequired={props.isRequired ?? false}
            >
                <RadioGroup {...ref} {...props}>
                    {props.children}
                </RadioGroup>
            </WrapperFields>
        );
    },
);

export default index;
