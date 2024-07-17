const express = require('express');
const { Website } = require('..');
const router = express.Router();

router.get('/', async (req, res) => {
  const websites = await Website.findAll();
  res.json(websites);
});

router.post('/', async (req, res) => {
  const { name, description } = req.body;
  const newWebsite = await Website.create({ name, description });
  res.json(newWebsite);
});

module.exports = router;
