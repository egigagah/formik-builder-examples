import {
    Badge,
    Box,
    BoxProps,
    forwardRef,
    HStack,
    IconButton,
    Stack,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import useFormContextBuilder from "@form-builder/src/hooks/useFormContextBuilder";
import { FormsShapes } from "@form-builder/src/types";
import { removeObjectScheme } from "@form-builder/src/utils";
import React from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { FaGripVertical } from "react-icons/fa";
import { PopoverConfirmation } from "../builder";
import SmartDragnDrop from "./SmartDragnDrop";

export interface CardsComponentProps extends BoxProps {
    datas: {
        item: any;
        idx: number;
        parentId?: string;
    };
    datasProvided: any;
}

const CardsComponent = forwardRef<CardsComponentProps, "div">(
    ({ datas, datasProvided, ...rest }, ref): JSX.Element => {
        const { scheme, selected, editData, setEdit, setScheme } =
            useFormContextBuilder<FormsShapes>();
        const { item, idx, parentId } = datas;

        const onEdit = (d: any) => {
            const data = { ...d };
            data.refId = parentId;
            setEdit(data);
        };

        const onDelete = (ids: string) => {
            setScheme(removeObjectScheme(scheme, ids, parentId));
        };

        return (
            <Box ref={ref} {...rest}>
                {/* <HStack w="full"> */}
                <Stack spacing={2} w="full">
                    <HStack justifyContent="space-between" px={4} pt={2}>
                        <Badge
                            colorScheme={item?.as ? "blackAlpha" : "teal"}
                            variant="outline"
                            fontSize="sm"
                            rounded="md"
                            px={2}
                        >
                            {item?.as
                                ? `Layout ${item?.as}`
                                : `${item.type} Field`}
                        </Badge>
                        <Box>
                            <Tooltip label="Edit Data">
                                <IconButton
                                    size="sm"
                                    aria-label="Edit Data"
                                    variant="ghost"
                                    colorScheme="blackAlpha"
                                    onClick={() =>
                                        onEdit(
                                            !editData ||
                                                editData?.id !== item.id
                                                ? item
                                                : undefined,
                                        )
                                    }
                                    icon={<AiFillEdit size={15} />}
                                />
                            </Tooltip>
                            <Tooltip label="Delete Data">
                                <PopoverConfirmation
                                    action={() => onDelete(item.id)}
                                    message={`Are you sure to delete ${
                                        item.label ?? item.title
                                    } ${
                                        item?.as
                                            ? `Layout ${item?.as}`
                                            : "Field"
                                    }?`}
                                >
                                    <IconButton
                                        size="sm"
                                        aria-label="Delete Data"
                                        variant="ghost"
                                        colorScheme="blackAlpha"
                                        icon={<AiFillDelete size={15} />}
                                    />
                                </PopoverConfirmation>
                            </Tooltip>
                            <Tooltip label="Drag This">
                                <IconButton
                                    id={item.id}
                                    size="sm"
                                    aria-label="Drag"
                                    variant="ghost"
                                    colorScheme="blackAlpha"
                                    {...datasProvided?.dragHandleProps}
                                    icon={<FaGripVertical size={15} />}
                                />
                            </Tooltip>
                        </Box>
                    </HStack>
                    <Stack px={4} pb={2} fontSize="xs" fontWeight="medium">
                        <Text m={0}>ID: {item.id}</Text>
                        <Text m={0}>Name: {item.label ?? item.title}</Text>
                        {!item.as && <Text m={0}>Type: {item.type}</Text>}
                    </Stack>
                    {item.as && (
                        <SmartDragnDrop
                            type={`${item.id}-${idx}`}
                            datas={item}
                            selected={selected}
                        />
                    )}
                </Stack>
                {/* </HStack> */}
            </Box>
        );
    },
);

export default CardsComponent;
