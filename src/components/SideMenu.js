import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPersonDigging} from '@fortawesome/free-solid-svg-icons'
import {Tooltip, Select} from 'antd'
import {token} from "./HomePage";
import _ from "lodash";
import {getTransitLineIcon} from "../utils/utils";

const {Option} = Select


const SideMenuContainer = styled.div`
  background-color: #fff;
  position: absolute;
  margin-top: 10px;
  margin-left: 50px;
  display: flex;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  background-clip: padding-box;
  z-index: 2;
  cursor: pointer;
`

const IconContainer = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.selected ? '#DAF7A6' : '#FFFFFF'};
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 8px;
`

const SelectsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`

const SideMenu = ({
                      showEvents,
                      setShowEvents,
                      selectedOperatorId,
                      setSelectedOperaorId,
                      selectedLineId,
                      setSelectedLineId
                  }) => {
    const [operators, setOperators] = useState([])
    const [lines, setLines] = useState([])

    useEffect(() => {
        (async() => {
            const operatorsResponse = await fetch(`https://api.511.org/transit/gtfsoperators?api_key=${token}`)
            if (operatorsResponse.ok) {
                const operatorsData = await operatorsResponse.json()
                setOperators(operatorsData)
            }
        })()
    }, [])

    useEffect(() => {
        if (!selectedOperatorId) {
            return
        }

        (async () => {
            const linesResponse = await fetch(`https://api.511.org/transit/lines?api_key=${token}&operator_id=${selectedOperatorId}`)
            if (linesResponse.ok) {
                const linesData = await linesResponse.json()
                setLines(_.groupBy(linesData, line => line.TransportMode))
            }
        })()
    }, [selectedOperatorId])

    if (operators.length === 0) {
        return null
    }

    return <SideMenuContainer>
        <Tooltip placement="bottom" title={`Show events`}>
            <IconContainer
                onClick={() => setShowEvents(!showEvents)}
                selected={showEvents}
            >
                <FontAwesomeIcon icon={faPersonDigging}/>
            </IconContainer>
        </Tooltip>
        <IconContainer style={{width: 'fit-content'}}>
            <Select
                style={{width: 200}}
                onChange={(value) => setSelectedOperaorId(value)}
                placeholder={'Select operator'}
                bordered={false}
            >
                {operators.map((operator, i) => (<Option key={i} value={operator.Id}>
                    {operator['Name']}
                </Option>))}
            </Select>
        </IconContainer>

        {Object.keys(lines).length > 0 && <SelectsContainer>
            {Object.keys(lines).map((lineKey, i) => {


                return (<IconContainer key={i} style={{width: 'fit-content'}}>
                    <FontAwesomeIcon icon={getTransitLineIcon(lineKey)}/>
                    <Select
                        style={{width: 180}}
                        onChange={(value) => setSelectedLineId(value)}
                        placeholder={`Select ${lineKey} line`}
                        bordered={false}
                        value={selectedLineId}
                    >
                        {lines[lineKey].map((line, i) => {
                            return (<Option key={i} value={line.Id} label={line['Name']}>
                                {line['Name'] || 'No name'}
                            </Option>)
                        })}
                    </Select>
                </IconContainer>)
            })}
        </SelectsContainer>}
    </SideMenuContainer>
}

export default SideMenu