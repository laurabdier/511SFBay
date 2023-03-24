import React, {useEffect, useState} from 'react'
import {token} from "./HomePage";
import _ from "lodash";
import {Polyline} from "react-leaflet/Polyline";
import LineStopMarker from "./LineStopMarker";

const TransportLines = ({selectedOperatorId, selectedLineId,}) => {
    const [orderedLineStops, setOrderedLineStops] = useState({})

    useEffect(() => {
        (async () => {
            let patternPointsById = {}
            let stopsById = {}

            // call line pattern
            const patternResponse = await fetch(`https://api.511.org/transit/patterns?api_key=${token}&operator_id=${selectedOperatorId}&line_id=${selectedLineId}`)
            if (patternResponse.ok) {
                const patternData = await patternResponse.json()
                const allPatternPoints = patternData.journeyPatterns[0].PointsInSequence.TimingPointInJourneyPattern.concat(patternData.journeyPatterns[0].PointsInSequence.StopPointInJourneyPattern)
                patternPointsById = (_.keyBy(allPatternPoints, point => point.ScheduledStopPointRef))
            }

            // call line stops
            const stopsResponse = await fetch(`https://api.511.org/transit/stops?api_key=${token}&operator_id=${selectedOperatorId}&line_id=${selectedLineId}`)
            if (stopsResponse.ok) {
                const stopsData = await stopsResponse.json()
                const {ScheduledStopPoint} = stopsData.Contents.dataObjects
                stopsById = (_.keyBy(ScheduledStopPoint, stop => stop.id))
            }

            const lineDataById = _.merge(patternPointsById, stopsById)
            const filteredLineStops = _.pickBy(lineDataById, point => !!point.Order)
            setOrderedLineStops(_.sortBy(filteredLineStops, stop => parseInt(stop.Order)))
        })()

    }, [selectedOperatorId, selectedLineId])

    if (Object.keys(orderedLineStops).length === 0) {
        return null
    }

    const polyLinePositions = Object.values(orderedLineStops).map(stop => [
        parseFloat(stop.Location.Latitude),
        parseFloat(stop.Location.Longitude)
    ])

    return <>
        <Polyline
            pathOption={{color: 'lime'}}
            positions={polyLinePositions}
        />
        {Object.values(orderedLineStops).map((stop, i) => <LineStopMarker
            key={i}
            selectedOperatorId={selectedOperatorId}
            stop={stop}
        />)}
    </>
}

export default TransportLines