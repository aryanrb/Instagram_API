//------------For Instagram Replica WebApi -----------------------//

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const userRouter = require("./routes/users");
const uploadRouter = require('./routes/uploads');
const storiesRouter = require('./routes/stories');
const postRouter = require("./routes/posts");

const url = 'mongodb://localhost:27017/insta';
const PORT = 3000;

const auth = require('./auth');
const app = express();
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
    .then((db) => {
        console.log("Connected to mongodb");
    }, (err) => console.log(err));


app.use('/instagram/users', userRouter);
app.use('/instagram/upload', uploadRouter);
app.use('/instagram/stories', storiesRouter);
app.use('/instagram/posts', postRouter);


app.listen(PORT, () => {
    console.log(`App is running at localhost:${PORT}`);
});
