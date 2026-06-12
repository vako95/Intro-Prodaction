
import { ModalContainer, PlayerButton, VideoPlayer } from "@components/ui";
import { IconMirror } from "@components/animation";
import { useState, useEffect } from "react";

import { FaPlay } from "react-icons/fa";
import { AnimationShine } from "@components/animation"
import { slicetext } from "@utils";
import "./Hero.css";


const Hero = ({ item }) => {

    const [openPlayer, setOpenPlayer] = useState(false);

    const handlePlayer = () => {
        setOpenPlayer((prev) => !prev);
    };
    useEffect(() => {
        if (openPlayer) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
        return () => document.body.classList.remove("overflow-hidden");
    }, [openPlayer]);

    return (
        <div className="section__hero">
            <div className="section__hero-backdrop"  >
                <div className="div-block" style={{
                    backgroundImage: `url(${item?.cover_img})`
                }}
                >

                </div>
                <div className="section__hero-video" onClick={handlePlayer}>
                    <PlayerButton size="md">
                        <span className="section__hero-video-icon">
                            <FaPlay />
                        </span>
                    </PlayerButton>

                    <ModalContainer isOpen={openPlayer}>
                        {item?.videos?.[0]?.video && (
                            <VideoPlayer size="lg" videoId={item?.videos?.[0]?.video} />
                        )}
                    </ModalContainer>
                </div>

                <IconMirror className="section__hero-heading-icon-mirror">
                    <div className="section__hero-heading">
                        <div className="section__hero-heading-cover">
                            <img className="anime-mirror section__hero-heading-icon" src={item?.card_icon} alt="" />
                        </div>
                        <div className="section__hero-heading-wrapper">
                            <h5 className="section__hero-heading-title">{item?.title}</h5>
                            <span className="section__hero-heading-content"
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={item.description}
                            >
                                {slicetext(item.description, 124)}
                            </span>
                        </div>
                    </div>
                </IconMirror>

                <div className="section__hero-card">
                    <AnimationShine
                        variant="incline"
                    >
                        <img src={item?.card_image} className="section__hero-card-cover" alt="" />
                    </AnimationShine>
                </div>
            </div>

        </div >
    )
}

export default Hero;