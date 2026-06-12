import { useCallback, useMemo } from "react";

const usePagination = ({
    total,
    siblings,
    boundaries,
    page,
    initialPage,
    onChange
}) => {
    const first = useCallback(() => {
        onChange?.(1);
    }, [onChange]);

    const previous = useCallback(() => {
        onChange?.(Math.max(page - 1, initialPage));
    }, [page, initialPage, onChange]);

    const next = useCallback(() => {
        onChange?.(Math.min(page + 1, total));
    }, [page, total, onChange]);

    const last = useCallback(() => {
        onChange?.(total);
    }, [total, onChange]);

    const range = useMemo(() => {
        const items = [];

        let lastWasEllipsis = false;

        const leftBound = page <= boundaries
            ? ((boundaries * 2) - 1)
            : boundaries;

        const rightBound = page >= (total - boundaries)
            ? total - ((boundaries * 2) - 1)
            : total - boundaries;

        for (let idx = initialPage; idx <= total; idx++) {
            const inLeftBoundary = idx <= leftBound;
            const inRightBoundary = idx > rightBound;
            const inSiblingRange = idx >= (page - siblings)
                && idx <= page + siblings;

            if (inLeftBoundary || inRightBoundary || inSiblingRange) {
                items.push(idx);
                lastWasEllipsis = false;
            }
            else if (!lastWasEllipsis) {
                items.push("dots");
                lastWasEllipsis = true;
            }
        }

        return items;
    }, [total, siblings, boundaries, page, initialPage]);

    return {
        first: first,
        previous: previous,
        next: next,
        last: last,
        range: range
    };
};

export default usePagination;
