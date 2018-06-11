import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ChurchState {
    churches: Church[];
    activeChurch: number;
    loading: boolean;
    error: any;
}

export interface Church {
    name: string;
    location: string;
    telephoneNr: number;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

interface SetActiveChurchAction {
    type: 'SET_ACTIVE_CHURCH';
    payload: number;
}

interface RemoveActiveChurch {
    type: 'REMOVE_ACTIVE_CHURCH';
}

interface AddChurchesBegin {
    type: 'ADD_CHURCHES_BEGIN';
}

interface AddChurchesSuccess {
    type: 'ADD_CHURCHES_SUCCESS';
    payload: Church[];
}

interface AddChurchesError {
    type: 'ADD_CHURCHES_ERROR';
    payload: any;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SetActiveChurchAction | RemoveActiveChurch | AddChurchesBegin | AddChurchesSuccess | AddChurchesError;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    setActiveChurch: (payload: number) => <SetActiveChurchAction>{ type: 'SET_ACTIVE_CHURCH', payload: payload },
    removeActiveChurch: () => <RemoveActiveChurch>{ type: 'REMOVE_ACTIVE_CHURCH' },
    fetchChurchesBegin: () => <AddChurchesBegin>{type: 'ADD_CHURCHES_BEGIN'},
    fetchChurchesSuccess: (payload: Church[]) => {
        let tempChurch: Church = { name: 'Antons Church', telephoneNr: 1337, location: 'stockholm' };
        return <AddChurchesSuccess>{ type: 'ADD_CHURCHES_SUCCESS', payload: [tempChurch] };
    },
    fetchChurchesError: (payload: any) => <AddChurchesError>{type:'ADD_CHURCHES_ERROR', payload: payload}
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ChurchState = { churches: [], activeChurch: -1, loading: false, error: null};

export const reducer: Reducer<ChurchState> = (state: ChurchState, incomingAction: KnownAction) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'SET_ACTIVE_CHURCH':
            return { ...state, churches: state.churches, activeChurch: action.payload };
        case 'REMOVE_ACTIVE_CHURCH':
            return { ...state, churches: state.churches, activeChurch: 0 };
        case 'ADD_CHURCHES_BEGIN':
            return { ...state, loading: true };
        case 'ADD_CHURCHES_SUCCESS':
            return { ...state, loading: false, churches: action.payload };
        case 'ADD_CHURCHES_ERROR':
            return { ...state, loading: false, error: action.payload };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || unloadedState;
};
