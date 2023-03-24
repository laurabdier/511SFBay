import React, {useRef, useState} from 'react'
import {CircleMarker, Popup} from "react-leaflet";
import {faPersonDigging, faSpinner} from '@fortawesome/free-solid-svg-icons'
import {token} from "./HomePage";
import styled from 'styled-components'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PopupScreen from "./PopupScreen";


const ColumnContainer = styled.div`
  display: flex;
  padding: 4px;
  flex-direction: column;
  gap: 8px;
`

const LineStopMarker = ({selectedOperatorId, stop}) => {
    const [loading, setLoading] = useState(true)
    const [stopDetail, setStopDetail] = useState(null)
    const markerPopupRef = useRef(null)
    const getStopData = async () => {
        const stopResponse = await fetch(`https://api.511.org/transit/stoptimetable?api_key=${token}&operatorref=${selectedOperatorId}&monitoringref=${stop.id}`)
        if (stopResponse.ok) {
            const stopData = await stopResponse.json()
            setStopDetail(({
                ...stop,
                timeTable: stopData['Siri']['ServiceDelivery']['StopTimetableDelivery']['TimetabledStopVisit']}))
            setLoading(false)
            return
        }
        else {
            setStopDetail({error: 'This stop details are not available'})
            setLoading(false)
            setTimeout(() => {
                if (!markerPopupRef.current) return
                markerPopupRef.current.close()
            }, 3000)
        }
    }

    return <CircleMarker
        center={[
            parseFloat(stop.Location.Latitude),
            parseFloat(stop.Location.Longitude)
        ]}
        radius={2}
        eventHandlers={{
            click:  () => getStopData()
        }}
    >
        <Popup ref={markerPopupRef} style={{width: 200}}>
            {loading
                ? <FontAwesomeIcon icon={faSpinner}/>
                : stopDetail.error
                    ? <p>{stopDetail.error}</p>
                    : <PopupScreen stop={stopDetail} />


                    /*<table>
                        {console.log('check detail :', stopDetail)}
                <tr>
                    <td>Bus stop</td>
                    <td>NAME</td>
                </tr>
                <tr>
                    <td>Bus line</td>
                    <td>NAME</td>
                </tr>
                <tr>
                    <td style={{display: 'block', justifyContent: 'flex-start'}}>Bus stop</td>
                    <td>
                        <ColumnContainer style={{padding: 0}}>
                            <div>16h30</div>
                            <div>16h30</div>
                            <div>16h30</div>
                        </ColumnContainer>
                    </td>
                </tr>
            </table>*/

            }
        </Popup>
    </CircleMarker>
}

export default LineStopMarker