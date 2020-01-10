const express = require('express');

const auth = require('../auth');
const Post = require('../models/posts');

const router = express.Router();

router.route('/')
    .get((req, res, next) => {
        Post.find()
            .then((posts) => {
                res.json(posts);
            }).catch(next);
    })
    .post(auth.verifyUser, (req, res, next) => {
        let post = new Post(req.body);
        post.postByName = req.user.username;
        post.postBy = req.user._id;
        post.authorPic = req.user.profilePicture;
        post.save()
            .then((post) => {
                res.statusCode = 201;
                res.json(post);
            }).catch(next);
    })
    .put((req, res) => {
        res.statusCode = 405;
        res.json("Sorry! Cannot make an update");
    })
    .delete();


router.route('/:id')   
    .get((req, res, next) => {
        Post.findById(req.params.id)
            .then((post) => {
                //In case of post being null
                if(post == null) throw new Error("Post not found");

                res.statusCode = 200;
                res.json(post);
            }).catch(next);
    })
    .post((req, res) => {
        res.statusCode = 405;
        res.json("Sorry! Cannot post here");
    })
    .put(auth.verifyUser, (req, res, next) => {
        Post.findByIdAndUpdate({_id: req.params.id, postBy: req.user._id}, {$set: req.body}, {new: true})
            .then((post) => {
                if(post == null) throw new Error("Post not found");

                res.json(post);
            }).catch(next);
    })
    .delete();



router.route('/:id/love')
    .get((req, res, next) => {
        Post.findById(req.params.id)
            .then((post) => {
                res.json(post.loveReacts);
            }).catch(next);
    })
    .post(auth.verifyUser, (req, res, next) => {
        Post.findById(req.params.id)
            .then((post) => {
                post.loveReacts.push(req.user._id);
                post.loveCount += 1;
                post.save()
                    .then((post) => {
                        res.json(post.loveReacts);
                    }).catch(next);
            }).catch(next);
    })
    .delete();

module.exports = router;