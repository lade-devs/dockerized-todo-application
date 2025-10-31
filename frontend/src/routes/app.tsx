import { RouteObject } from "react-router-dom";
import RouteType from "@/types/route-type";

import NotFound from "./not-found";
import Index from "@/pages/Index";

const guest_routes: RouteType[] = [
    { path: '/', element: <Index /> },
];

const middleware = () => {
    const GuestRoutes = guest_routes.map((route) => ({
        path: route.path,
        element: route.element
    }));

    return [...GuestRoutes, { path: '*', element: <NotFound /> }];
}

const AppRoutes: RouteObject[] = middleware();

export default AppRoutes
