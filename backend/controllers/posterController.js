import asyncHandler from '../middleware/asyncHandler.js';
import Poster from '../models/posterModel.js';

// @desc    Get all posters
// @route   GET /api/posters
// @access  Public
const getPosters = asyncHandler(async (req, res) => {
  const posters = await Poster.find({});
  res.json(posters);
});

// @desc    Create a poster
// @route   POST /api/posters
// @access  Private/Admin
const createPoster = asyncHandler(async (req, res) => {
  const poster = new Poster({
    title: 'Sample Poster',
    image: '/images/sample-poster.jpg',
    link: '/fashion/sale',
    user: req.user._id,
  });

  const createdPoster = await poster.save();
  res.status(201).json(createdPoster);
});

// @desc    Update a poster
// @route   PUT /api/posters/:id
// @access  Private/Admin
const updatePoster = asyncHandler(async (req, res) => {
  const { title, image, link } = req.body;

  const poster = await Poster.findById(req.params.id);

  if (poster) {
    poster.title = title;
    poster.image = image;
    poster.link = link;

    const updatedPoster = await poster.save();
    res.json(updatedPoster);
  } else {
    res.status(404);
    throw new Error('Poster not found');
  }
});

// @desc    Delete a poster
// @route   DELETE /api/posters/:id
// @access  Private/Admin
const deletePoster = asyncHandler(async (req, res) => {
  const poster = await Poster.findById(req.params.id);

  if (poster) {
    await Poster.deleteOne({ _id: poster._id });
    res.json({ message: 'Poster removed' });
  } else {
    res.status(404);
    throw new Error('Poster not found');
  }
});

export { getPosters, createPoster, updatePoster, deletePoster };