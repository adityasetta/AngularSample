import { User } from "../user.model";
import * as AuthAction from "./auth.action"; 

export interface State {
    user: User;
}

const initialState = {
    user: null
};

export function authReducer(state = initialState, action: AuthAction.AuthAction){
    switch(action.type){
        case AuthAction.LOGIN:
            const user = new User(action.payload.email, 
                action.payload.userId, 
                action.payload.token, 
                action.payload.expirationDate);
            return {
                ...state,
                user: user
            }
        case AuthAction.LOGOUT:
            return{
                ...state,
                user: null
            }
        default:
            return state;
    }
}