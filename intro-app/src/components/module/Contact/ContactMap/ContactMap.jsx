import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function ContactMap({ center = [49.82883763843378, 40.38539251517137] }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/streets/style.json?key=rDwQTZpUlrIFf99fawEg`,
            center: center,
            zoom: 12
        });

        new maplibregl.Marker()
            .setLngLat(center)
            .addTo(map);
        
        map.addControl(new maplibregl.NavigationControl(), "top-right");
        
        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setCenter(center);
        }
    }, [center]);

    return <div className='contact__map' ref={mapContainer} style={{ width: '100%', height: '400px' }} />;
}

export default ContactMap;
