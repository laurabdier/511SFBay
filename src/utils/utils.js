import {TRANSPORT_BUS, TRANSPORT_FERRY, TRANSPORT_RAIL} from "./transportTypes";
import {faBusSimple, faFerry, faTrainSubway, faQuestion} from '@fortawesome/free-solid-svg-icons'
import construction from '../icons/constructions.svg'
import incident from '../icons/incident.svg'
import question from '../icons/question.svg'
import {EVENT_CONSTRUCTIONS, EVENT_INCIDENT} from "./eventTypes";

export const getEventIcon = (eventType) => {
    if (eventType === EVENT_CONSTRUCTIONS) return construction
    else if (eventType === EVENT_INCIDENT) return incident
    else return question
}

export const getTransitLineIcon = (type) => {
    if (type === TRANSPORT_BUS) return faBusSimple
    else if (type === TRANSPORT_FERRY) return faFerry
    else if (type === TRANSPORT_RAIL) return faTrainSubway
    else return faQuestion
}