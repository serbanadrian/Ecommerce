import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import verifyToken from './verifyToken.js';

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

app.post('/login', async (req,res) =>{
    const { userName, password } = req.body;
    if( !userName || !password ){
        return res.status(400).json({error: 'Username and password are required!'});
    }
    try{
        const user = await pool.query('SELECT * FROM users WHERE username =$1',[userName]);
        if(user.rows.length === 0){
            return res.status(401).json({error: 'Invalid credentials'});
        }
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
        if(!isValidPassword){
            return res.status(401).json({error: 'Invalid credentials'});
        }
        const token = jwt.sign(
            {userId: user.rows[0].id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        res.json({token});
    } catch (err){
        console.log(err);
        res.status(500).json({error: 'Server error'});
    }
});

app.post('/register', async (req,res) =>{
    const {userName, password, confirmPassword} = req.body;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));
    if( !userName || !password || !confirmPassword){
        return res.status(400).json({error: 'Username, password and password confirmation are mandatory!'});
    }
    if(password !== confirmPassword){
       return res.status(400).json({error: 'The passwords are not identical!'});
    }
    try{
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [userName, hashedPassword]
        );
        res.status(200).json(result.rows[0]);
    } catch (err){
        res.status(500).json({error: 'User already exist!'});
        console.log(err);
    }
});

app.use('/uploads', express.static(uploadsDir));

app.post('/products', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, category, stock } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const userId = req.user.userId;

        const result = await pool.query(
            `INSERT INTO products (title, description, price, category, image, stock, user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, description, price, category, imagePath, stock, userId]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Eroare la adăugarea produsului' });
    }
});

app.get('/getProducts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Eroare la preluarea produselor' });
    }
});

app.get('/getUserProducts', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE user_id = $1',
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Eroare la obținerea produselor utilizatorului:', err);
    res.status(500).json({ error: 'Eroare server la obținerea produselor' });
  }
});

app.get('/profile', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT username AS name, bio, avatar FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilizatorul nu a fost găsit' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Eroare la profil:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

app.post('/addAvatar', verifyToken, upload.single('avatar'), async (req, res) => {
  const userId = req.user.userId;

  if (!req.file) {
    return res.status(400).json({ error: 'Nu s-a trimis niciun fișier' });
  }

  const avatarPath = `/uploads/${req.file.filename}`;

  try {
    await pool.query(
      'UPDATE users SET avatar = $1 WHERE id = $2',
      [avatarPath, userId]
    );

    res.status(200).json({ message: 'Avatar actualizat', avatar: avatarPath });
  } catch (err) {
    console.error('Eroare la actualizarea avatarului:', err);
    res.status(500).json({ error: 'Eroare server' });
  }
});

app.put("/updateBio", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { bio } = req.body;

  try {
    await pool.query("UPDATE users SET bio = $1 WHERE id = $2", [bio, userId]);
    res.status(200).json({ message: "Bio actualizat cu succes." });
  } catch (err) {
    console.error("Eroare la actualizarea bio:", err);
    res.status(500).json({ error: "Eroare server" });
  }
});

app.put('/products/:id', verifyToken, upload.single('image'), async (req, res) => {
  const { title, description, price, category, stock } = req.body;
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const check = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Nu ai voie să editezi acest produs' });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : check.rows[0].image;

    const result = await pool.query(
      `UPDATE products 
       SET title = $1, description = $2, price = $3, category = $4, stock = $5, image = $6 
       WHERE id = $7 RETURNING *`,
      [title, description, price, category, stock, imagePath, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Eroare la actualizarea produsului:', err);
    res.status(500).json({ error: 'Eroare server la editare' });
  }
});

app.delete('/products/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const check = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ error: 'Nu ai voie să ștergi acest produs' });
    }

    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.status(200).json({ message: 'Produs șters cu succes' });

  } catch (err) {
    console.error('Eroare la ștergerea produsului:', err);
    res.status(500).json({ error: 'Eroare server la ștergere' });
  }
});

app.post("/cart/add", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

  try {
    const existing = await pool.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3',
        [quantity || 1, userId, productId]
      );
    } else {
      await pool.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
        [userId, productId, quantity || 1]
      );
    }

    res.status(200).json({ message: "Produs adăugat în coș" });
  } catch (err) {
    console.error("Eroare la adăugare în coș:", err);
    res.status(500).json({ error: "Eroare server" });
  }
});

app.get("/cart", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT c.id AS cart_id, c.quantity, p.*
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Eroare la obținerea coșului:", err);
    res.status(500).json({ error: "Eroare server" });
  }
});

app.delete("/cart/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId;

  try {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2",
      [userId, productId]
    );
    res.status(200).json({ message: "Produs eliminat din coș" });
  } catch (err) {
    console.error("Eroare la ștergere:", err);
    res.status(500).json({ error: "Eroare server" });
  }
});

app.post("/cart/checkout", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const cartItems = await pool.query(
      `SELECT product_id, quantity FROM cart_items WHERE user_id = $1`,
      [userId]
    );

    for (const item of cartItems.rows) {
      const { product_id, quantity } = item;

      // Scade stocul și obține noul stoc
      const updated = await pool.query(
        `UPDATE products 
         SET stock = stock - $1 
         WHERE id = $2 
         RETURNING stock`,
        [quantity, product_id]
      );

      // Dacă stock-ul rezultat e <= 0, șterge produsul
      if (updated.rows[0]?.stock <= 0) {
        await pool.query(
          `DELETE FROM products WHERE id = $1`,
          [product_id]
        );
      }
    }

    // Golește coșul după checkout
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

    res.status(200).json({ message: "Comandă finalizată cu succes!" });
  } catch (err) {
    console.error("Eroare la checkout:", err);
    res.status(500).json({ error: "Eroare server la checkout" });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));