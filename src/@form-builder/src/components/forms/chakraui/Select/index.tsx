import { forwardRef, useEffect, useState } from "react";
import ReactSelect, { Props } from "react-select";
import { WrapperFields } from "..";

export interface SelectComponentProps extends Props {
    title: string;
    name: string;
    error: any;
    helper?: string;
    isRequired?: boolean;
    returnString?: boolean;
}

const index = forwardRef<Props, SelectComponentProps>((props, ref) => {
    const [state, setState] = useState<any>(undefined as any);
    useEffect(() => {
        if (typeof props.value === "string") {
            const val = props.options?.filter(
                (x: any) => x.value === props.value,
            )[0];
            setState(val);
        }
    }, [props.value]);

    return (
        <WrapperFields
            title={props.title}
            name={props.name}
            error={props.error}
            helper={props.helper}
            isRequired={props.isRequired ?? false}
        >
            <ReactSelect
                {...props}
                value={props.returnString ? state : props.value}
                {...ref}
            />
        </WrapperFields>
    );
});

export default index;
