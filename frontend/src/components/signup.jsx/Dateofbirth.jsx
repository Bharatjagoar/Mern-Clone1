import React from "react";
import DateOfBirthCSS from "./Dateofbirth.module.css"
import {useDispatch} from "react-redux"

function DateOfBirth(){
    const dispatch = useDispatch()
    let thisyear = new Date().getFullYear();
    let year=[]
    let month=[ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    let date = []
    for (var i =1;i<32;i++){
        date.push(i)
    }
    for(i=1970;i<thisyear+1;i++){
        year.push(i)
    }
    function functionDate(e){
        dispatch({
            type:"date",
            payload:e.target.value
        }) 
    }
    function functionYear(e){
        dispatch({
            type:"year",
            payload:e.target.value
        })
    }
    function FunctionMonths(e){    
        dispatch({
            type:"Months",
            payload:e.target.value
        })
    }

    return <div className={DateOfBirthCSS.here}>
    <select onChange={FunctionMonths}>
        {
            month.map((thismonth,index)=>{
                return <option key={index} value={thismonth}>{thismonth}</option>
            })
        }
    </select>
    <select onChange={functionDate}>
        {
            date.map((thisdate,index)=>{
                return  <option key={index} value={thisdate}>{thisdate}</option>
            })
        }
    </select>
    <select onChange={functionYear}>
        {
            year.map((thisyears,index)=>{
                return <option key={index} value={thisyears}>{thisyears}</option>
            })
        }
    </select>
</div>
}

export default DateOfBirth;