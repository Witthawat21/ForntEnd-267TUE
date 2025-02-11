const express = require('express');
const Sequelize = require('sequelize');
const axios = require('axios');
const app = express();
const methodOverride = require('method-override');

// ตั้งค่า EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // ใช้สำหรับ parse ข้อมูลจากฟอร์ม
app.use(express.json()); // Middleware สำหรับ parse JSON requests
app.use(methodOverride('_method'));  // ใช้ method-override สำหรับฟอร์มที่ต้องการ PUT หรือ DELETE

// เชื่อมต่อกับฐานข้อมูล SQLite
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    storage: './Database/SQBooks.sqlite'
});

// กำหนด Model ของ Book
const Book = sequelize.define('book', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// สร้างตารางถ้ายังไม่มีอยู่
sequelize.sync();

// 📌 Route: แสดงรายการหนังสือทั้งหมด
app.get('/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        res.render('books', { books });  // Render หน้า books.ejs พร้อมข้อมูลหนังสือ
    } catch (err) {
        res.status(500).send(err);
    }
});

// 📌 Route: ฟอร์มเพิ่มหนังสือใหม่
app.get('/books/new', (req, res) => {
    res.render('create');  // Render หน้า create.ejs สำหรับเพิ่มหนังสือใหม่
});

// 📌 Route: เพิ่มหนังสือใหม่
app.post('/books', async (req, res) => {
    try {
        const { title, author } = req.body;
        const book = await Book.create({ title, author });
        res.redirect('/books');
    } catch (err) {
        res.status(500).send(err);
    }
});

// 📌 Route: ฟอร์มแก้ไขหนังสือ
app.get('/books/:id/edit', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.render('edit', { book });  // Render หน้า edit.ejs สำหรับแก้ไขหนังสือ
    } catch (err) {
        res.status(500).send(err);
    }
});

// 📌 Route: แก้ไขข้อมูลหนังสือ
app.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        await book.update(req.body);
        res.redirect('/books');
    } catch (err) {
        res.status(500).send(err);
    }
});

// 📌 Route: ลบหนังสือ
app.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        await book.destroy();
        res.redirect('/books');
    } catch (err) {
        res.status(500).send(err);
    }
});

// เริ่มต้นเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
