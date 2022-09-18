import {AUTH,LOGOUT} from '../constants/actionTypes';

const AuthReducer = (state = {authData: null}, action) => {
    switch (action.type) {
        case AUTH:
            console.log(action?.data);
            return state;
    
        default:
            return state;
    }
}

export default AuthReducer;