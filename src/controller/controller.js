const userModel = require("../model/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.postdata = async (req, res) => {
  const file = req.body.image;
  try {
    // Check if email and phone number already exist in the database
    const [existingEmailUser, existingPhoneUser] = await Promise.all([
      userModel.findOne({ email: req.body.email }),
      userModel.findOne({ phone: req.body.phone }),
    ]);
    if (existingEmailUser) {
      return res.status(405).json("Email already exists");
    } else if (existingPhoneUser) {
      return res.status(405).json("Phone number already exists");
    } else if (req.body.phone > 9999999999 || req.body.phone < 1000000000) {
      return res.status(405).json("Invalid phone number");
    } else if (!req.body.image) {
      return res.status(405).json("Please provide an image");
    }
    
    // Validate the request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Hash the password using bcrypt and create a new user in the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new userModel({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image,
    });
    const savedUser = await user.save();
    
    // Create a JWT token and send it to the client along with the user's ID
    const token = jwt.sign({ id: savedUser._id }, "secretKey", {
      expiresIn: "24hr",
    });
    res.status(200).json({ id: savedUser._id, token: token });
  }catch (error) {
    console.error(error);
    res.status(400).json({ msg: "An error occurred while processing your request" });
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.send("input should not empty");
    }
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.send("email is not registered");
    } else {
      const pass = bcrypt.compare(
        req.body.password,
        user.password,
        (err, result) => {
          if (result == true) {
            const token = jwt.sign({ id: user.id }, "secretKey", {
              expiresIn: "24hr",
            });
            res.send({ id: user.id, token: token });
          } else {
            res.send("login failed");
          }
        }
      );
    }
  } catch (error) {
    res.send(error);
  }
};

exports.fetchData = async (req, res) => {
  let { page, limit, sort, asc } = req.query;
  try {
    if (!sort) {
      sort = "phone";
    }
    if (!asc) asc = -1;
    if (!page) page = 1;
    if (!limit) limit = 10;
    const skip = (page - 1) * limit;
    const users = await userModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ [sort]: asc });
    const count = users.length;
    res.send({ users, count });
  } catch (error) {
    res.send(error);
  }
};

exports.nameSearch = async (req, res) => {
  try {
    const { name } = req.body;
    const query = { name: new RegExp(name, "i") };
    const user = await userModel.find(query);
    res.send(user);
  } catch (error) {
    // handle error
    res.send(error.message)
  }
};

exports.sortName = async (req, res) => {
  let { page, limit, sort, asc } = req.query;
  try {
    if (!sort) {
      sort = "phone";
    }
    if (!asc) asc = -1;
    if (!page) page = 1;
    if (!limit) limit = 10;
    const skip = (page - 1) * limit;
    const users = await userModel
      .find()
      .skip(skip)
      .limit(limit)
      .sort({[sort]: asc});
    const count = users.length;
    res.send({ users, count });
  } catch (error) {
    res.send(error);
  } 
};

exports.singleUser = async (req, res) => {
    try {
    const user = await userModel
      .findById({ _id: req.params.id },{password:0})
    if (!user) {
      res.send("plzz provide right id");
    }
    res.send(user);
  } catch (error) {
     if(error.name==="CastError"){
    res.send("invalid id")
   }
  }
   
};

exports.Update =async(req,res)=>{
  try {
    const user= await userModel.findById(req.params.id)
    if(!user){
      res.send("plzz provide right id")
    }
    console.log(req.body);
    const result= await userModel.findByIdAndUpdate(req.params.id,{
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email},{
      new:true,
      runValidator:true
    })
    res.send(result)
  } catch (error) {
    if(error.name==="CastError"){
      res.send("invalid id")
     }
     res.send("something went wrong")
    
  }
}
exports.delete = async (req, res) => {
  try {
    // Find user by ID
    const user = await userModel.findById(req.params.id);
    
    // If user not found, return error message
    if (!user) {
      return res.send("Please provide the correct user ID.");
    }
    
    // Delete user by ID and return success message
    const result = await userModel.findByIdAndDelete(req.params.id)
    
    // If user ID not found, return error message
    if (!result) {
      console.log("Error deleting user.");
      return res.send("Something went wrong.");
    }else{
    
    // Send success message as response
    res.send("User deleted successfully.");
    }
  } catch (error) {
    // If ID is invalid, return error message
    if (error.name === "CastError") {
      return res.send("Invalid user ID.");
    }
    
    // For any other errors, return a generic error message
    res.send("Something went wrong.");
  }
};