import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import { fireBasePullEpic, fireBasePushEpic, fireBaseSignIn } from './firebaseEpics';
import { getLocationEpic } from './locationEpic';
import { wordsList, input, location } from './reducer';

export const rootEpic = combineEpics<any, any>(
    fireBaseSignIn,
    fireBasePullEpic,
    fireBasePushEpic,
    getLocationEpic
);

export const rootReducer = combineReducers({
    wordsList,
    input,
    location
});

const epicMiddleware = createEpicMiddleware(rootEpic);

export function configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(rootReducer,
        composeEnhancers(
            applyMiddleware(epicMiddleware)
        )
    );

    return store;
}