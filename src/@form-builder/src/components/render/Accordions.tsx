import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    AccordionProps,
    Box,
    Divider,
} from "@chakra-ui/react";
import SmartRender from "./SmartRender";

export interface AccordionLayoutProps extends AccordionProps {
    datas: any[];
}

const AccordionLayout: React.FC<AccordionLayoutProps> = ({
    datas,
    ...rest
}) => {
    return (
        <Accordion {...rest}>
            {datas &&
                datas.map((item, idx) => (
                    <AccordionItem key={item.id} border="none">
                        <AccordionButton>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                                {item.title}
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                        <Divider color="gray.200" />
                        <AccordionPanel>
                            <SmartRender datas={item} />
                        </AccordionPanel>
                    </AccordionItem>
                ))}
        </Accordion>
    );
};

export default AccordionLayout;
