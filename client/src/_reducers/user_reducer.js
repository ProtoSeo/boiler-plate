import { LOGIN_USER } from "../_actions/types";

export default function user(state={},action){
  switch(action.type){
    case LOGIN_USER:
      return {...state, loginSucess:action.payload};
    default:
      return state;
  }
}