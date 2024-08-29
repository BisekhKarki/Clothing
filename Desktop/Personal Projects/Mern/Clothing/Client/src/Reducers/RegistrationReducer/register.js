import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk("loginUser", async (data,{rejectWithValue})=>{
    try {
        const response = await fetch("http://localhost:5000/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

        const val = await response.json();
        console.log(val)
        return val;
    } catch (error) {
        rejectWithValue(error)
    }

})


export const registerUser = createAsyncThunk("registerUser", async (data,{rejectWithValue})=>{

    try {
        const response = await fetch('http://localhost:5000/register',{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        })

          if (response.status === 400) {
            const errorData = await response.json();
            return rejectWithValue(errorData)
        }

        const val = await response.json();
        return val;

    } catch (error) {
        rejectWithValue(error)
    }
})



export const register = createSlice({
    name:'register',
    initialState:{
        loading:false,
        data:[],
        login:[],
        error:'',
        

    },
    reducers:{
        clearData:(state,action)=>{
            state.data = action.payload;
            state.error = '';
            state.loading = false;

        },
        clearLogin:(state,action)=>{
            state.loading = false;
            state.login = action.payload;
            state.error = '';
        }
    },
    extraReducers:(builder)=>{
        builder
        // For login 
        .addCase(loginUser.pending,(state,action)=>{
            state.loading = true;
            state.error = '';
        })

        .addCase(loginUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.login = action.payload;
            state.error= '';

        })

        .addCase(loginUser.rejected,(state,action)=>{
            state.loading = false;
            state.error= action.payload.message;
        })


        // For Register
        .addCase(registerUser.pending,(state,action)=>{
            state.loading = true;
            state.error = '';
        })

        .addCase(registerUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.data = action.payload;
            state.error= '';
        })

        .addCase(registerUser.rejected,(state,action)=>{
            state.loading = false;
            state.error= action.payload || action.payload.message;
        })


    }
})



export const { clearData, clearLogin } = register.actions

export default register.reducer;