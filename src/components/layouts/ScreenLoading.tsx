import { Center, Flex, Spinner, Stack, Text } from "@chakra-ui/react";

export default function ScreenLoading({
    text = "Please Wait...",
}: {
    text?: string;
}): JSX.Element {
    return (
        <Flex
            flex={1}
            h="100vh"
            direction="column"
            bg="blackAlpha.200"
            justifyContent="center"
        >
            <Center as={Stack} spacing={4}>
                <Spinner size="lg" />
                <Text fontSize="xl">{text}</Text>
            </Center>
        </Flex>
    );
}
