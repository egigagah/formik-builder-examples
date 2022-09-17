import { Switch, SwitchProps } from "@chakra-ui/react";
import { forwardRef } from "react";
import { WrapperFields } from "..";

export interface SelectComponentProps extends SwitchProps {
    title: string;
    name: string;
    error: any;
    helper?: string;
    isRequired?: boolean;
}

const index = forwardRef<any, SelectComponentProps>((props, ref) => {
    return (
        <WrapperFields
            title={props.title}
            name={props.name}
            error={props.error}
            helper={props.helper}
            isRequired={props.isRequired ?? false}
        >
            <Switch {...props} {...ref} />
        </WrapperFields>
    );
});

export default index;
