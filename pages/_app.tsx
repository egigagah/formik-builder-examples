import React from "react";
import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@definitions/chakra/theme";
import "@styles/global.css";
import Layouts from "@components/layouts";
import NextNProgress from "nextjs-progressbar";
import { appWithTranslation } from "next-i18next";
import { createStandaloneToast } from "@chakra-ui/react";

// const Noop: React.FC<PropsWithChildren> = ({ children }) => <>{children}</>;

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    const { ToastContainer } = createStandaloneToast();

    return (
        <>
            <NextNProgress />
            <ChakraProvider theme={theme}>
                <Layouts>
                    <Component {...pageProps} />
                </Layouts>
            </ChakraProvider>
            <ToastContainer />
        </>
    );
}

export default appWithTranslation(MyApp);
