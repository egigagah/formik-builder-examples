import {
    Box,
    Button,
    ButtonGroup,
    Divider,
    HStack,
    IconButton,
    Stack,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import React, { memo, useEffect, useId, useState } from "react";
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
} from "react-beautiful-dnd";
import CardsComponent from "./Cards";
import {
    breakObjectReference,
    findSchemeByIdMemoize,
} from "@form-builder/src/utils";
import {
    RiAddFill,
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiSubtractFill,
} from "react-icons/ri";
import useFormContextBuilder from "@form-builder/src/hooks/useFormContextBuilder";
import { FormsShapes } from "@form-builder/src/types";

export type SmartDragnDrop = {
    datas: any;
    selected: any;
    type?: string;
};

const SmartDragnDropComponent: React.FC<SmartDragnDrop> = ({
    datas,
    selected,
    type,
}): JSX.Element => {
    const [collapse, setCollapse] = useState(false);
    const { scheme, editData, setSelected, setScheme } =
        useFormContextBuilder<FormsShapes>();
    const randomId = useId();
    function reorderArr(list: any[], startIndex: number, endIndex: number) {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    function onDragEnd(result: DropResult) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = source.droppableId;
        const dInd = destination.droppableId;
        // const newState = [...scheme?.data];

        const sObj = findSchemeByIdMemoize(datas, sInd);
        const dObj = findSchemeByIdMemoize(datas, dInd);

        // // console.log(source, destination);

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )
            return;

        if (sInd === dInd) {
            // same parent
            // do swap value
            if (Math.abs(source.index - destination.index) === 1)
                swap(source.index, destination.index, sObj.data);
            else {
                // const rmvd = sObj.data.splice("", )
                sObj.data = reorderArr(
                    sObj.data,
                    source.index,
                    destination.index,
                );
            }
            // setScheme(datas);
        } else {
            const sArr = sObj.data;
            const dArr = dObj.data;
            const data = sArr.splice(source.index, 1);
            if (destination.index === 0) dArr.unshift(...data);
            else if (destination.index === dArr.length) dArr.push(...data);
            else {
                const rest = dArr.length - destination.index;
                const restArr = dArr.splice(destination.index, rest);
                dArr.push(...data.concat(restArr));
            }
        }

        setScheme(scheme as FormsShapes);
    }

    const swap = (i: any, j: any, arr: any[]) => {
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    };

    const getItemStyle = (isDragging: any, draggableStyle: any) => ({
        // some basic styles to make the items look a bit nicer
        userSelect: "none",

        // change background colour if dragging
        background: isDragging ? "#C3DBD9" : "transparent",

        // styles we need to apply on draggables
        ...draggableStyle,
    });

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {/* <Accordion allowMultiple> */}
            <Droppable
                key={datas.id ?? randomId}
                droppableId={`${datas.id ?? randomId}`}
                type={type ?? datas.id}
            >
                {(provided) => (
                    <Box ref={provided.innerRef} w="full">
                        <Box
                            key={datas.id}
                            w="full"
                            bg={
                                !editData && selected?.id === datas?.id
                                    ? "gray.100"
                                    : "gray.50"
                            }
                            shadow={
                                !editData && selected?.id === datas?.id
                                    ? "dark-lg"
                                    : "none"
                            }
                            rounded="lg"
                            border=".5px solid #bfbfbf"
                        >
                            <HStack
                                px={4}
                                py={2}
                                justifyContent="space-between"
                            >
                                <Text fontWeight="bold" mb={0}>
                                    {datas.title} Wrapper
                                </Text>
                                <ButtonGroup isAttached>
                                    <Tooltip label={collapse ? "open" : "hide"}>
                                        <IconButton
                                            aria-label={"collapse"}
                                            variant="ghost"
                                            size="sm"
                                            icon={
                                                collapse ? (
                                                    <RiArrowDownSLine
                                                        size={20}
                                                    />
                                                ) : (
                                                    <RiArrowUpSLine size={20} />
                                                )
                                            }
                                            onClick={() =>
                                                setCollapse(!collapse)
                                            }
                                        />
                                    </Tooltip>
                                    {selected?.id !== datas?.id && (
                                        <Tooltip label="Add Data">
                                            <IconButton
                                                aria-label="add"
                                                size="sm"
                                                variant="ghost"
                                                icon={<RiAddFill size={20} />}
                                                onClick={() =>
                                                    setSelected(datas)
                                                }
                                            />
                                        </Tooltip>
                                    )}
                                    {selected?.id === datas?.id && (
                                        <Tooltip label="Cancel Add Data">
                                            <IconButton
                                                aria-label="add"
                                                size="sm"
                                                variant="ghost"
                                                icon={
                                                    <RiSubtractFill size={20} />
                                                }
                                                onClick={() =>
                                                    setSelected(undefined)
                                                }
                                            />
                                        </Tooltip>
                                    )}
                                </ButtonGroup>
                            </HStack>
                            {!collapse && (
                                <>
                                    <Divider />
                                    <Stack
                                        spacing={2}
                                        minH="max-content"
                                        px={4}
                                        py={2}
                                    >
                                        {datas.data?.map(
                                            (item: any, idx: number) => (
                                                <Draggable
                                                    key={`${item.id}-${idx}`}
                                                    draggableId={`${item.id}`}
                                                    index={idx}
                                                >
                                                    {(provided, snapshot) => (
                                                        <Box
                                                            bg={
                                                                editData?.id ===
                                                                    item?.id &&
                                                                !selected
                                                                    ? "green.50"
                                                                    : !item.as
                                                                    ? "gray.100"
                                                                    : "white"
                                                            }
                                                            shadow={
                                                                editData?.id ===
                                                                    item?.id &&
                                                                !selected
                                                                    ? "dark-lg"
                                                                    : "none"
                                                            }
                                                            rounded="lg"
                                                            border={
                                                                !item.as
                                                                    ? ".5px solid #bfbfbf"
                                                                    : "none"
                                                            }
                                                        >
                                                            <CardsComponent
                                                                datas={{
                                                                    item,
                                                                    idx,
                                                                    parentId:
                                                                        datas.id,
                                                                }}
                                                                ref={
                                                                    provided.innerRef
                                                                }
                                                                {...provided.draggableProps}
                                                                // {...provided.dragHandleProps}
                                                                datasProvided={
                                                                    provided
                                                                }
                                                                w="full"
                                                                // borderTop="1px solid grey"
                                                                rounded="lg"
                                                                style={getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided
                                                                        .draggableProps
                                                                        .style,
                                                                )}
                                                            />
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            ),
                                        )}
                                    </Stack>
                                </>
                            )}
                        </Box>
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
    );
};

const SmartDragnDrop = memo(
    SmartDragnDropComponent,
    // (prevProp, nextProp) =>
    //     prevProp.datas !== nextProp.datas &&
    //     prevProp.selected !== nextProp.selected,
);

export default SmartDragnDrop;
