import { createContext } from "react";
import { FormRenderState, FormsShapes } from "../types";

const FormContextRender = createContext<
    FormRenderState<FormsShapes | undefined>
>({
    scheme: undefined,
    values: {},
    validator: {},
    theme: "chakra-ui",
    handleResetScheme: () => undefined,
});

export default FormContextRender;
