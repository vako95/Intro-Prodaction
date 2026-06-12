import { Fragment } from "react";
import Manager from "../../state/Manager/Manager.jsx";
import Skeleton from "../../state/Skeleton/Skeleton.jsx";
import { useLang } from "@hooks/useLang";

const DataList = ({
    query,
    renderItem,
    skeletonCount = 3,
    skeletonProps,
    skeletonCustom,
    emptyTitle,
    emptyMessage,
    errorTitle,
    errorMessage,
    wrapper: Wrapper = Fragment,
    skeletonWrapper: SkeletonWrapper = Fragment,
    className,
    ...wrapperProps
}) => {
    const { getTranslate } = useLang();
    
    // Use translations as defaults if not provided
    const defaultEmptyTitle = emptyTitle || getTranslate("dataList", "noData");
    const defaultEmptyMessage = emptyMessage || getTranslate("dataList", "noItemsFound");
    const defaultErrorTitle = errorTitle || getTranslate("dataList", "error");
    const defaultErrorMessage = errorMessage || getTranslate("dataList", "failedToLoadData");
    const { data, isLoading, isError } = query;

    const defaultSkeleton = skeletonProps ? (
        <Skeleton {...skeletonProps} />
    ) : (
        Array.from({ length: skeletonCount }).map((_, idx) => (
            <Skeleton key={idx} as="div" count={1} className="skeleton-item" />
        ))
    );

    return (
        <Manager
            isLoading={isLoading}
            isError={isError}
            items={data}
            skeletonCustom={skeletonCustom || defaultSkeleton}
            skeletonWrapper={SkeletonWrapper}
            unavailableProps={{
                title: defaultErrorTitle,
                message: defaultErrorMessage
            }}
            emptyProps={{
                title: defaultEmptyTitle,
                message: defaultEmptyMessage
            }}
            renderWrapper={Wrapper}
            renderMap={renderItem}
            className={className}
            {...wrapperProps}
        />
    );
};

export default DataList;
