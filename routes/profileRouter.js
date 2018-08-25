const express = require('express');
const bodyParser = require('body-parser');

const Profiles = require('../models/profile');

const profileRouter = express.Router();
profileRouter.use(bodyParser.json());

profileRouter.route('/')
  .get((req, res, next) => {
    Profiles.find({})
      .populate('reporter')
      .then((profiles) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profiles);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    req.body.reporter = req.user._id;
    Profiles.create(req.body)
      .then((profile) => {
        console.log('Profile Created ', profile);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profile);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /profiles');
  })
  .delete((req, res, next) => {
    Profiles.remove({})
      .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
      }, (err) => next(err))
      .catch((err) => next(err));
  });

profileRouter.route('/:profileId')
  .get((req, res, next) => {
    Profiles.findById(req.params.profileId)
      .populate('reporter')
      .then((profile) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profile);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /profiles/' + req.params.profileId);
  })
  .put((req, res, next) => {
    Profiles.findByIdAndUpdate(req.params.profileId, {
      $set: req.body
    }, { new: true })
      .then((profile) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profile);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Profiles.findByIdAndRemove(req.params.profileId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
      })
      .catch((err) => next(err));
  });

module.exports = profileRouter;