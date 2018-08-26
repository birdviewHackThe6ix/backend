const express = require('express');
const bodyParser = require('body-parser');

const Profiles = require('../models/profile');

const profileRouter = express.Router();
profileRouter.use(bodyParser.json());

profileRouter.route('/')
  .get((req, res, next) => {
    Profiles.find(req.query)
      .then((profiles) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(profiles);
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    req.body.hashtag = 'birdview_' + req.body.name;
    Profiles.create(req.body)
      .then((profile) => {
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
    // Profiles.remove({})
    //   .then((response) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(response);
    //   }, (err) => next(err))
    //   .catch((err) => next(err));
    res.statusCode = 403;
    res.end('DELETE operation not supported on /profiles');

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
    // Profiles.findByIdAndRemove(req.params.profileId)
    //   .then((resp) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json(resp);
    //   })
    //   .catch((err) => next(err));
    res.statusCode = 403;
    res.end('DELETE operation not supported on /profiles/' + req.params.profileId);

  });

profileRouter.route('/:profileId/matches')
  .get((req, res, next) => {
    Profiles.findById(req.params.profileId)
      .then((profile) => {
        if (profile != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(profile.matches);
        } else {
          err = new Error('Profile ' + req.params.profileId + ' not found');
          err.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Profiles.findById(req.params.profileId)
      .then((profile) => {
        if (profile != null) {
          profile.matches.push(req.body);
          profile.save()
            .then((profile) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(profile);
            })
            .catch((err) => next(err));
        } else {
          err = new Error('Profile ' + req.params.profileId + ' not found');
          err.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /profiles/'
      + req.params.profileId + '/matches');
  })
  .delete((req, res, next) => {
    Profile.findById(req.params.profileId)
      .then((profile) => {
        if (profile != null) {
          for (var i = profile.matches.length - 1; i >= 0; i--) {
            profile.matches.id(profile.matches[i]._id).remove();
          }
          profile.save()
            .then((profile) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(profile);
            })
            .catch((err) => next(err));
        } else {
          err = new Error('Profile ' + req.params.profileId + ' not found');
          err.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

profileRouter.route('/:profileId/matches/:matchId')
  .get((req, res, next) => {
    Profiles.findById(req.params.profileId)
      .then((profile) => {
        if (profile != null && profile.matches.id(req.params.matchId) != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(profile.matches.id(req.params.matchId));
        } else if (profile == null) {
          err = new Error('Profile ' + req.params.profileId + ' not found');
          err.statusCode = 404;
          return next(err);
        } else {
          err = new Error('Match ' + req.params.matchId + ' not found');
          err.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /profiles/' + req.params.profileId
      + '/matches/' + req.params.matchId);
  })
  .put((req, res, next) => {
    Profiles.findById(req.params.profileId)
      .then((profile) => {
        if (profile != null && profile.matches.id(req.params.matchId) != null) {
          profile.save()
            .then((dish) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(dish);
            })
            .catch((err) => next(err));
        } else if (profile == null) {
          err = new Error('Profile ' + req.params.profileId + ' not found');
          err.statusCode = 404;
          return next(err);
        } else {
          err = new Error('Match ' + req.params.matchId + ' not found');
          err.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Profiles.findById(req.params.profileId)
      .then((profile) => {
        if (profile != null && profile.match.id(req.params.matchId) != null) {
          profile.matches.id(profile.matches[i]._id).remove();
          profile.save()
            .then((profile) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(profile);
            })
            .catch((err) => next(err));
        } else if (profile == null) {
          err = new Error('Profile ' + req.params.profileId + ' not found');
          err.statusCode = 404;
          return next(err);
        } else {
          err = new Error('Match ' + req.params.matchId + ' not found');
          err.statusCode = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = profileRouter;