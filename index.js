const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Chat = require('./models/chat');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));    

main()
.then(() => {
    console.log('Connected to MongoDB')
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

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

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get('/', (req,res) => {
    res.send('Working man');
})

app.listen(8080, () => {
    console.log('Server is running on port 8080');  
})