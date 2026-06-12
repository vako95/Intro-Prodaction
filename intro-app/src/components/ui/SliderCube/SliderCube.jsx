import { Swiper } from 'swiper/react';
import { EffectCreative, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';


const SliderCube = ({ children }) => {
    return (
        <div className="slider-cube">
            <div className="slider__container">
                <Swiper
                    spaceBetween={30}
                    pagination={{
                        clickable: true,
                    }}


                    modules={[Pagination]}
                >
                    {children}
                </Swiper>
            </div>
        </div>
    );
};

export default SliderCube;
