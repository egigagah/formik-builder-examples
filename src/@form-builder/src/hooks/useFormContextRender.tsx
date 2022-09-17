import { useContext } from "react";
import FormContextRender from "../context/FormContextRender";
import { FormRenderState, FormsShapes } from "../types";

export default function useFormContextRender<T>(): FormRenderState<
    T | FormsShapes
> {
    const ctx = useContext(FormContextRender);

    return ctx as FormRenderState<T | FormsShapes>;
}
