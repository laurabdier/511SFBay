import React, {useEffect, useState} from 'react'
import {MapContainer, TileLayer} from 'react-leaflet'
import SideMenu from "./SideMenu";
import EventMarker from "./EventMarker";
import TransportLines from "./TransportLines";

export const token = '4ff6931f-2e87-4652-ba7e-b0bd5640f455'

const HomePage = ({}) => {
    const [trafficEvents, setTrafficEvents] = useState([])
    const [showEvents, setShowEvents] = useState(false)

    const [selectedOperatorId, setSelectedOperaorId] = useState(null)
    const [selectedLineId, setSelectedLineId] = useState(null)


    // call events for traffic data
    useEffect(() => {
        fetch(`https://api.511.org/traffic/events?api_key=${token}`)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(data => setTrafficEvents(data.events))
    }, [])

    return <div style={{height: '100%'}}>
        <SideMenu
            showEvents={showEvents}
            setShowEvents={setShowEvents}
            selectedOperatorId={selectedOperatorId}
            setSelectedOperaorId={setSelectedOperaorId}
            selectedLineId={selectedLineId}
            setSelectedLineId={setSelectedLineId}
        />

        <MapContainer style={{height: 1000, zIndex: 1}} center={[37.773, -122.431]} zoom={10} scrollWheelZoom={true}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {(trafficEvents.length > 0 && showEvents)
                && <>
                    {trafficEvents.map(trafficEvent => <EventMarker event={trafficEvent}/>)}
                </>}
            <TransportLines selectedLineId={selectedLineId} selectedOperatorId={selectedOperatorId}/>
        </MapContainer>
    </div>
}

export default HomePage
