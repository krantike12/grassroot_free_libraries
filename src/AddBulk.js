import React, { useEffect } from 'react'
import { useState } from 'react'
// import Papa from 'papaparse'
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';

function AddBulk() {


    const [file, setfile] = useState(null)
    const [fileMeta, setFileMeta] = useState([])
    const [recData, setRecData] = useState([])
    const [header, setHeader] = useState([])
    const [serRes, setSerRes] = useState([])

    useEffect(()=>{
        if(recData.length > 0){
            const keys = Object.keys(recData[0])
            keys.map((key) => {
                key.replace(/[\u200B-\u200D\uFEFF]/g, '')
                console.log(key)
                return key
        })
            console.log(keys)
        setHeader(keys)

        }

        console.log(fileMeta)

                

    }, [recData])

    // useEffect(()=> {
    //     //pn mounting
    //     document.body.classList.add('body-bulk')

    //     //unmounting
    //     return () => {
    //         document.body.classList.remove('body-bulk')
    //     }
    // }, [])
   

    const handleChange = async (e) => {
                e.preventDefault()

        const fileData = e.target.files[0]
        if(!fileData){
    return null
}
       // setfile(fileData)
        console.log(fileData)
        setFileMeta(fileData)
        

    
//         Papa.parse(fileData, 
//             {
// 	quotes: false, //or array of booleans
// 	quoteChar: '"',
// 	escapeChar: '"',
// 	delimiter: ",",
// 	header: true,
// 	newline: "\r\n",
// 	skipEmptyLines: false, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
// 	columns: null, //or array of strings
//     complete : function(results) {
//         console.log(results)
//         setRecData(results.data)
//        // updateData()
//     }
// }, 
//     )

// using Sheet xlsx
const arrayData = await fileData.arrayBuffer()

//get the workbook 
const workbook = XLSX.read(arrayData, {type : 'array'})

//get the sheet name
const sheetName = workbook.SheetNames[0]

const sheet = workbook.Sheets[sheetName]

const tojson = XLSX.utils.sheet_to_json(sheet)

console.log(tojson)
setRecData(tojson)
setfile(tojson)
console.log(arrayData)

//clean header data
const cleanedHeader = Object.keys(tojson[0])
console.log(cleanedHeader)

console.log(Array.from(cleanedHeader[0]))
    }

    // const updateData = () => {
    //     for(let i =0; i < recData.length; i++){
    //         console.log(recData[i])
    //     }
    
    // }
     

    // useEffect(()=>{
    //     console.log(file)
    // }, [file])

    const handleSubmit = async (e) => {
        e.preventDefault()
    //     const  formData = new FormData()

    //   formData.append('file', file)
      if(!file){
        toast("Please add a file first" ,{type: 'warning'})
        return null
        
      }
      console.log(file)
       const response = await fetch('http://localhost:5000/api/file', {
            method : 'POST',
            body : JSON.stringify(file),
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        const data = await response.json()
        console.log(data)
        setSerRes(data)
        if(data.type === "success"){
            toast("Your file has been uploaded to the DB", {type: 'success'})
            setfile("")
            recData([])

        }
        else{
            toast("Duplicate Library Addition", {type: 'warning'})

        }

        
        
        
    }

  return (
    <React.Fragment>
        <div id="divBody">

      
        <div className='mainDiv  '>
    <div className='Bulkform w-96 p-6'>
        <form>
            <label for="bulkForm"> Select your file </label>
       <input type='file' hidden id="bulkForm" accept='.csv, .xlsx, .ods' onChange={handleChange}/>
       <span>{fileMeta?.name?.slice(0,10)}...</span>
        </form>
        <button className='bg-transparent border border-black hover:bg-black hover:text-white text-black p-2 rounded-full' type="submit" onClick={handleSubmit}>Upload your file</button>

        <span style={serRes.type==="success" ? {color : "green" } : {color : 'red'}}>{serRes && (<>{serRes.message}</>)}</span>
</div>
   
    <div className='table'>
        <table className='table-auto data-table ' border="1" cellPadding="8" cellSpacing="0" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead >
        <tr>
        { header.map((key)=> (
   
                <th style={{}}>{key.trim().replace(/[\u200B-\u200D\uFEFF]/g, '')}</th>))
    
           
        }
        </tr>
          </thead>
          <tbody>

                {recData.map((row)=> (
                    <tr style={{border: '1px solid black'}}>
                        {header.map((key)=> (
                            <td>{row[key]}</td>
                        ))}
                    </tr>
                ))}
          
             
                
          
          </tbody>
        </table>

    </div>
     </div>
       
     <ToastContainer autoClose={2000}></ToastContainer>
     </div>
        </React.Fragment>

       
  )
    }


export default AddBulk