const express = require("express")

const router = express.Router();


router.get('/', (req,res) =>{
    obj = {
        a : "this",
        number: 43
    }

    res.json(obj)
})



module.exports = router
