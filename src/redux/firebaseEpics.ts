import { RxFirebase } from 'rxfirebase';
import { Epic } from 'redux-observable';
import { Observable } from 'rxjs';
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
type FirebaseWordWrapper = { value: string, location: Position };
const wordsRef = RxFirebase.database.ref('words').afterSignIn();




const words$ = RxFirebase.database
    .ref('words')
    .afterSignIn()
    .orderByChild('location/timestamp')
    .startAt(Date.now() - 60000 * 60 * 24)
    .onChildAdded()
    .map((w: { val: () => FirebaseWordWrapper }) => w.val());



export const fireBaseSignIn: Epic<Action<{}>, { wordsList: string[] }> = action$ => action$
    .ofType(types.INIT)
    .mergeMap(a => signIn)
    .map(status => signedIn());

export const fireBasePullEpic: Epic<Action<string>, { wordsList: string[] }> = action$ => action$
    .ofType(types.FIREBASE_SIGNIN)
    .mergeMap(a => words$)
    .map(word => {
        return gotWord(word.value);
    }
    );


export const fireBasePushEpic: Epic<Action<{}>, { wordsList: string[], location: Position }> = (action$, middleWareApi) => action$
    .ofType(types.SPACE)
    .map((spaceAction: Action<string>) => {
        wordsRef.push({ value: spaceAction.payload as string, location: middleWareApi.getState().location });
        return { type: types.PUSHED };
    });