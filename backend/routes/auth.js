import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = [
      'userType', 
      'userFullName',
      'email',
      'password',
      'mobileNumber'
    ];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Validate IDs based on user type
    if (req.body.userType === 'student' && !req.body.admissionId) {
      return res.status(400).json({ error: 'Admission ID required for students' });
    }

    if (req.body.userType === 'staff' && !req.body.employeeId) {
      return res.status(400).json({ error: 'Employee ID required for staff' });
    }

    // Check existing users
    const existingUser = await User.findOne({ 
      $or: [
        { email: req.body.email },
        { admissionId: req.body.admissionId },
        { employeeId: req.body.employeeId }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    /* Hash password */
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    /* Create new user */
    const newUser = new User({
      ...req.body,
      password: hashedPass,
      // Ensure numerical fields
      age: Number(req.body.age),
      mobileNumber: Number(req.body.mobileNumber),
      // Set default values
      points: 0,
      activeTransactions: [],
      prevTransactions: [],
    });

    /* Save user */
    const user = await newUser.save();
    
    // Return safe user data
    const userData = user.toObject();
    delete userData.password;
    
    return res.status(201).json(userData);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      error: "Registration failed",
      details: err.message 
    });
  }
});

/* User Login */
router.post("/signin", async (req, res) => {
  try {
    let user;
    
    if (req.body.admissionId) {
      user = await User.findOne({ admissionId: req.body.admissionId });
    } else if (req.body.employeeId) {
      user = await User.findOne({ employeeId: req.body.employeeId });
    } else {
      return res.status(400).json({ error: 'Please provide ID' });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Return essential user data
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      ...userData,
      // Ensure numerical values
      age: Number(userData.age),
      mobileNumber: Number(userData.mobileNumber),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      error: "Login failed",
      details: err.message 
    });
  }
});

export default router;