import { Flex, HStack, IconButton, Stack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import Link from "next/link";
import { RiGithubFill } from "react-icons/ri";

export default function Layouts({ children }: PropsWithChildren): JSX.Element {
    return (
        <Flex
            flex={1}
            flexDirection="column"
            bg={["white", "gray.50"]}
            h="100vh"
        >
            {/* <Header>
                <Link href="/">
                    <a>Form Builder</a>
                </Link>
                <Link href="/?data=sample">
                    <a>Form Builder With Example</a>
                </Link>
            </Header> */}
            <Stack
                flex={1}
                justifyContent={["flex-start", "center"]}
                spacing={4}
                px={[4, 0]}
            >
                {children}
            </Stack>
        </Flex>
    );
}
