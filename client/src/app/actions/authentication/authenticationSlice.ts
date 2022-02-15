import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from 'app/store';
import axios, { AxiosResponse } from 'axios';
import { AuthenticationState, RegisterApiPayload, RegisterApiResponse, RegisterApiResponseError } from './authenticationTypes';
// import { fetchCount } from './counterAPI';


const initialState: AuthenticationState = {
    isLogin: false
};

export const postRegister = createAsyncThunk(
    'auth/register',
    async (payload: RegisterApiPayload) => {
        const response: AxiosResponse<RegisterApiResponse> = await axios.post('auth/register', payload);
        // The value we return becomes the `fulfilled` action payload
        return response?.data;
    }
);

const reducers = {
    setRegisterError: (state: AuthenticationState, { payload }: PayloadAction<RegisterApiResponseError>) => {
        state.registerErrors = payload.errors;
    },
    setRegisterResponse: (state: AuthenticationState, { payload }: PayloadAction<RegisterApiResponse>) => {
        state.registerPayload = payload;
    },
    setIsLogin: (state: AuthenticationState, { payload }: PayloadAction<boolean>) => {
        state.isLogin = payload;
    },
};

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers,
});

export const { setRegisterError, setRegisterResponse, setIsLogin } = authenticationSlice.actions;

// SELECTORS
export const authenticationSelectors = {
    getRegisterErrors: (state: RootState) => state.authentication.registerErrors,
    getRegisterResponse: (state: RootState) => state.authentication.registerPayload,
    getLoginErrors: (state: RootState) => state.authentication.loginErrors,
    getIsLogin: (state: RootState) => state.authentication.isLogin
};

export const register = (payload: RegisterApiPayload): AppThunk => async (
    dispatch,
    // getState // current state for condition dipathing
) => {
    try {
        const response: AxiosResponse<RegisterApiResponse> = await axios.post('auth/register', payload);
        dispatch(setRegisterResponse(response?.data));
        dispatch(setIsLogin(true));
    } catch (e: any) {
        dispatch(setRegisterError(e.message))
    }

};

export default authenticationSlice.reducer;
