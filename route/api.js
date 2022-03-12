const express = require("express");
const User = require("../model/user")
const upload = require("../middleware/upload");
const fs = require("fs");
const uploadsDir = __dirname + '../uploads';

module.exports = function (router) {

    router.get('/:id', (req, res) => {
        const id=req.params.id
        User.find({_id: req.params.id}).exec(function (err, ress) {
            res.json({ 'data': ress , success:true})
           
        })
    }),
    router.get('/', (req, res) => {
        const id=req.params.id
        User.find({}).exec(function (err, ress) {
            res.json({ 'data': ress , success:true})
          
        })
    }),
    
    router.put('/:id', upload, async (req, res) => {

        User.findOne({_id: req.params.id}).exec((err, result) => {
            if(req.file==null) {
                result.name=req.body.name;
                result.age=req.body.age;
                result.email=req.body.email;
                result.phonenumber=req.body.phonenumber;
                result.save()
                res.send("hello")
                console.log(err)
            } else {
                result.profile_file= req.file.filename;
                result.profile_url = "http://localhost:9000/upload/"+ req.file.filename;
                result.name=req.body.name;
                result.age=req.body.age;
                result.email=req.body.email;
                result.phonenumber=req.body.phonenumber;
                result.save(function(err){
                    if(err){
                        console.log(err);
                    }
                });
               res.send("hellllll") 
            }
        })
    })
   
   router.delete("/:id", async (req, res) => {
        // delete with node and mongoDb data using below formate
        // User.find({ _id: req.params.id }).exec(function (err, ress) {
        //     res.json({'data':ress})
        //     console.log("ress.profile_file", ress[0].profile_file);
        //     fs.unlink("uploads/"+ress[0].profile_file, async (err) => {
        //         if (err) throw err;
                const user = await User.findByIdAndDelete(req.params.id);
            // deleteMany() for delete all file with one click
                res.send(user)
            })
    //     })
    // }),

        router.post('/', (req, res) => {
            upload(req, res, function (err) {
                console.log("req.file---", req.file);
                console.log("req.body",req.body)
                if (err) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        res.json({ success: false, message: 'Profile Image too large !!!' });
                    } else if (err.code === 'filetype') {
                        res.json({ success: false, message: 'Invaild : Only jpeg, jpg and png supported !!!' });
                    } else {
                        console.log(err);
                        res.json({ success: false, message: 'Profile Image not upload !!!' });
                    }
                } else {
                    if (!req.file) {
                        res.json({ success: false, message: 'No file selected !!!' });
                    } else {
                        let user = new User();


                        user.name=req.body.name;
                        user.age=req.body.age;
                        user.email=req.body.email;
                        user.phonenumber=req.body.phonenumber
                        user.profile_file = req.file.filename;
                        user.profile_url = "http://localhost:9000/upload/"+req.file.filename;
                        user.save(function (err) {
                            if (err) {
                                console.log(err.errors.name);
                                if (err.errors.name) {
                                    res.json({ success: false, message: "Name is required" });
                                }
                                else {
                                    res.json({ success: false, message: err });
                                }
                            } else {
                                res.json({ success: true, message: 'Registration Successfully' });
                            }
                        });
                    }
                }
            })

        })


    return router;
}