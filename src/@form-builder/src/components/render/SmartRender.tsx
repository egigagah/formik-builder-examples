import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import { ChakraUi } from "../forms";
import AccordionLayout from "./Accordions";
import SmartFormComponent from "./SmartForm";

export default function SmartRender({ datas }: any): JSX.Element {
    return (
        <Stack>
            {datas.as === "wizards" && (
                <ChakraUi.WizardForm
                    datas={datas.data}
                    isLazy
                    colorScheme="teal"
                    w="full"
                    children={undefined}
                ></ChakraUi.WizardForm>
            )}
            {datas.as === "accordions" && (
                <AccordionLayout
                    datas={datas.data}
                    defaultIndex={[0]}
                    allowMultiple
                    allowToggle
                    rounded="xl"
                    bg="white"
                />
            )}
            {datas.as === "wrapper" && <WrapperRender datas={datas} />}
            {datas.as === "forms" && (
                <SmartFormComponent datas={datas} noTitle={datas.noTitle} />
            )}
            {Array.isArray(datas) &&
                datas.map((d: any, i: number) => (
                    <SmartRenderArray datas={d} key={d.id} />
                ))}
        </Stack>
    );
}

const SmartRenderArray = ({ datas }: any): JSX.Element => {
    const d = { ...datas };

    if (d.as === "wizards") {
        return (
            <ChakraUi.WizardForm
                datas={d.data}
                isFitted
                isLazy
                variant="solid-rounded"
                colorScheme="blackAlpha"
                w="full"
                children={undefined}
            ></ChakraUi.WizardForm>
        );
    } else if (d.as === "accordions") {
        return (
            <AccordionLayout datas={d.data} allowMultiple defaultIndex={[0]} />
        );
    } else if (d.as === "forms") {
        return <SmartRenderArray onHandleSubmit={() => undefined} datas={d} />;
    } else if (d.as === "wrapper") {
        return <WrapperRender datas={datas} />;
    } else return <></>;
};

function WrapperRender({ datas }: any) {
    return (
        <Stack id={datas.id} flex={1} flexDirection="column" w="full" h="full">
            {!datas.noTitle && (
                <Box>
                    <Text fontSize="2xl" fontWeight="bold">
                        {datas.title}
                    </Text>
                    <Divider />
                </Box>
            )}
            {datas.data.map((item: any, index: number) => (
                <SmartRender key={`${item.id}-${index}`} datas={item} />
            ))}
        </Stack>
    );
}
