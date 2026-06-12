import { Container, SectionWrapper, DecoratedHeading } from "@components/ui";

import homeCover from "./assets/img/shape.png";


import BackdropContainer from "../../ui/BackdropContainer/BackdropContainer.jsx";
import AdvantagesBarList from "./components/AdvantagesBarList/AdvantagesBarList.jsx";
import { useAdvantagesBarQuery } from "../../../hooks/useAdvantagesBar.js";

import { Manager } from "../../../state/index.js";
import { useLang } from "@hooks/useLang";

import "./AdvantagesBar.css";
import AdvantagesBarItem from "./components/AdvantagesBarItem/AdvantagesBarItem.jsx";

const AdvantagesBar = () => {
    const { getTranslate } = useLang();
    const { data: advantagesBar, isLoading, isError } = useAdvantagesBarQuery();


    return (
        <BackdropContainer backdrop={homeCover} backdropWidth="60%" backdropHeight="100%" position="bottom" alt={getTranslate("advantages", "backgroundAlt")}>
            <Container>
                <div className="advantages-bar">
                    <div className="advantages-bar__heading">
                        <DecoratedHeading
                            title={getTranslate("advantages", "title")}
                            subtitle={getTranslate("advantages", "subtitle")}
                        />
                    </div>
                    <Manager
                        isLoading={isLoading}
                        isError={isError}
                        unavailableProps={{
                            title: getTranslate("messages", "error"),
                            message: getTranslate("messages", "noData"),
                        }}
                        emptyProps={{
                            title: getTranslate("messages", "noData"),
                            message: getTranslate("messages", "noData"),
                        }}
                        skeletonWrapper={AdvantagesBarList}
                        skeletonProps={{
                            as: "div",
                            count: 6,
                            className: "advantages-bar__skeleton"
                        }}
                        items={advantagesBar}
                        renderMap={(item) => (
                            <AdvantagesBarItem key={item.id || item.title} item={item} />
                        )}
                        renderWrapper={(props) => (
                            <AdvantagesBarList  {...props} />
                        )}
                    />
                </div>
            </Container>
        </BackdropContainer>
    )
}

export default AdvantagesBar;
