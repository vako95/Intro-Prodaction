const CustomButton = () => {
    const { day, modifiers, ...buttonProps } = props;

    const { setSelected } = React.use(SelectedDateContext);
    return (
        <DayButton
            {...props}
            day={day}
            modifiers={modifiers}
            onClick={() => setSelected?.(undefined)}
            onDoubleClick={() => setSelected?.(day.date)}
        />
    );
}