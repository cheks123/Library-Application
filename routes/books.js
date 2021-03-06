const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeType = ['images/jpeg', 'images/png', 'images/gif']
const upload = multer({
    dest: uploadPath
    // fileFilter: (req, file, callback)=>{
    //     callback(null, imageMimeType.includes(file.mimetype));

    // }
})



//All books route
router.get('/', async (req, res)=>{
    let query = Book.find();
    if(req.query.title != null && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishBefore != null && req.query.publishBefore != ''){
        query = query.lte('publishDate', req.query.publishBefore);
    }
    if(req.query.publishAfter != null && req.query.publishAfter != ''){
        query = query.gte('publishDate', req.query.publishAfter);
    }

    try{
        const books = await query.exec()
        res.render('books/index', {
            books:books,
            searchOptions: req.query
        })

    }
    catch{
        redirect('/')
    }

    
});

//New books route
router.get('/new', async (req, res)=>{

    renderNewPage(res, new Book());
    
});

//Create book route
router.post('/', upload.single('cover'), async (req,res)=>{
    const fileName = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try{
        const newBook = await book.save();
        //res.redirect(`books/${newBook.id}`)
        res.redirect('books');
    }
    catch{
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName);
        }
        
        renderNewPage(res, book, true);

    }
});

async function renderNewPage(res, book, hasError = false){
    try{
        const authors = await Author.find({});
        const params = {
            authors:authors,
            book:book
        }
        if(hasError) params.errorMessage = 'Error creating book'
        res.render('books/new', params)
    }
    catch{
        res.redirect('books/index');
    }
}

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath, fileName), err=>{
        if(err) console.error(err);
    });
}

module.exports = router;