const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication');
const verifyUserType = require('../middleware/verifyUserType');
const ratingsAndReviewsController = require('../controllers/ratingsAndReviewController');
const { validateBody, validateUuidParam } = require('../middleware/validation');
const { ratingValidation } = require('../utils/validationSchemas');

router.post('/createrating/:userId', authentication, verifyUserType('regular', 'premium'), validateUuidParam('userId'), validateBody(ratingValidation.create), ratingsAndReviewsController.createRating);

router.get('/getrating/:id', authentication, verifyUserType('admin', 'regular', 'premium', 'guest'), validateUuidParam('id'), ratingsAndReviewsController.getRating);

router.put('/updaterating/:id', authentication, verifyUserType('admin', 'regular', 'premium'), validateUuidParam('id'), validateBody(ratingValidation.create), ratingsAndReviewsController.updateRating);

router.delete('/deleterating/:id', authentication, verifyUserType('admin'), validateUuidParam('id'), ratingsAndReviewsController.deleteRating);

module.exports = router;