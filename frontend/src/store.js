import {configureStore} from "@reduxjs/toolkit"
import {custom} from "./reducers"

const thisstore = configureStore({
    reducer:{
        custom:custom
    }
})

export default thisstore;
