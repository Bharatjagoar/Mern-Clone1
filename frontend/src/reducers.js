import { createReducer} from "@reduxjs/toolkit"
const initialstate={
    gender:null,
    date:null,
    year:null,
    Months:null,
    Sess:null,
    InputDialougeBox:null
}

export const custom = createReducer(initialstate,{
    genderSelection:(state,action)=>{
        state.gender=action.payload
    },
    date:(state,action)=>{
        state.date=action.payload
    },
    year:(state,action)=>{
        state.year=action.payload
    },
    Months:(state,action)=>{
        state.Months=action.payload
    },
    Session:(state,action)=>{
        state.Sess=action.payload
    },
    InputBox:(state,action)=>{
        state.InputDialougeBox=action.payload
    }
})

