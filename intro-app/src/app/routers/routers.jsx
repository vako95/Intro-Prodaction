import { createBrowserRouter } from "react-router-dom";
import { MainLayout, SubLayout, AuthLayout, BlankLayout } from '@src/layouts';
import { AuthGuard, GuestGuard } from '@src/app/guards';
import {
    HomePage,
    AboutPage,
    GalleryPage,
    ContactPage,
    FaqPage,
    QuotePage,
    RoomPage,
    PricingPage,
    CartPage,
    CheckoutPage,
    OrderSuccessPage,
    TeamPage,
    PersonalDetailPage,
    LoginPage,
    RegisterPage,
    ResetPasswordPage,
    ChangePasswordPage,
    DebugPages,
    NotFoundPage,
    ProfilePage,
    ServicesPage,
    FacilitiesPage,
    AdvantagesBarPage,
    Maintenance,
    SwapDetailPage,

} from "@src/pages";
import RoomDetailsPage from "../../pages/main/RoomDetailPage/RoomDetailPage";
import NewsPage from "../../pages/main/NewsPage/NewsPage";
import NewsDetailPage from "../../pages/main/NewsDetailPage/NewsDetailPage";
import RoomsFiltered from "../../components/module/RoomsFiltered/RoomsFiltered.jsx";
import { SavedRooms } from "../../components/module/SavedRooms";
import { translations } from "../../lang/lang.js";

const getBreadcrumb = (key, lang = 'en') => {
    return translations.breadcrumbs[key]?.[lang] || key;
};

const router = createBrowserRouter([
    { path: "/", element: <MainLayout />, children: [{ index: true, element: <HomePage /> }] },
    {
        element: <SubLayout />,
        children: [
            {
                path: "/about",
                element: <AboutPage />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("about") }] },
            },
            {
                path: "/gallery",
                element: <GalleryPage />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("gallery") }] },
            },
            {
                path: "/personal",
                children: [
                    { 
                        index: true, 
                        element: <TeamPage />,
                        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "/personal", label: getBreadcrumb("team") }] }
                    },
                    {
                        path: ":slug",
                        element: <PersonalDetailPage />,
                        handle: {
                            breadcrumbs: (slug) => {
                                return [
                                    { path: "/", label: getBreadcrumb("home") },
                                    { path: "/personal", label: getBreadcrumb("team") },
                                    { path: "#", label: getBreadcrumb("teamMember") }
                                ];
                            }
                        }
                    },
                ],
            },
            {
                path: "faq",
                element: <FaqPage />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("faq") }] },
            },
            {
                path: "room",
                element: <RoomPage />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("rooms") }] },
            },
            {
                path: "rooms",
                element: <RoomsFiltered />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("availableRooms") }] },
            },
            {
                path: "rooms/:slug",
                element: <RoomDetailsPage />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "/rooms", label: getBreadcrumb("rooms") }, { path: "#", label: getBreadcrumb("roomDetails") }] },
            },
            {
                path: "services",
                element: <ServicesPage />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("services") }] },
            },
            {
                path: "facilities",
                element: <FacilitiesPage />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("facilities") }] },
            },
            {
                path: "advantages",
                element: <AdvantagesBarPage />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("advantagesBar") }] },
            },
            {
                path: "news",
                children: [
                    {
                        index: true,
                        element: <NewsPage />,
                        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "/news", label: getBreadcrumb("news") }] }
                    },
                    {
                        path: ":slug",
                        element: <NewsDetailPage />,
                        handle: {
                            breadcrumbs: () => [
                                { path: "/", label: getBreadcrumb("home") },
                                { path: "/news", label: getBreadcrumb("news") },
                                { path: "#", label: getBreadcrumb("newsDetail") }
                            ]
                        },
                    },
                ],
            },
            {
                path: "swap/:slug",
                element: <SwapDetailPage />,
                handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("swapDetails") }] },
            },
        ],
    },
    {
        path: "/auth",
        element: <GuestGuard><AuthLayout /></GuestGuard>,
        children: [
            { index: true, element: <LoginPage /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "reset", element: <ResetPasswordPage /> },
            { path: "reset/:token", element: <ChangePasswordPage /> },
        ]
    },
    {
        path: "/contact", element: <SubLayout />,
        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("contact") }] },
        children: [
            { index: true, element: <ContactPage /> }
        ]
    },
    {
        path: "/pricing", element: <SubLayout />,
        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("pricingPlan") }] },
        children: [
            { index: true, element: <PricingPage /> }
        ]
    },
    {
        path: "/cart", element: <SubLayout />,
        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("cart") }] },
        children: [
            { index: true, element: <AuthGuard><CartPage /></AuthGuard> }
        ]
    },
    {
        path: "/checkout", element: <SubLayout />,
        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "/cart", label: getBreadcrumb("cart") }, { path: "#", label: getBreadcrumb("checkout") }] },
        children: [
            { index: true, element: <AuthGuard><CheckoutPage /></AuthGuard> }
        ]
    },
    {
        path: "/order-success", element: <SubLayout />,
        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "/cart", label: getBreadcrumb("cart") }, { path: "#", label: getBreadcrumb("orderSuccess") }] },
        children: [
            { index: true, element: <AuthGuard><OrderSuccessPage /></AuthGuard> }
        ]
    },
    {
        path: "/quote", element: <SubLayout />,
        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("quote") }] },
        children: [
            { index: true, element: <QuotePage /> }
        ]
    },
    {
        path: "/profile", element: <SubLayout />,
        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("profile") }] },
        children: [
            { index: true, element: <AuthGuard><ProfilePage /></AuthGuard> }
        ]
    },
    {
        path: "/saved-rooms", element: <SubLayout />,
        handle: { breadcrumbs: () => [{ path: "/", label: getBreadcrumb("home") }, { path: "#", label: getBreadcrumb("savedRooms") }] },
        children: [
            { index: true, element: <AuthGuard><SavedRooms /></AuthGuard> }
        ]
    },
    {
        element: <BlankLayout />,
        children: [
            {
                path: "/maintenance",
                element: <Maintenance />
            },
            {
                path: "/debug",
                element: <DebugPages />,
                handle: {
                    breadcrumbs: () => [
                        { path: "/", label: getBreadcrumb("home") },
                        { path: "#", label: getBreadcrumb("debug") }
                    ]
                }
            }
        ]
    },
    {
        path: "*",
        element: <SubLayout />,
        handle: {
            breadcrumbs: () => [
                { path: "/", label: getBreadcrumb("home") },
                { path: "#", label: getBreadcrumb("pageNotFound") }
            ]
        },
        children: [
            { index: true, element: <NotFoundPage /> }
        ]
    }
]);

export default router;
