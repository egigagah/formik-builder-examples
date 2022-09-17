export interface CustomAppElement {
    (): JSX.Element;
    appProps?: CustomAppProps;
}

export type CustomAppProps = {
    Layout?: any;
    Protected?: boolean;
    Permission?: string[];
};

export type RoleType = {
    id: string;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    slug: string;
    pivot: {
        model_id: string;
        role_id: string;
        model_type: string;
    };
};

export type UserType = {
    id: string;
    name: string;
    email: string;
    email_verified_at: null;
    password: string;
    remember_token: null | string;
    created_at: string;
    updated_at: string;
    roles: RoleType[];
};

export type MenuType = {
    id: string;
    sort: string | number;
    label: string;
    parent: null;
    link: string;
    class: string;
    depth: number;
    path: string;
    actions: string[];
    children?: MenuType[];
};
