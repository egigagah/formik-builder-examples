import { Flex, Stack, StackProps } from "@chakra-ui/react";
import useFormContextBuilder from "@form-builder/src/hooks/useFormContextBuilder";
import { FormsShapes } from "@form-builder/src/types";
import { FC } from "react";
import SmartDragnDrop from "./SmartDragnDrop";

const DragnDropWrapper: FC<StackProps> = (props): JSX.Element => {
    const { scheme, selected } = useFormContextBuilder<FormsShapes>();

    return (
        <Stack {...props}>
            {scheme && scheme.data && (
                <Flex flex={1} flexDirection="column" px={4} py={2}>
                    <SmartDragnDrop datas={scheme} selected={selected} />
                </Flex>
            )}
        </Stack>
    );
};

export default DragnDropWrapper;
