import { SignedIn, SignIn, UserButton, UserAvatar, SignedOut, SignInButton } from '@clerk/clerk-react'
import React, { useContext, useEffect, useState } from 'react'
import { SelectedContext } from './App';
import { redirect, useNavigate } from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import CustomIcon from './CustomIcon';
import AddBulk from './AddBulk';
import Footer from './Footer';


function AddLibraries() {
  const {newArray} = useContext(SelectedContext)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate();
  const initialType = "default"
  const [bulktoggle, setBulktoggle] = useState(false)



  const getmarkerimg = (type) => {
    return type === "parag" ? imagURL.parag : type === "kutumb" ? imagURL.kutumb : imagURL.default
  }

    const imagURL = {
      kutumb: CustomIcon.kutumb,
      parag: CustomIcon.parag,
      default : CustomIcon.default
  
    }


    const date = new Date();

    const initialData = {
      id :  "",
        title: "",
        Url: "",
        email: "",  
        date : date.toLocaleDateString('en-GB'),
        contact_person: "",
        type: initialType,
        address: "", 
        lat: "",
        long: "",
        marker_image: getmarkerimg(initialType)

    }
   
    const [formData, setFormData] = useState({
        id :  "",
        title: "",
        Url: "",
        email: "",  
        date : date.toLocaleDateString('en-GB'),
        contact_person: "",
        type: initialType,
        address: "", 
        lat: "",
        long: "",
        marker_image: getmarkerimg(initialType)
    });

     

    // useEffect(()=> {
    //   if(newArray.length > 0){
    //     const previousId = newArray[newArray.length - 1].id;
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       id : newArray[previousId].id + 1
    //     }))
    //   }

    // },  [newArray])


    // useEffect(()=> {
    //   setFormData((prevData) => ({
    //     ...prevData, 
    //     marker_image : getmarkerimg(prevData.type)
    //   }))
    // }, [formData.type])

    const handleChange = (e) => {
        const { name, value } = e.target;

        const update = {
           [name] : value
        }

        if(name === "type"){
          update.marker_image = getmarkerimg(value)

        }
        setFormData((prevData) => ({
            ...prevData,
            ...update
           

        }));


    }

    const handleMouse = (e) => {
      const x = e.clientX
      const y = e.clientY
      console.log(e.target)
      console.log("I am hovering", x, y)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if(!formData.title || !formData.Url || !formData.email || !formData.contact_person || !formData.address || !formData.lat || !formData.long){
            toast("Please fill all the fields",{type: 'info'})
            return
        }
        fetch('http://localhost:5000/api/add-libraries', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'}
              })
              .then(res => {
                if (!res.ok) {
                  toast("Library already exists or some error occurred", {type : 'error'})
                  //console.log("Library already exists or some error occurred");
                  return null
                }
                else{
                  return res.json();
                }
              }
                  
              )
              .then(data => {
                if(!data) return 
                console.log(data);
                toast.success("Library added successfully", {type : 'success'})
                setFormData(initialData)
                setSubmitted(false)
                setTimeout(() => {
                    //navigate("/")
                }, 2000);
                clearTimeout()
              
              })
              .catch(err => {
                console.error('Error:', err);
                toast.error("An error occurred while adding the library")
              });

          

        console.log("form submitted", formData);
    }
  return (
    <>
    <div style={{  justifyContent : 'center', alignItems : 'center'}}>

        
        <SignedOut>
            <div className='signInBox' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20, borderRadius: 10, backgroundColor: 'white'}}>
        <h1 style={{color: 'black'}}>Add Libraries</h1>
        <p style={{color: 'black'}}>You can add libraries by signing in</p>
        
            <button style={{padding: 10, borderRadius: 10, backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer'}} >
            <SignInButton/>
            </button>
            </div>
        </SignedOut>
        <SignedIn>
          <div className='header'>

         
        <nav style={{display: 'flex', float: 'right', position: 'absolute', top: 10, right: 10}}><UserButton/>
        </nav>
        <i class="fa-solid fa-arrow-left"></i>
        <button title={bulktoggle ? 'Upload a single file' : 'use for bulk upload'} onClick={()=> {setBulktoggle(!bulktoggle)}}>{bulktoggle ? "Single file Upload" : "Bulk File Upload"}</button>
         </div>
        <div className='form' style={bulktoggle? {display : 'none'} : {display : 'block'}}>
    <div className="flex justify-center items-center bg-inherit min-h-screen  from-blue-50 to-indigo-100 p-4">
      <form  className="bg-white shadow-2xl w-96 rounded-2xl p-8  max-w-lg font-mono text-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add Library Data
        </h2>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1">Organisation Name</label>
            <input
              type="text"
              value={formData.title}
                          onChange={handleChange}
                          name='title'

              placeholder="Enter your organisation name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Organisation URL</label>
            <input
            value={formData.Url}
                        onChange={handleChange}

              type="text"
              name='Url'
              placeholder="Your organisation url"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1">Organisation Email Address</label>
            <input
              type="email"
              value={formData.email}
                          onChange={handleChange}
                          name='email'

              placeholder="example@exp.com"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 mb-1">Organisation Contact Person</label>
            <input
            value={formData.contact_person}
                        onChange={handleChange}
                        name='contact_person'

              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 mb-1">Type <span>(leave it default)</span></label>
            <select value={formData.type} name='type' onChange={ handleChange 
            
            } className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none">
              <option value="">Select</option>
              <option value="default">default</option>
              <option value="parag">parag</option>
              <option value ="kutumb">kutumb</option>
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 mb-1">Organisation Address</label>
            <textarea
              rows="2"
              name='address'
              value={formData.address}
                          onChange={handleChange}

              placeholder="Organisation full address"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            ></textarea>
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 mb-1">Organisation Latitude</label>
            <input
            name='lat'
            value={formData.lat}
                        onChange={handleChange}

              type="text"
              placeholder="Enter Latitude"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-gray-700 mb-1">Organisation Longitude</label>
            <input
            name='long'
            value={formData.long}
                        onChange={handleChange}

              type="text"
              placeholder="Enter Longitude"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Country */}
          {/* <div>
            <label className="block text-gray-700 mb-1">Creation Date</label>
            <input
              type="date"
              placeholder="Select Date"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div> */}

          {/* Marker Image */}
          <div hidden>
            <label hidden className="block text-gray-700 mb-1">Url of the marker Image</label>
            <input
            name='marker_image'
            value={formData.marker_image}
            onChange={handleChange}
                hidden
              type="text"
              placeholder=""
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={submitted ? true : false}
          type="submit"
          onClick={handleSubmit}
          className="w-full mt-6 bg-indigo-500 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
    </div>


        </SignedIn>
            <div className='form-control' style={bulktoggle ? {display : 'block'} : {display : 'none'} }><AddBulk/></div>
     
    </div>
    <Footer/>
    </>
    
  )
}


export default AddLibraries