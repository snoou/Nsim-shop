import express from 'express';
const router = express.Router();
import {
  getPosters,
  createPoster,
  updatePoster,
  deletePoster,
} from '../controllers/posterController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getPosters)
  .post(protect, admin, createPoster);

router.route('/:id')
  .put(protect, admin, updatePoster)
  .delete(protect, admin, deletePoster);

export default router;