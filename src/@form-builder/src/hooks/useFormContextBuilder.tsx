import { useContext } from "react";
import FormContextBuilder from "../context/FormContextBuilder";
import { FormContextBuilderType, FormsShapes } from "../types";

export default function useFormContextBuilder<T>(): FormContextBuilderType<
    T | FormsShapes
> {
    const ctx = useContext(FormContextBuilder);

    return ctx as FormContextBuilderType<T | FormsShapes>;
}
