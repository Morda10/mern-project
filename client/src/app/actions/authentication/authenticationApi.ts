import { RegisterApiPayload } from "app/actions/authentication/authenticationTypes";
import { AppDispatch } from "app/store";
import axios, { AxiosResponse } from "axios";

// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
    return new Promise<{ data: number }>((resolve) =>
      setTimeout(() => resolve({ data: amount }), 500)
    );
  }

//   export const register = (payload: RegisterApiPayload) => {
//     return new Promise<RegisterApiPayload>((resolve) =>{
//       axios.post('/auth/register', payload).then((res)=> {
//         if (res.data.errors) {}
    
//       });
//   }
// };

//   const register = () => {
//     return (dispatch: AppDispatch) => {     //nameless functions
//       // Initial action dispatched
//       dispatch(setRegisterResponse());
//       // Return promise with success and failure actions
//       return axios.get('/auth/register').then(  
//         user => dispatch({ type: GET_CURRENT_USER_SUCCESS, user }),
//         err => dispatch({ type: GET_CURRENT_USER_FAILURE, err })
//       );
//     };
//   };
  