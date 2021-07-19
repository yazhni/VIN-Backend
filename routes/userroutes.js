const router = require("express").Router();
const User = require('../model/user');
const vinDetails = require('../model/vinDetails');
const bcrypt = require('bcryptjs');
const auth = require("../middleware/auth")
const jwt = require('jsonwebtoken')

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.json({status:false, msg: "Not all fields have been entered." });
        const user = await User.findOne({  email:req.body.email});
        if (!user)
            return res
                .json({status:false, msg: "No account with this email has been registered." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            status:true, 
            token,
            username: user.name,
        });
    } catch (err) {
        res.json({status:false, msg: err.message });
    }
});
router.get("/getvindetails",auth, async (req, res) => {
    const user = await vinDetails.find( {userId:req.user});
    res.json({user})
})
router.post("/insertVinDetails",auth, async (req, res) => {
    try {
        let obj = {
            model:"-",
            modelyear:"-",
            ManufacturerName:"-",
            make:"-",
            userId:"",
            code:""
          }
      for(let i =0; i<req.body.data.length;i++)
      {
          if(req.body.data[i].Variable == "Model")
            obj.model= req.body.data[i].Value
            if(req.body.data[i].Variable == "Model Year")
            obj.modelyear= req.body.data[i].Value
            if(req.body.data[i].Variable == "Manufacturer Name")
            obj.ManufacturerName= req.body.data[i].Value
            if(req.body.data[i].Variable == "Make")
            obj.make= req.body.data[i].Value
      }
      obj.code = req.body.code;
      obj.userId = req.user;
      const vinDetails1 = await vinDetails.findOne({userId:req.user,code:req.body.code});
      if (!vinDetails1){
        vinDetails.insertMany(obj)
      }
      res.json({ status: true,message:"Vin details inserted successfully" });
    } catch (err) {
        res.json({ error: err.message });
    }
});
router.delete("/delete", auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        id: user._id,
    });
});

module.exports = router;