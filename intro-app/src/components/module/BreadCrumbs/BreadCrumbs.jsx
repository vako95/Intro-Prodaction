import "./BreadCrumbs.css";

import { Link, useMatches, useLocation } from "react-router-dom";
import { useLang } from "@/hooks/useLang";
import { useEffect, useState } from "react";

const BreadCrumbs = () => {
    const matches = useMatches();
    const location = useLocation();
    const { getTranslate } = useLang();
    const [dynamicTitle, setDynamicTitle] = useState(null);

    useEffect(() => {
        const handleTitleUpdate = (event) => {
            setDynamicTitle(event.detail);
        };

        window.addEventListener('breadcrumb-title-update', handleTitleUpdate);
        
        setDynamicTitle(null);

        return () => {
            window.removeEventListener('breadcrumb-title-update', handleTitleUpdate);
        };
    }, [location.pathname]);

    const crumbs = matches.flatMap(match => {
        if (!match.handle || !match.handle.breadcrumbs) return [];
        return match.handle.breadcrumbs(match.params);
    });

    if (dynamicTitle && crumbs.length > 0) {
        crumbs[crumbs.length - 1] = {
            ...crumbs[crumbs.length - 1],
            label: dynamicTitle
        };
    }

    return (
        <nav className="breadcrumbs" aria-label={getTranslate("breadcrumbs", "ariaLabel")}>
            <div className="breadcrumbs-heading">
                <h5 className="breadcrumbs__title">
                    {crumbs[crumbs.length - 1]?.label}
                </h5>
            </div>

            <ol className="breadcrumbs__list">
                {crumbs.map((crumb, index) => {
                    return (
                        <li key={index} className="breadcrumbs__item">
                            <Link to={crumb.path} className="breadcrumbs__item-link">
                                {crumb.label}
                            </Link>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default BreadCrumbs;
