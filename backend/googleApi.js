const csvtojson = require('csvtojson'); 
const fs = require('fs'); 
//const libData = require('../backend/libraries_data.csv')  
const path = require('path');

// fetch("https://docs.google.com/spreadsheets/d/1NhucPFgBbei0pqQS9L_gP_ygUMO-1ov7pbIEWXdM_fY/export?format=csv&gid=1303262174")
// .then(res => res.text())
// .then(data => {
//         console.log(data);
//        //s.writeFileSync('libraries_data.csv', data);

//     //  if(existiingData){
//     //     return res.status(400).json({message: "Library with this title already exists"})
//     //  }

// });


fs.readFile(path.join(__dirname, 'libraries_data.csv'), 'utf8', (err, dataLib) => {
    if (err) {
        console.error(err);
        return;
    }
    else{
fs.writeFileSync(path.join(__dirname, 'libraries.json'),dataLib )
    }
});
