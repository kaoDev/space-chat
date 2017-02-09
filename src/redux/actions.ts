import { createAction } from 'redux-actions';
import * as types from './actiontypes';

export const gotWord = createAction(types.GOT_WORD, (payload: string) => payload);
export const space = createAction(types.SPACE, (payload: string) => payload);
export const init = createAction(types.INIT);
export const signedIn = createAction(types.FIREBASE_SIGNIN);
export const inputChanged = createAction(types.INPUT_CHANGED, (payload: string) => payload);
export const gotUserPosition = createAction(types.GOT_USER_LOCATION, (payload: Position) => payload);