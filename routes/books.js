const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeType = ['images/jpeg', 'images/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback)=>{

    }
})



//All books route
router.get('/', async (req, res)=>{
    res.send("All books")
    
});

//New books route
router.get('/new', async (req, res)=>{
    renderNewPage(res, new Book())
    
});

//Create book route
router.post('/', upload.single('cover'), async (req,res)=>{
    const fileName = req.file != null ? req.filename : null;
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
        //req.redirect(`books/${newBook.id}`)
        req.redirect('books');
    }
    catch{
        renderNewPage(res, book, true);

    }
    res.send("Create book")
});

async function renderNewPage(res, book, hasError = false){
    try{
        const authors = await Author.find({});
        const params = {
            authors:author,
            book:book
        }
        if(hasError) params.errorMessage = 'Error creating book'
        res.render('books/new', params)
    }
    catch{
        res.redirect('books/index')
    }
}


module.exports = router;