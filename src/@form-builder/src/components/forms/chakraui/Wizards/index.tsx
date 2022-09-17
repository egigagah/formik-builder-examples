import {
    Button,
    Divider,
    HStack,
    Stack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    TabsProps,
} from "@chakra-ui/react";
import SmartRender from "@form-builder/src/components/render/SmartRender";
import { FormsShapes } from "@form-builder/src/types";
import { useState } from "react";

interface WizardFormProps extends TabsProps {
    datas: FormsShapes[];
}

const WizardForm = ({ datas, ...rest }: WizardFormProps): JSX.Element => {
    const [state, setState] = useState(0);

    return (
        <Stack bg="white" rounded="xl" p={2}>
            <Tabs {...rest} index={state} onChange={(d) => setState(d)}>
                <TabList>
                    {datas.map((tab, index) => (
                        <Tab key={index}>
                            {index + 1}. {tab.title}
                        </Tab>
                    ))}
                </TabList>
                <TabPanels>
                    {datas.map((tab, index) => (
                        <TabPanel key={index}>
                            <SmartRender datas={tab} />
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
            <HStack p={4} justifyContent="flex-end">
                <Button
                    disabled={state < 1}
                    onClick={() => setState(state - 1)}
                >
                    Prev
                </Button>
                <Button
                    disabled={state >= datas.length - 1}
                    onClick={() => setState(state + 1)}
                >
                    Next
                </Button>
            </HStack>
        </Stack>
    );
};

export default WizardForm;
