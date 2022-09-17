import {
    Button,
    ButtonGroup,
    forwardRef,
    TextareaProps,
} from "@chakra-ui/react";
import { highlight, languages } from "prismjs";
import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { WrapperFields } from "../chakraui";

interface TextareaPropsType extends TextareaProps {
    error: any;
    helper?: string;
    onSave: (d: string) => void;
}

const index = forwardRef<TextareaPropsType, "input">((props, ref) => {
    const [state, setState] = useState("");

    useEffect(() => {
        setState(props.value ? (props.value as string) : "");
    }, [props.value]);
    return (
        <WrapperFields
            title={props.title}
            name={props.name}
            error={props.error}
            helper={props.helper}
            isRequired={props.isRequired}
        >
            <Editor
                {...ref}
                value={state}
                onValueChange={(e: any) => setState(e)}
                highlight={(code: any) =>
                    highlight(code, languages.json, "json")
                }
                padding={20}
                tabSize={4}
                tabIndex={1}
                style={{
                    background: "white",
                    overflow: "scroll",
                }}
            />
            {(props.value !== state || !!props.value !== !!state) && (
                <ButtonGroup display="flex" justifyContent="flex-end">
                    <Button
                        variant="ghost"
                        colorScheme="orange"
                        onClick={() => setState(props.value as string)}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="ghost"
                        colorScheme="teal"
                        onClick={() => props.onSave(state)}
                    >
                        Save
                    </Button>
                </ButtonGroup>
            )}
        </WrapperFields>
    );
});

export default index;
