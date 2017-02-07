import { RxFirebase } from 'rxfirebase';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';
import { WordEntry } from 'models/word';
import { gotWord, signedIn } from './actions';
import * as types from './actiontypes';
import { Action } from 'redux-actions';

const firebaseConfig = {
    apiKey: 'AIzaSyBe4Ci4VzptURuIWWFrV3xLqwemJkro9cM',
    authDomain: 'space-chat-f3b17.firebaseapp.com',
    databaseURL: 'https://space-chat-f3b17.firebaseio.com',
    storageBucket: 'space-chat-f3b17.appspot.com',
    messagingSenderId: '216536033724',
};

RxFirebase.initializeApp(firebaseConfig);

const signIn = Observable.from(RxFirebase.auth.signInAnonymously());
const wordsRef = RxFirebase.database.ref('/words');

type FirebaseWordWrapper = { value: string };

const words$: Observable<{ val: () => FirebaseWordWrapper }> = wordsRef.onChildAdded();



export const fireBaseSignIn: Epic<Action<{}>, { wordsList: string[] }> = action$ => action$
    .ofType(types.INIT)
    .mergeMap(a => signIn)
    .map(status => signedIn());

export const fireBasePullEpic: Epic<Action<string>, { wordsList: string[] }> = action$ => action$
    .ofType(types.FIREBASE_SIGNIN)
    .mergeMap(a => signIn)
    .mergeMap(a => words$)
    .map(word => {
        return gotWord(word.val().value);
    }
    );


export const fireBasePushEpic: Epic<Action<{}>, { wordsList: WordEntry[] }> = action$ => action$
    .ofType(types.SPACE)
    .map((spaceAction: Action<string>) => {
        wordsRef.push({ value: spaceAction.payload as string });
        return { type: types.PUSHED };
    });