require('dotenv').config();

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     security:
 *       - Authorization: []
 *     tags: [1. Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@nutech-integrasi.com
 *               first_name:
 *                 type: string
 *                 example: User
 *               last_name:
 *                 type: string
 *                 example: Nutech
 *               password:
 *                 type: string
 *                 format: password
 *                 example: abcdef1234
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil silahkan login"
 *                 data:
 *                   type: null
 *                   example: null
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: "Parameter email tidak sesuai format"
 *                 data:
 *                   type: null
 *                   example: null
 */
router.post('/register', async (req, res) => {
    const { email, first_name, last_name, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email || !first_name || !last_name || !password) {
      return res.status(400).json({ message: 'Data tidak boleh ada yang kosong!' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
          status: 102,
          message: "Format email tidak valid",
          data: null
      });
  }

  if (password.length < 8) {
      return res.status(400).json({
          status: 102,
          message: "Password harus memiliki minimal 8 karakter",
          data: null
      });
  }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.query(
        'INSERT INTO user (email, first_name, last_name, password) VALUES (?, ?, ?, ?)',
        [email, first_name, last_name, hashedPassword],
        (err, result) => {
          if (err) {
            return res.status(400).json({ message: 'Gagal Membuat User', error: err.message });
          }
          res.status(201).json({ id: result.insertId, email, first_name, last_name });
        }
      );
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     security:
 *       - Authorization: []
 *     tags: [1. Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@nutech-integrasi.com
 *               password:
 *                 type: string
 *                 example: abcdef1234
 *     responses:
 *       200:
 *         description: Berhasil Login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Login Sukses"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzI0MjQ3MjgwLCJleHAiOjE3MjQyNTA4ODB9.krSsZa9mSowRDmxiOaMlTOrdcVjoq5F8bCJbtI3WccI"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: "Parameter email tidak sesuai format"
 *                 data:
 *                   type: null
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 103
 *                 message:
 *                   type: string
 *                   example: "Username atau password salah"
 *                 data:
 *                   type: null
 *                   example: null
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
      return res.status(400).json({
          status: 102,
          message: "Parameter email atau password tidak boleh kosong",
          data: null
      });
  }

  if (!emailRegex.test(email)) {
      return res.status(400).json({
          status: 102,
          message: "Format email tidak valid",
          data: null
      });
  }

  if (password.length < 8) {
      return res.status(400).json({
          status: 102,
          message: "Password harus memiliki minimal 8 karakter",
          data: null
      });
  }

  db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
      if (err || results.length === 0) {
          return res.status(401).json({
              status: 103,
              message: "Username atau password salah",
              error: err ? err.message : null,
              data: null
          });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(401).json({
              status: 103,
              message: "Username atau password salah",
              data: null
          });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '12h' });
      console.log('Generated Token:', token);

      res.status(200).json({
          status: 0,
          message: "Login Sukses",
          data: {
              token: token
          }
      });
  });
});


/**
 * @swagger
 * /api/profile:
 *   get:
 *     security:
 *       - Authorization: []
 *     tags: [1. Module Membership]
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Sukses"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *                         example: user@nutech-integrasi.com
 *                       first_name:
 *                         example: User
 *                       last_name:
 *                         example: Nutech
 *                       profile_image:
 *                         type: string
 *                         example: https://yoururlapi.com/profile.jpeg
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: null
 *                   example: null
 */
router.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
  
    db.query('SELECT id, first_name, last_name, email FROM user WHERE id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'User tidak ditemukan' });
      }
  
      res.status(200).json(results[0]);
    });
});

/**
 * @swagger
 * /api/profile/update:
 *   put:
 *     security:
 *       - Authorization: []
 *     tags: [1. Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Update Profile berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@nutech-integrasi.com
 *                     first_name:
 *                       type: string
 *                       example: User
 *                     last_name:
 *                       type: string
 *                       example: Nutech
 *                     profile_image:
 *                       type: string
 *                       example: https://yoururlapi.com/profile.jpeg
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: null
 *                   example: null
 */
router.put('/profile/update', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { first_name, last_name } = req.body;

  db.query('UPDATE user SET first_name = ?, last_name = ? WHERE id = ?', [first_name, last_name, userId], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Profile updated' });
  });
});

/**
 * @swagger
 * /api/profile/image:
 *   put:
 *     security:
 *       - Authorization: []
 *     tags: [1. Module Membership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               profile_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Update Profile berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@nutech-integrasi.com
 *                     first_name:
 *                       type: string
 *                       example: User
 *                     last_name:
 *                       type: string
 *                       example: Nutech
 *                     profile_image:
 *                       type: string
 *                       example: https://yoururlapi.com/profile.jpeg
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: "Format Image tidak sesuai"
 *                 data:
 *                   type: null
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: null
 *                   example: null
 */
router.put('/profile/image', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { email, first_name, last_name, profile_image } = req.body;

    const allowedFormats = ['image/jpeg', 'image/png'];
    if (!allowedFormats.includes(profile_image.mimetype)) {
        return res.status(400).json({
            message: 'Hanya format JPEG dan PNG yang diperbolehkan'
        });
    }
  
    db.query('UPDATE user SET email = ?, first_name = ?, last_name = ?, profile_image = ? WHERE id = ?', [email, first_name, last_name, profile_image, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json({ message: 'Profile updated' });
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({
            status: 108,
            message: "Token tidak valid atau kadaluwarsa",
            data: null
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('JWT Verification Error:', err);
            return res.status(401).json({
                status: 108,
                message: "Token tidak valid atau kadaluwarsa",
                data: null
            });
        }
        console.log('User from JWT:', user);
        req.user = user;
        next();
    });
}

module.exports = router;