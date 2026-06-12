import LightGallery from 'lightgallery/react';;
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import lgAutoplay from 'lightgallery/plugins/autoplay';
import lgShare from 'lightgallery/plugins/share';
import 'lightgallery/css/lg-share.css';
import 'lightgallery/css/lg-autoplay.css';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css'
import "./HotelGallery.css";


const HotelGallery = ({ children }) => {

    return (
        <LightGallery
            className="gallery__card-box"
            speed={500}
            plugins={[lgThumbnail, lgZoom, lgAutoplay, lgShare]}
            autoplay={true}
            pause={4000}
            progressBar={true}
        >
            {children}
        </LightGallery>
    )
}

export default HotelGallery;