import dotenv from 'dotenv';
import { requireAuth } from '@clerk/express';
import { chatAgent } from './logic/chatAgent.js';
import express from 'express'
import { MongoClient } from 'mongodb';
import cors from 'cors'
import bodyParser from 'body-parser';
// import { checkAuth } from './middleware/clerkAuth.js';


// import fs from 'fs'
// import path, {dirname} from 'path';
// import multer from 'multer';

dotenv.config()

const app = express();

// const __filepath = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filepath)

// const upload = multer({dest : 'uploads/'})

//const libraries = require('./../src/libraries_data.json');

//Middlewares
app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(requireAuth())

// console.log(process.env.URI)

const client = new MongoClient(process.env.URI)
await client.connect()


const db = client.db('library_database');
const libraries_collection = db.collection('libraries_data');


//index creation
libraries_collection.createIndex({title : 1}, {unique : true}).then(() => {
    console.log('Unique index created on title field');
})

// function fetchLibraries() {
//     return JSON.parse(fs.readFileSync(path.join(__dirname, 'libraries_data.json'), 'utf-8'));
// }

//const jsonFilePath = path.join(__dirname, 'libraries_data.json');

// const deleted_values = ["Tesrt 3",
// "poppop",
// "Poilso",
// "f=vzv",
// "TWSAASAG",
// "nkkj",
// "gffjh",
// "KUTUMB",
// "Desi Mundw",
// "teststtst",
// "bjhszligGR",
// "aggsdv",
// "fvsssssvf",
// "argggge",
// "zcvdsvd"]


// for (let i=0; i< deleted_values.length; i++) {
//     libraries_collection.deleteMany({title : deleted_values[i]})
//     console.log("deleted successfully")
// }
//libraries_collection.deleteMany({title : deleted_values})


app.get('/api/libraries', async (req, res) => {
    // const libraries = fetchLibraries();
    //const libraries = {};
    const query = req.query.title;
    console.log(query)
    const limit = parseInt(req.query.limit) ;
    const skip = parseInt(req.query.page)

    const filter = query ? { title  : {$regex : query, $options : "i"} } : {}

    console.log(filter)
        const total = await libraries_collection.countDocuments()
        libraries_collection.find(filter).limit(limit).skip(skip).toArray().then((library)=>{
           // console.log(library, total)
            res.json({library, total});
        }).catch((err)=> {
                    res.json(err)

        })
    


})

const date = new Date();

//const libraries = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

app.post('/api/add-libraries', async (req, res) => {


    //const libraries = fetchLibraries();
    //console.log(libraries)

    const last_library = await libraries_collection.find({}).sort({id : -1}).limit(1).toArray()
        //fs.writeFileSync('new_data.json', JSON.stringify(libraries), 'utf-8')

        const newId = last_library.length > 0 ? last_library[0].id + 1 : 1

    
    let data = {
        id : newId,
        title: req.body.title,
        Url: req.body.Url,  
        address: req.body.address, 
        created_At : req.body.date || date.toLocaleDateString('en-GB'),
        lat:  req.body.lat,
        long: req.body.long,
        type: req.body.type,
        contact_person: req.body.contact_person,
        contact_email: req.body.email,
        marker_image: req.body.marker_image.iconUrl
    }

    //  const existiingData = libraries.find(lib=> lib.title.toLowerCase() === req.body.title.toLowerCase())
    // if(existiingData){
    //     //console.error("Library already exists")
    //     return res.status(400).json({ message: 'Library already exists' });
    // }
    // else{
    // libraries.push(data)
    // fs.writeFileSync(jsonFilePath, JSON.stringify(libraries, null, 2));

    libraries_collection.findOne({title: req.body.title}).then((existingLibrary)=>{
            console.log(existingLibrary)
        if(existingLibrary){
            console.error("Library already exists")
            return res.status(400).json({ message: 'Library already exists' });
        }
        else{

        
    libraries_collection.insertOne(data).then(()=>{
        console.log("Library added to database");
        return res.status(200).json({message : "Library Added Succesfully"})
    }).catch((err)=>{
        console.error("Error adding library to database", err)})
        }

        })
    //res.json({ message: 'Library added successfully', libraries})
    //res.redirect('/map-libraries')

    
    

//const jsonFilePath = path.join(__dirname, 'libraries_data.json');   
// libraries_collection.insertMany(fetchLibraries()).then(() => {
//     console.log('Libraries data inserted into MongoDB collection');
// }).catch((err) => {
//     console.error('Error inserting libraries data into MongoDB collection', err);
// })

// const documents = libraries_collection.aggregate([
//   {
//     $group: {
//       _id: { title: "$title", Url : "$Url" }, // change these fields to match your unique identifiers
//       count: { $sum: 1 },
//       ids: { $push: "$_id" }
//     }
//   },
//   { $match: { count: { $gt: 1 } } }
// ]).toArray();

// for ( const doc of documents ) {
//   doc.ids.shift(); // keep the first
//    db.collection.deleteMany({ _id: { $in: doc.ids } });
// };




})

//unique


//Adding chat agent endpoint
app.post('/api/chat', async (req, res) => {
    console.log("log", req.body)
    const query =  req.body.user
    if(!query || query === ""){
        res.json("Please provide with a text")
        return
    }
    try{
    const aiResponse = await chatAgent(query)
    console.log(aiResponse)
    return res.json(aiResponse)
    }
    catch{
        res.status(500).json({"message" : "Error"})
    }
    
    
    
})

app.post('/api/file', async(req, res) => {
    let file =  req.body
    //console.log(file)
    const titles = []

    const date = new Date()
     const last_library = await libraries_collection.find({}).sort({id : -1}).limit(1).toArray()
        //fs.writeFileSync('new_data.json', JSON.stringify(libraries), 'utf-8')

    const newId = last_library.length > 0 ? last_library[0].id + 1 : 1

    for(let i= 0; i< file.length; i++){
        
        const title = file[i].title
        titles.push(title)

        file[i].id = newId + i 
        
    }

    console.log(file)

    console.log(titles)
    // console.log(file[0].title)
    // const results = []
    if(!file){
        console.error("No file Uploaded")
        return res.status(400).json({mssg : 'No File Uploaded'})
    }
    else{
        
    
    // results.push(file)
    // console.log(results)
    // const filepath = path.join(__dirname, file.path)
    // console.log(filepath)
    // fs.createReadStream(filepath)
    // .pipe(csv())
    // .on('data', (data) => results.push(data))
    // console.log()
    // .on('end', async () => {
    //     try{
            // if(results.length > 0){

            try{
                // const existingData = libraries_collection.find({title : })
                await libraries_collection.insertMany(file)
                await libraries_collection.updateMany({title : {$in : titles}}, {$set : {created_At : date.toLocaleDateString('gn-GB')}})
                console.log("Added Successfully")
                res.status(200).json({message : "Bulk addition done", type: 'success'})
            }
            // }

        catch (err){
            
    if(err.code === 11000){
        res.status(400).json({message: "Duplicate found at any index", type : 'duplicate'})
    }
   else{
    res.status(500).json({message: 'something happend at our end', type : 'error'})
   }
        }

    }


    }



    
)


app.post('/api/libraries/delete', (req, res) => {
    const data = req.body.id
    //console.log(data)
    libraries_collection.deleteOne({id : data}).then((mssg) => {
        console.log(mssg)
        res.json({"message" : "Delete Successfully" })

    })
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Server is running on port 3000');
})

   