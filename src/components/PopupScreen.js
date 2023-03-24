import React from 'react'
import styled from 'styled-components'

const ColumnContainer = styled.div`
  display: flex;
  padding: 4px;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.td`
  font-weight: bold;
  width: auto;
`

const PopupScreen = ({ stop }) => {
      const stopNextDepartures = stop.timeTable.map(timePoint => {
        return timePoint.TargetedVehicleJourney.TargetedCall.AimedDepartureTime
     })

    return <table>
        <tr>
            <Title>Bus stop:</Title>
            <td>{stop.Name}</td>
        </tr>
        <tr>
            <Title>Destination:</Title>
            <td>{stop.DestinationDisplayView || 'Unknown'}</td>
        </tr>
        <tr>
            <Title style={{display: 'block', justifyContent: 'flex-start'}}>Next departures</Title>
            <td>
                <ColumnContainer style={{padding: 0}}>
                    {stopNextDepartures.length === 0
                        ? <div>Unknown</div>
                        : stopNextDepartures.slice(0, 4).map(departure => {
                        const departureTime = new Date(departure)
                        return (<div>
                            {`${departureTime.getHours()}h ${departureTime.getMinutes()}m`}
                        </div>)
                    })}
                </ColumnContainer>
            </td>
        </tr>
    </table>
}

export default PopupScreen