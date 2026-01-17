// controllers/user.controller.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// // Controller function to create a new user
// exports.createUser = async (req, res) => {
//     try {
//         // 1. Destructure data from request body
//         const { name, email, mobile_number, password, confirmPassword } = req.body;


//         const profileImage = req.file
//     ? `/uploads/profile/${req.file.filename}`
//     : "/uploads/profile/default.png";



//         // 2. --- Basic Validation ---
//         if (!name || !email || !password || !confirmPassword) {
//             return res.status(400).json({ message: 'Please fill in all required fields.' });
//         }

//         // Check if passwords match
//         if (password !== confirmPassword) {
//             return res.status(400).json({ message: 'Passwords do not match.' });
//         }

//         // 3. --- Hash Password ---
//         // Generate a salt
//         const salt = await bcrypt.genSalt(10);
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // 4. --- Create SQL Query ---
//         // Note: the `users` table in this database uses the column name `password`.
//         // Insert the hashed password into the `password` column so the query matches schema.
//         const sql = 'INSERT INTO users (name, email, mobile_number, password) VALUES (?, ?, ?, ?)';
//         const values = [name, email, mobile_number, hashedPassword];

//         // 5. --- Execute Query ---
//         // We don't need the result, so we just await the execution
//         await db.query(sql, values);

//         // 6. --- Send Success Response ---
//         res.status(201).json({ message: 'User created successfully!' });

//     } catch (error) {
//         // 7. --- Error Handling ---
//         console.error('Error creating user:', error);

//         // Check for duplicate email error
//         if (error.code === 'ER_DUP_ENTRY') {
//             return res.status(409).json({ message: 'Email already exists.' });
//         }

//         // Generic server error
//         res.status(500).json({ message: 'Server error, please try again later.' });
//     }


    
// };



exports.createUser = async (req, res) => {
  try {
    const { name, email, mobile_number, password, confirmPassword } = req.body;

    // ✅ profile image path
    const profileImage = req.file
      ? `/uploads/profile/${req.file.filename}`
      : "/uploads/profile/default.png";

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ profile_image column added
    const sql = `
      INSERT INTO users 
      (name, email, mobile_number, password, profile_image)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      email,
      mobile_number,
      hashedPassword,
      profileImage
    ];

    await db.query(sql, values);

    res.status(201).json({
      message: 'User created successfully!',
      profile_image: profileImage
    });

  } catch (error) {
    console.error('Error creating user:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};





exports.getAllUsers = async (req, res) => {
    try {
        // 1. --- Create SQL Query ---
        // Select the columns needed by the frontend
        const sql = 'SELECT id, name, email, mobile_number, created_at FROM users ORDER BY created_at DESC';

        // 2. --- Execute Query ---
        // Using [rows] to destructure the result from mysql2/promise
        const [rows] = await db.query(sql);

        // 3. --- Send Success Response ---
        res.status(200).json(rows);

    } catch (error) {
        // 4. --- Error Handling ---
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    } };


    exports.deleteUser = async (req, res) => {
    try {
        // 1. Get the user ID from the URL parameters
        const { id } = req.params;

        // 2. Create SQL Query
        // const sql = 'DELETE FROM users WHERE id = ?';

        const sql = 'DELETE FROM users WHERE id = ?';




        // 3. Execute Query
        const [result] = await db.query(sql, [id]);

        // 4. Check if a row was actually deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 5. Send Success Response
        // 204 "No Content" is common for a successful delete
        res.status(200).json({ success: true, message: 'User deleted successfully' });

    } catch (error) {
        // 6. Error Handling
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error, please try again later.' });
    }
};
// You can add more controller functions here
// exports.getAllUsers = async (req, res) => { ... }



exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT id, name, email, mobile_number, profile_image FROM users WHERE id = ?',
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];

    // Build absolute URL for profile image
    const baseUrl = (process.env.BASE_URL && process.env.BASE_URL.replace(/\/$/, '')) ||
      (req.get('x-forwarded-proto') || req.protocol) + '://' + req.get('host');

    const DEFAULT_IMAGE = '/profile-logo.jpg';

    let profileImageUrl = baseUrl + DEFAULT_IMAGE;

    if (user.profile_image) {
      // normalize path
      let stored = user.profile_image.replace(/\\/g, '/');
      stored = stored.replace(/^public\//i, '').replace(/^\/+/, '/');
      const fsPath = path.join(process.cwd(), 'public', stored.replace(/^\/+/, ''));
      if (fs.existsSync(fsPath)) {
        profileImageUrl = baseUrl + (stored.startsWith('/') ? stored : '/' + stored);
      } else {
        // if stored doesn't exist, keep default
        profileImageUrl = baseUrl + DEFAULT_IMAGE;
      }
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImage: profileImageUrl
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobile_number } = req.body;

    await db.query(
      'UPDATE users SET name=?, email=?, mobile_number=? WHERE id=?',
      [name, email, mobile_number, id]
    );

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
