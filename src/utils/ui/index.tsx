import { createStandaloneToast } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

export const showToast = ({
    message,
    type,
}: {
    message: string;
    type: "error" | "success" | "warning";
}): string | number | undefined => {
    return toast({
        title: message,
        status: type,
        position: "top-right",
        isClosable: true,
    });
};
