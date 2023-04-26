const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const controller = require("../controller/controller");
const auth = require("../middleware/auth");

// Route to create a new user
router.post("/data", [
  body('email', "Please provide a valid email address.").isEmail(),
  body('password', "Password should be at least 5 characters long.").isLength({ min: 5 }),
  body('name', "Please provide a name.").isLength({ min: 1 }),
  body('phone', "Please provide a valid phone number.").isLength({ min: 10, max: 10 })
], controller.postdata);

// Route to login user
router.post("/login", controller.login);

// Route to fetch user data (requires authentication)
router.get('/data', auth, controller.fetchData);

// Route to search users by name
router.post('/search', controller.nameSearch);

// Route to fetch a single user by ID
router.get('/user/:id', controller.singleUser);

// Routes to sort users by name, phone, or email
router.get('/name', controller.sortName);
// Route to update user data by ID
router.put('/edit/:id', controller.Update);

// Route to delete user by ID
router.delete('/delete/:id', controller.delete);

module.exports = router;