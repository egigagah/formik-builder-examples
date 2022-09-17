import { createContext } from "react";
import { FormContextBuilderType } from "../types";

const FormContextBuilder = createContext<FormContextBuilderType<any>>(
    undefined as any,
);

export default FormContextBuilder;
