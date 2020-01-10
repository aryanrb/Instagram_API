const express = require('express');

const Story = require('../models/stories');
const User = require('../models/users');
const auth = require('../auth');

const router = express.Router();

router.route('/')
    .get((req, res, next) => {
        Story.find()
            .then((stories) => {
                res.json(stories);
            }).catch(next);
    })
    .post(auth.verifyUser, (req, res, next) => {
        let story = new Story(req.body);
        story.postBy = req.user._id;
        story.authorPic = req.user.profilePicture;
        story.postByName = req.user.username;
        story.save()
            .then((story) => {
                res.statusCode = 201;
                res.json(story);
            }).catch(next);
    })
    .put((req, res) => {
        res.statusCode = 405;
        res.json("Sorry! Cannot make an update");
    })
    .delete(auth.verifyUser, (req, res, next) => {
        Story.deleteMany({postBy: req.user._id})
            .then((replay) => {
                res.json(replay);
            }).catch(next);
    });


router.route('/:id')
    .get(auth.verifyUser, (req, res, next) => {
        Story.findById(req.params.id)
            .then((story) => {
                User.findById(story.postBy)
                    .then((user) => {
                        console.log(user.username);
                    }).catch(next);
                res.json(story);
            }).catch(next);
    });


router.route('/:id/views')
    .get(auth.verifyUser, (req, res, next) => {
        Story.findById(req.params.id)
            .then((story) => {
                res.json(story.views);
            }).catch(next);
    })
    .post(auth.verifyUser, (req, res, next) => {
        Story.findById(req.params.id)
            .then((story) => { 
                story.views.push(req.user._id);
                story.viewerCount += 1;
                story.save()
                    .then((story) => {
                        res.json(story.views);
                    }).catch(next);
            }).catch(next);
    });

    // .post(auth.verifyUser, (req, res, next) => {
    //     Story.findById(req.params.id)
    //         .then((story) => {
    //             story.views.findById(req.user._id)
    //                 .then((view) => {
    //                     if(view == null){   
    //                         story.views.push(req.user._id);
    //                         story.viewerCount += 1;
    //                         story.save()
    //                             .then((story) => {
    //                                 console.log(story);
    //                                 res.json(story.views);
    //                             }).catch(next);
    //                     }else{
    //                         console.log("Already viewed");
    //                     }
    //                 })
    //         }).catch(next);
    // });

module.exports = router;