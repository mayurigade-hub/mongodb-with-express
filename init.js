const mongoose = require('mongoose');

main()
.then(() => {
    console.log('Connected to MongoDB')
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChats = [
    {
        from: 'John',
        to: 'Doe',
        msg: 'Hello, how are you?',
        created_at: new Date()
    },
    {
        from: 'Jane',
        to: 'Smith',
        msg: 'I am doing well, thanks for asking!',
        created_at: new Date()
    },
    {
        from: 'Alice',
        to: 'Bob',
        msg: 'Hey, are you free this weekend?',
        created_at: new Date()
    },
    {
        from: 'Charlie',
        to: 'David',
        msg: 'Yes, I am free. What do you have in mind?',
        created_at: new Date()
    }
];

chat.insertMany(allChats)
.then(() => {
    console.log('Data inserted successfully');
})
.catch((err) => {
    console.error('Error inserting data:', err);
});