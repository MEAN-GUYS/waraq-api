const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(auth, validate(reviewValidation.createReview), reviewController.createReview)
  .get(validate(reviewValidation.getReviews), reviewController.getReviews);

router.route('/:reviewId').delete(auth, validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;
