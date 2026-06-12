import { useLang } from "../hooks/useLang";

const useNavbarNav = () => {
    const { getTranslate } = useLang();

    return [
        {
            id: 1,
            name: getTranslate("nav", "home"),
            link: "/",
            dropdown: []
        },
        {
            id: 2,
            name: getTranslate("nav", "pages"),
            link: "/pages",
            dropdown: [
                {
                    id: 21,
                    name: getTranslate("nav", "about"),
                    link: "/about"
                },
                {
                    id: 23,
                    name: getTranslate("nav", "gallery"),
                    link: "/gallery"
                },
                {
                    id: 26,
                    name: getTranslate("nav", "team"),
                    link: "/personal"
                },
                {
                    id: 25,
                    name: getTranslate("nav", "contact"),
                    link: "/contact"
                },
                {
                    id: 26,
                    name: getTranslate("nav", "services"),
                    link: "/services",

                },
                {
                    id: 27,
                    name: getTranslate("nav", "maintenance"),
                    link: "/maintenance",

                },
                {
                    id: 26,
                    name: getTranslate("nav", "pricingPlan"),
                    link: "/pricing"
                },
                {
                    id: 27,
                    name: getTranslate("nav", "quote"),
                    link: "/quote"
                },
                {
                    id: 28,
                    name: getTranslate("nav", "rooms"),
                    link: "/room"
                },
                {
                    id: 29,
                    name: getTranslate("nav", "faq"),
                    link: "/faq"
                }
            ]
        },
        {
            id: 3,
            name: getTranslate("nav", "services"),
            link: "/services",
            dropdown: []
        },
        {
            id: 4,
            name: getTranslate("nav", "roomsSuites"),
            link: "/rooms",
            dropdown: []
        },
        {
            id: 5,
            name: getTranslate("nav", "news"),
            link: "/news",
            dropdown: []
        }
    ];
};

const useFooterNav = () => {
    const { getTranslate } = useLang();

    return [
        {
            id: 1,
            name: getTranslate("nav", "home"),
            icon: "aim",
            link: "/",
        },
        {
            id: 2,
            icon: "aim",
            name: getTranslate("nav", "roomsSuites"),
            link: "/rooms",
        },
        {
            id: 3,
            icon: "aim",
            name: getTranslate("nav", "spaWellness"),
            link: "/spa",
        },
        {
            id: 4,
            icon: "aim",
            name: getTranslate("nav", "contact"),
            link: "/contact",
        },
        {
            id: 5,
            icon: "aim",
            name: getTranslate("nav", "aboutHotel"),
            link: "/about",
        },
        {
            id: 6,
            icon: "aim",
            name: getTranslate("nav", "contact"),
            link: "/contact",
        },
    ];
};

const navbarNav = [
    {
        id: 1,
        name: "HOME",
        link: "/",
        dropdown: []
    },
    {
        id: 2,
        name: "PAGES",
        link: "/pages",
        dropdown: [
            {
                id: 21,
                name: "About",
                link: "/about"
            },
            {
                id: 23,
                name: "Gallery",
                link: "/gallery"
            },
            {
                id: 26,
                name: "Team",
                link: "/team"
            },
            {
                id: 25,
                name: "Contact",
                link: "/contact"
            },
            {
                id: 26,
                name: "Services",
                link: "/services",

            },
            {
                id: 27,
                name: "Maintenance",
                link: "/maintenance",

            },
            {
                id: 26,
                name: "Pricing PLan",
                link: "/pricing"
            },
            {
                id: 27,
                name: "Quote",
                link: "/quote"
            },
            {
                id: 28,
                name: "Rooms",
                link: "/room"
            },
            {
                id: 29,
                name: "Faq",
                link: "/faq"
            }
        ]
    },
    {
        id: 3,
        name: "Services",
        link: "/services",
        dropdown: []
    },
    {
        id: 4,
        name: "ROOMS SUITES",
        link: "/rooms",
        dropdown: []
    },
    {
        id: 5,
        name: "NEWS",
        link: "/news",
        dropdown: []
    }
];


const footerNav = [
    {
        id: 1,
        name: "Home",
        icon: "aim",
        link: "/",
    },
    {
        id: 2,
        icon: "aim",
        name: "Rooms & Suites",
        link: "/rooms",
    },
    {
        id: 3,
        icon: "aim",
        name: "Spa & Wellness",
        link: "/spa",
    },
    {
        id: 4,
        icon: "aim",
        name: "Contact",
        link: "/contact",
    },
    {
        id: 5,
        icon: "aim",
        name: "About Hotel",
        link: "/about",
    },
    {
        id: 6,
        icon: "aim",
        name: "Contact",
        link: "/contact",
    },
];



export { navbarNav, footerNav, useNavbarNav, useFooterNav }