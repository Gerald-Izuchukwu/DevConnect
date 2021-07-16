const express = require('express')

const app = express();

app.get('/' , (req , res)=>{

   res.send('hello from simple server :)')

})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`Server Started on Port ${PORT}`);
})