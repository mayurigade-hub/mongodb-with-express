const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Chat = require('./models/chat');
const methodOverride = require('method-override');
const ExpressError = require('./ExpressError');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));    
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

main()
.then(() => {
    console.log('Connected to MongoDB')
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

//Index route
app.get('/chats', async (req, res) => {
    let chats = await Chat.find();
    console.log(chats);
    res.render('index.ejs', { chats });
});

//New Route
app.get('/chats/new', (req, res) => {
    res.render('new.ejs');
});

//Route to understand the error handlers in Async functions
app.get("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
        next (new ExpressError('Chat not found', 404));
    }       
    res.render('show.ejs', { chat });
});

//Create Route
app.post("/chats", async (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date()
    })
    await newChat.save();
    res.redirect('/chats');
});

//Edit Route
app.get('/chats/:id/edit', async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render('edit.ejs', { chat });
});

//Update Route
app.put('/chats/:id', async (req, res) => {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    await Chat.findByIdAndUpdate(id, { msg: newMsg }, {runValidators: true, new: true});
    res.redirect('/chats');
});

//Destroy Route
app.delete('/chats/:id', async (req, res) => {
    let { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect('/chats');
}); 

app.get('/', (req,res) => {
    res.send('Working man');
})

//Error Handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = 'Something went wrong' } = err;
    res.statusCode(statusCode).send(message);
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');  
})