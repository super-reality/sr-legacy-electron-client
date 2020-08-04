import {v4 as uuidv4} from "uuid";

export const ALERT_STATUS_SUCCESS = "SUCCESS";
export const ALERT_STATUS_ERROR = "ERROR";
export const ALERT_STATUS_WARNING = "WARNING";
export const ALERT_STATUS_INFO = "INFO";

export const ALERT_RECEIVED = "ALERT_RECEIVED";
export const receiveAlert = (status, message) => ({type: ALERT_RECEIVED, payload: {id: uuidv4(), status, message}});

export const ALERT_DISMISSED = "ALERT_DISMISSED";
export const dismissAlert = alertId => ({type: ALERT_DISMISSED, payload: {id: alertId}});
