import { Select } from "@chakra-ui/react";

export default function Language({
    translation,
    listItem,
    value,
    onToggleLang,
}: {
    translation: any;
    listItem: string[];
    value?: string;
    onToggleLang: (d: string) => void;
}): JSX.Element {
    return (
        <Select
            defaultValue={value}
            w="max-content"
            variant="unstyled"
            onChange={(d) => onToggleLang(d.target.value)}
            _hover={{ cursor: "pointer" }}
        >
            {listItem?.map((item, idx) => (
                <option key={idx} value={item}>
                    {translation(`language.short.${item}`)}
                </option>
            ))}
        </Select>
    );
}
