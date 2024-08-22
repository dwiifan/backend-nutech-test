require('dotenv').config();

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @swagger
 * /api/banner:
 *   get:
 *     security:
 *       - Authorization: []
 *     tags: [2. Module Information]
 *     responses:
 *       200:
 *         description: Banner data
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
 *                       banner_name:
 *                         type: string
 *                         example: "Banner 1"
 *                       banner_image:
 *                         type: string
 *                         example: "https://nutech-integrasi.app/dummy.jpg"
 *                       description:
 *                         type: string
 *                         example: "Lerem Ipsum Dolor sit amet"
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
router.get('/banner', authenticateToken, (req, res) => {
    db.query('SELECT banner_name, banner_image, description FROM banner', (err, results) => {
        if (err) {
            return res.status(500).json({ status: 1, message: 'Server error', data: [] });
        }

        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: results
        });
    });
});

/**
 * @swagger
 * /api/services:
 *   get:
 *     security:
 *       - Authorization: []
 *     tags: [2. Module Information]
 *     responses:
 *       200:
 *         description: Service data
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
 *                       service_code:
 *                         type: string
 *                         example: "PAJAK"
 *                       service_name:
 *                         type: string
 *                         example: "Pajak PBB"
 *                       service_icon:
 *                         type: string
 *                         example: "https://nutech-integrasi.app/dummy.jpg"
 *                       service_tariff:
 *                         type: int
 *                         example: 40000
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
router.get('/services', authenticateToken, (req, res) => {
    db.query('SELECT service_code, service_name, service_icon, service_tariff FROM services', (err, results) => {
        if (err) {
            return res.status(500).json({ status: 1, message: 'Server error', data: [] });
        }

        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: results
        });
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