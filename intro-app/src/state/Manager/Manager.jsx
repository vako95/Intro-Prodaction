import { memo } from "react";
import Skeleton from "../Skeleton/Skeleton.jsx";
import Unavailable from "../Unavailable/Unavailable.jsx";

const Manager = ({
    isLoading,
    isError,
    emptyProps,
    items,
    skeletonProps,
    skeletonCustom,
    unavailableProps,
    skeletonWrapper,
    renderMap,
    renderWrapper,
    ...rest
}) => {

    const SkeletonWrapper = skeletonWrapper;
    const RenderWrapper = renderWrapper;

    if (isLoading) return (
        <SkeletonWrapper>
            {!skeletonProps ? (
                skeletonCustom
            ) : (
                <Skeleton {...skeletonProps} />
            )}
        </SkeletonWrapper>
    )
    if (isError) return <Unavailable {...unavailableProps} />;
    if (!items?.length) return <Unavailable {...emptyProps} />

    return <RenderWrapper {...rest} >
        {items?.map((item, index) => renderMap(item, index))}
    </RenderWrapper>

};

export default memo(Manager);
