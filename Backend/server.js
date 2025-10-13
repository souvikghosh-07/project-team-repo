import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

// 1. Load environment variables from .env file
dotenv.config();

// 2. Import the database pool from our separate db.js file
import pool from './db.js';

const app = express();
const port = 3001;

// --- Middleware ---
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Session Middleware Setup
app.use(session({
    // 3. Use the secret from our .env file
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// --- Multer Setup for Image Uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `listing-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// --- Middleware to Protect Routes ---
const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'You must be logged in to do that.' });
    }
};

const isServiceProvider = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Service Provider') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Service providers only.' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admins only.' });
    }
};

// --- Authentication Routes ---
app.post('/api/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role]);
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }
        res.status(500).json({ message: 'Server error.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
            res.status(200).json({ message: 'Login successful!', user: req.session.user });
        } else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/api/current-user', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Could not log out.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// --- Listing Routes ---
app.post('/api/listings', isServiceProvider, upload.single('image'), async (req, res) => {
    const { title, description, price, location, category } = req.body;
    const provider_id = req.session.user.id;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !price || !location || !category) {
        return res.status(400).json({ message: 'Title, price, location, and category are required.' });
    }
    try {
        const sql = `INSERT INTO listings (title, description, price, location, category, image_path, provider_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await pool.execute(sql, [title, description, price, location, category, image_path, provider_id]);
        res.status(201).json({ message: 'Listing created successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating listing.' });
    }
});

app.get('/api/listings', async (req, res) => {
    try {
        const sql = `
            SELECT 
                l.*, 
                AVG(r.rating) AS average_rating, 
                COUNT(r.id) AS review_count
            FROM 
                listings l
            LEFT JOIN 
                bookings b ON l.id = b.listing_id
            LEFT JOIN 
                reviews r ON b.id = r.booking_id
            WHERE 
                l.approval_status = 'Approved'
        `;
        
        const params = [];
        let filterConditions = '';

        if (req.query.category) {
            filterConditions += ' AND l.category = ?';
            params.push(req.query.category);
        }
        if (req.query.location) {
            filterConditions += ' AND l.location LIKE ?';
            params.push(`%${req.query.location}%`);
        }
        
        const finalSql = sql + filterConditions + ' GROUP BY l.id ORDER BY l.created_at DESC';

        const [listings] = await pool.query(finalSql, params);
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching listings.' });
    }
});

app.get('/api/listings/my-listings', isServiceProvider, async (req, res) => {
    try {
        const provider_id = req.session.user.id;
        const sql = 'SELECT * FROM listings WHERE provider_id = ? ORDER BY created_at DESC';
        const [listings] = await pool.execute(sql, [provider_id]);
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching listings.' });
    }
});

app.delete('/api/listings/:id', isServiceProvider, async (req, res) => {
    try {
        const listingId = req.params.id;
        const provider_id = req.session.user.id;
        const [rows] = await pool.execute('SELECT * FROM listings WHERE id = ? AND provider_id = ?', [listingId, provider_id]);
        if (rows.length === 0) {
            return res.status(403).json({ message: 'You are not authorized to delete this listing.' });
        }
        await pool.execute('DELETE FROM listings WHERE id = ?', [listingId]);
        res.status(200).json({ message: 'Listing deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting listing.' });
    }
});

// --- Booking Routes ---
app.post('/api/bookings', isLoggedIn, async (req, res) => {
    const { listing_id, booking_date, booking_time } = req.body;
    const customer_id = req.session.user.id;
    if (!listing_id || !booking_date || !booking_time) {
        return res.status(400).json({ message: 'Missing required booking information.' });
    }
    try {
        const sql = `INSERT INTO bookings (listing_id, customer_id, booking_date, booking_time) VALUES (?, ?, ?, ?)`;
        await pool.execute(sql, [listing_id, customer_id, booking_date, booking_time]);
        res.status(201).json({ message: 'Booking confirmed successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while creating booking.' });
    }
});

app.get('/api/bookings/my-bookings', isServiceProvider, async (req, res) => {
    const provider_id = req.session.user.id;
    try {
        const sql = `
            SELECT 
                b.id, b.booking_date, b.booking_time, b.status,
                l.title AS service_title,
                u.email AS customer_email
            FROM bookings AS b
            JOIN listings AS l ON b.listing_id = l.id
            JOIN users AS u ON b.customer_id = u.id
            WHERE l.provider_id = ?
            ORDER BY b.booking_date, b.booking_time ASC
        `;
        const [bookings] = await pool.execute(sql, [provider_id]);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
});

app.get('/api/bookings/my-customer-bookings', isLoggedIn, async (req, res) => {
    const customer_id = req.session.user.id;
    try {
        const sql = `
            SELECT 
                b.id, b.booking_date, b.booking_time, b.status,
                l.title AS service_title, l.location
            FROM bookings AS b
            JOIN listings AS l ON b.listing_id = l.id
            WHERE b.customer_id = ?
            ORDER BY b.booking_date DESC
        `;
        const [bookings] = await pool.execute(sql, [customer_id]);
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching bookings.' });
    }
});

// --- Review Routes ---
app.post('/api/reviews', isLoggedIn, async (req, res) => {
    const { booking_id, rating, comment } = req.body;
    const customer_id = req.session.user.id;
    if (!booking_id || !rating) {
        return res.status(400).json({ message: 'Booking ID and rating are required.' });
    }
    try {
        const [bookingRows] = await pool.execute('SELECT * FROM bookings WHERE id = ? AND customer_id = ?', [booking_id, customer_id]);
        if (bookingRows.length === 0) {
            return res.status(403).json({ message: 'You are not authorized to review this booking.' });
        }
        const sql = 'INSERT INTO reviews (booking_id, rating, comment) VALUES (?, ?, ?)';
        await pool.execute(sql, [booking_id, rating, comment]);
        res.status(201).json({ message: 'Thank you for your review!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'You have already reviewed this booking.' });
        }
        res.status(500).json({ message: 'Server error while submitting review.' });
    }
});

// --- Admin Routes ---
app.get('/api/admin/stats', isAdmin, async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT COUNT(*) AS total_users FROM users WHERE role != "Admin"');
        const [providers] = await pool.execute('SELECT COUNT(*) AS total_providers FROM users WHERE role = "Service Provider"');
        const [listings] = await pool.execute('SELECT COUNT(*) AS total_listings FROM listings');
        const [bookings] = await pool.execute('SELECT COUNT(*) AS total_bookings FROM bookings');

        res.status(200).json({
            totalUsers: users[0].total_users,
            totalProviders: providers[0].total_providers,
            totalListings: listings[0].total_listings,
            totalBookings: bookings[0].total_bookings,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching stats.' });
    }
});

app.get('/api/admin/top-categories', isAdmin, async (req, res) => {
    try {
        const sql = `
            SELECT l.category, COUNT(b.id) AS booking_count
            FROM bookings b JOIN listings l ON b.listing_id = l.id
            GROUP BY l.category ORDER BY booking_count DESC LIMIT 5;
        `;
        const [categories] = await pool.query(sql);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching top categories.' });
    }
});

app.get('/api/admin/top-services', isAdmin, async (req, res) => {
    try {
        const sql = `
            SELECT l.title, COUNT(b.id) AS booking_count
            FROM bookings b JOIN listings l ON b.listing_id = l.id
            GROUP BY l.title ORDER BY booking_count DESC LIMIT 5;
        `;
        const [services] = await pool.query(sql);
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching top services.' });
    }
});

app.get('/api/admin/pending-listings', isAdmin, async (req, res) => {
    try {
        const sql = `SELECT * FROM listings WHERE approval_status = 'Pending' ORDER BY created_at DESC`;
        const [listings] = await pool.query(sql);
        res.status(200).json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching pending listings.' });
    }
});

app.patch('/api/admin/listings/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }
    try {
        const sql = `UPDATE listings SET approval_status = ? WHERE id = ?`;
        await pool.execute(sql, [status, id]);
        res.status(200).json({ message: `Listing has been ${status.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating listing status.' });
    }
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
