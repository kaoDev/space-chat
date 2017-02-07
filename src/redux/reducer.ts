import { Reducer } from 'redux';
import { Action } from 'redux-actions';
import * as types from './actiontypes';

export const wordsList: Reducer<string[]> = (state: string[] = [], action: Action<string>) => {
    switch (action.type) {
        case types.GOT_WORD:
            return state.concat(action.payload as string);
        default:
            return state;
    }
};

export const input: Reducer<string> = (state: string = '', action: Action<any>) => {
    switch (action.type) {
        case types.INPUT_CHANGED:
            return action.payload as string;
        case types.SPACE:
            return '';
        default:
            return state;
    }
};