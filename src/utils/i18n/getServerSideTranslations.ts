import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import NextI18nConfig from "../../../i18n";

export const getServerSideTranslations = async (
    locale: string,
    localeGroup: string[],
) =>
    await serverSideTranslations(locale as string, localeGroup, NextI18nConfig);
