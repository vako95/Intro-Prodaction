import { useEffect } from 'react';

export const useBreadcrumbTitle = (title) => {
    useEffect(() => {
        if (title) {
            window.dispatchEvent(new CustomEvent('breadcrumb-title-update', {
                detail: title
            }));
        }
    }, [title]);
};
