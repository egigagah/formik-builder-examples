import { BoxProps, Button, ButtonGroup } from "@chakra-ui/react";
import { FormsShapes } from "@form-builder/src/types";
import { useEffect } from "react";
import useUndo from "use-undo";

interface UndoRedoProps<Values> extends BoxProps {
    datas: Values;
}

export default function UndoRedo({
    datas,
    children,
}: UndoRedoProps<FormsShapes | undefined>): JSX.Element {
    const [
        stateScheme,
        {
            set: setStateScheme,
            reset: resetScheme,
            undo: undo,
            redo: redo,
            canUndo,
            canRedo,
        },
    ] = useUndo(datas);
    const { present: presentScheme } = stateScheme;

    console.log(presentScheme);
    useEffect(() => {
        setStateScheme(datas);
    }, [datas]);

    return (
        <ButtonGroup>
            <Button disabled={!canUndo} onClick={undo}>
                Undo
            </Button>
            <Button disabled={!canRedo} onClick={redo}>
                Redo
            </Button>
            {children}
        </ButtonGroup>
    );
}
