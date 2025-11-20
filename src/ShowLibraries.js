import React, { useEffect, useState } from 'react'

function ShowLibraries() {
    const [libraries, setLibraries] = useState([])
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(0)
    const [skip, setSkip] = useState(0)
    const [total, setTotal] = useState(0)
    const totalPages = Math.ceil(total / limit) 
    
    useEffect(()=> {
        console.log(totalPages)
        setSkip(page * limit)

        
       
    }, [page, limit])


    useEffect(() => {

         fetch(`http://localhost:5000/api/libraries?limit=${limit}&page=${skip}`)
    .then((res) => res.json())
    .then((data) => {
        setLibraries(data.library)
        setTotal(data.total)
        console.log(data)
    })
       console.log(libraries)
    }, [skip])



    const handleClick = (id) => {
        const selectedlibrary = libraries.find(lib => lib.id === id )
        console.log(selectedlibrary)
        fetch('http://localhost:5000/api/libraries/delete', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({id})
        }).then((res) => res.json()).then((data) => {console.log(data)
            window.location.reload()
        })
         
    }

    const handleIncrease = () =>{

                //setLimit((prev) => prev + 10)  
                if(page < totalPages -1)  
                setPage((prev) => prev + 1)


              

            }

    const handleDecrease = () => {
        if(page <= 0){
            return () => {
                setLimit(10)
            setPage(0)
            }

        }
        setPage((prev) => prev - 1)
       // setLimit((prev) => prev - 10)
    }

  return (
    <div>

        <h1 className='text-center'>Show Libraries Page</h1>
       
                


               
      {/* {Array.from({length : page}, (_, i) => <button> {i+ 1}</button>)} */}

        <p>{limit}</p>
       <p>{page}</p>
       <p>{skip}</p>
       <div>   <button onClick={handleDecrease} ><i class="fa-solid fa-arrow-left"></i> </button>
        <button onClick={handleIncrease }><i class="fa-solid fa-arrow-right"> </i></button></div>
         <div className='justify-center' style={{display : 'flex',  flexDirection : 'row', margin : '10px', padding : '10px', gap : '10px'}}>
         
                <table border={1} style={{marginBottom : '10px'}} className='table-fixed'>
                    
                    <thead className='show-library'>
                        {/* <td> S. nO</td> */}
                        {/* <td>Library ID</td> */}
                        <td>Library Name</td>
                        <td>Library Website</td>
                        <td>Library Type</td>
                        <td>Action</td>
                    </thead>
                    
    {libraries?.map((library, index) => (
    <tbody className='tb-body mb-4 text-center justify-center items-center' key={library.id}>
    <tr>
    {/* <td>{index + 1}</td> */}
    {/* <td>{library.id}</td> */}
    <td>{library.title}</td>
    <td> <a href={library.Url}> Url</a></td>
    <td>{library.type}</td>
    <td><button onClick={() => {handleClick(library.id)}} className='bg-red-500 border border-white  rounded-xl hover:bg-white p-3 '>{"Delete Marker"}</button></td>
    </tr>
    </tbody>

            
               
                // <img src={library.marker_image} alt={library.title} style={{width: '30px', height: '30px'}}/>
                // <h2>{library.title}</h2>
                // <p><a href={library.Url}>Library url</a></p>
                

    //</div>
    ))}
    
    
     </table>
     </div>
     </div>
  )
}

export default ShowLibraries