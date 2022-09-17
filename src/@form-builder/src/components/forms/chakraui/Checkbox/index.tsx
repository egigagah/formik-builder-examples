import { CheckboxGroup, CheckboxGroupProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import { WrapperFields } from "..";

export interface CheckboxComponentProps extends CheckboxGroupProps {
    title: string;
    name: string;
    error: any;
    helper?: string;
    isRequired?: boolean;
}

const index = forwardRef<CheckboxComponentProps, CheckboxComponentProps>(
    (props, ref) => {
        return (
            <WrapperFields
                title={props.title}
                name={props.name}
                error={props.error}
                helper={props.helper}
                isRequired={props.isRequired ?? false}
            >
                <CheckboxGroup {...ref} {...props}>
                    {props.children}
                </CheckboxGroup>
            </WrapperFields>
        );
    },
);

export default index;
