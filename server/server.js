const {default:mongoose} = require('mongoose');
const app = require('./app');
const {MONGODB_URI,PORT} =require('./utils/config') 

console.log('Connecting to Database');

mongoose.connect(MONGODB_URI)
    .then(()=>{
        console.log('Connected to Database');
        
        console.log(`Connecting to Server ${PORT}`)

        app.listen(PORT,()=>{console.log(`Server running on the port http://localhost:${PORT}`)})
    })
    .catch(error=>console.log(error))






