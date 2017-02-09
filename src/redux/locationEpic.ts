import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { gotUserPosition } from './actions';
import * as types from './actiontypes';
import { Action } from 'redux-actions';

export const getLocationEpic: Epic<Action<{}>, { wordsList: string[] }> = action$ => action$
    .ofType(types.INIT)
    .mergeMap(a => Observable.from(new Promise(resolve => {
        const onPosition: PositionCallback = (pos) => {
            const location:Position = {
                coords: {
                    accuracy:pos.coords.accuracy,
                    altitude:pos.coords.altitude,
                    latitude:pos.coords.latitude,
                    longitude:pos.coords.longitude,
                    altitudeAccuracy:pos.coords.altitudeAccuracy,
                    heading:pos.coords.heading,
                    speed:pos.coords.speed
                },
                timestamp: pos.timestamp
            }
            resolve(location);
        }
        const onPositionError: PositionErrorCallback = (params) => {
            const defaultPosition:Position = {
                coords: {
                    accuracy:999999,
                    altitude:10,
                    latitude:17.5422759,
                    longitude:-149.8260742,
                    altitudeAccuracy:null,
                    heading:null,
                    speed:0
                },
                timestamp: Date.now()
            }
            resolve(defaultPosition);
        }
        navigator.geolocation.getCurrentPosition(onPosition, onPositionError)
    })))
    .map((position:Position) => gotUserPosition(position));