import { combineReducers } from '@reduxjs/toolkit';
import counterReducer from '../../features/counter/counterSlice';
import { reducer as formReducer } from 'redux-form';



const rootReducer = combineReducers({
    counter: counterReducer,
    form: formReducer
})


export default rootReducer;