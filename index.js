const express=require('express')
const app=express();
const router = express.Router();
const  morgan = require("morgan");
const cors=require("cors")
// const mongoose=require('mongoose')
const bodyParser = require('body-parser');
const appRoutes = require("./route/api")(router);
// const upload=require('./middleware/upload')
app.use('/upload',express.static('uploads'));

const mongoose = require('mongoose')
const DB ="mongodb+srv://mern:kju5566@cluster0.ql0e8.mongodb.net/genius?retryWrites=true&w=majority";
mongoose.connect(DB)
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}));

// mongoose.connect("mongodb://localhost:27017/krunal")

app.use('/',appRoutes);

app.listen(9000,()=>console.log("succsessfull"));