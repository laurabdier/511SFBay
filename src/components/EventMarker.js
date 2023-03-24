import React from 'react'
import {Marker, Popup} from "react-leaflet";
import {getEventIcon} from "../utils/utils";
import {Icon} from "leaflet/dist/leaflet-src.esm";
import {EVENT_ACTIVE} from "../utils/eventTypes";


const EventMarker = ({event}) => {
    const {event_type, event_subtypes, status, geography} = event

    if (status !== EVENT_ACTIVE) {
        return
    }

    const constructionIcon = new Icon({
        iconUrl: getEventIcon(event_type),
        iconSize: [30, 50],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    })

    return <Marker
        position={[
            geography.coordinates[1],
            geography.coordinates[0]
        ]}
        icon={constructionIcon}
    >
        <Popup>
            {event_subtypes.map(subType => <p>{subType}</p>)}
        </Popup>
    </Marker>
}

export default EventMarker