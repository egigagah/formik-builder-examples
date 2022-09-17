import {
    Box,
    Button,
    Flex,
    HStack,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from "@chakra-ui/react";
import useFormContextBuilder from "@form-builder/src/hooks/useFormContextBuilder";
import { FormsShapes } from "@form-builder/src/types";
import Forms from "./Forms";
import RenderFormComponent from "../render";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { CodeEditor } from "../forms";
import { dataWizards } from "@form-builder/src/utils";

const MainBuilder = (): JSX.Element => {
    const { scheme, setScheme } = useFormContextBuilder<FormsShapes>();

    return (
        <Tabs
            as={Stack}
            isLazy
            variant="soft-rounded"
            colorScheme="blackAlpha"
            w="full"
        >
            <HStack alignItems="center" p={4} bg="white">
                <Stack flex={1}>
                    <Text fontSize="xl" fontWeight="bold" mb={0}>
                        Form Builder
                    </Text>
                    <HStack alignItems="baseline">
                        <Text fontSize="sm">
                            This form builder is experimental
                        </Text>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                setScheme(
                                    scheme ? (undefined as any) : dataWizards,
                                )
                            }
                        >
                            {scheme ? "Clear" : "Load"} Example
                        </Button>
                    </HStack>
                </Stack>
                <TabList as={Flex} flex={2}>
                    <Tab>Playground</Tab>
                    <Tab>Preview</Tab>
                    <Tab>Schema</Tab>
                </TabList>
            </HStack>
            <TabPanels bg="gray.50" p={0} m={0}>
                <TabPanel p={0}>
                    <Forms />
                </TabPanel>
                <TabPanel>
                    {scheme && scheme.data && (
                        <RenderFormComponent
                            formSchema={scheme as FormsShapes}
                            onHandleSubmit={() => {
                                console.log("submit");
                            }}
                        />
                    )}
                    {!scheme && (
                        <Stack justifyContent="center" alignItems="center">
                            <Text>Empty Schema</Text>
                        </Stack>
                    )}
                </TabPanel>
                <TabPanel>
                    <Stack h="full" overflow="scroll">
                        <CodeEditor
                            error={false}
                            value={JSON.stringify(scheme, null, 4)}
                            onSave={(d) =>
                                setScheme(d ? JSON.parse(d) : undefined)
                            }
                            background="white"
                        />
                    </Stack>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default MainBuilder;
