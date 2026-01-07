const db = require('../config/db'); // Import the shared pool

// --- Controller Functions ---

/**
 * @controller  getMakes
 * @desc        Get all car makes
 * @route       GET /api/makes
 */
const getMakes = async (req, res) => {
  try {
    // Get a connection from the pool and execute the query
    const [makes] = await db.query('SELECT * FROM makes ORDER BY name');
    res.status(200).json({ success: true, data: makes });
  } catch (err) {
    console.error('Error in getMakes:', err);
    res.status(500).json({ success: false, message: 'Database query failed.' });
  }
};

/**
 * @controller  getModelsByMake
 * @desc        Get all models for a specific make
 * @route       GET /api/models/:makeId
 */
const getModelsByMake = async (req, res) => {
  try {
    const { makeId } = req.params;
    if (!makeId || isNaN(parseInt(makeId))) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid make ID' });
    }
    const [models] = await db.query(
      'SELECT * FROM models WHERE make_id = ? ORDER BY name',
      [makeId]
    );
    res.status(200).json({ success: true, data: models });
  } catch (err) {
    console.error('Error in getModelsByMake:', err);
    res.status(500).json({ success: false, message: 'Database query failed.' });
  }
};

/**
 * @controller  getVariantsByModel
 * @desc        Get all variants for a specific model
 * @route       GET /api/variants/:modelId
 */
const getVariantsByModel = async (req, res) => {
  try {
    const { modelId } = req.params;
    if (!modelId || isNaN(parseInt(modelId))) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid model ID' });
    }
    const [variants] = await db.query(
      'SELECT * FROM variants WHERE model_id = ? ORDER BY name',
      [modelId]
    );
    res.status(200).json({ success: true, data: variants });
  } catch (err) {
    console.error('Error in getVariantsByModel:', err);
    res.status(500).json({ success: false, message: 'Database query failed.' });
  }
};

// --- NEW FUNCTIONS ---

/**
 * @controller  createMake
 * @desc        Create a new car make
 * @route       POST /api/makes
 */
const createMake = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Name is required.' });
  }
  try {
    const sql = 'INSERT INTO makes (name) VALUES (?)';
    const [result] = await db.query(sql, [name]);
    res.status(201).json({
      success: true,
      message: 'Make created successfully!',
      newMake: { id: result.insertId, name: name },
    });
  } catch (err) {
    console.error('Error creating make:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'This make already exists.' });
    }
    res.status(500).json({ success: false, message: 'Database query failed.' });
  }
};

/**
 * @controller  createModel
 * @desc        Create a new car model
 * @route       POST /api/models
 */
const createModel = async (req, res) => {
  const { name, make_id } = req.body;
  if (!name || !make_id) {
    return res.status(400).json({ success: false, message: 'Name and make_id are required.' });
  }
  try {
    const sql = 'INSERT INTO models (name, make_id) VALUES (?, ?)';
    const [result] = await db.query(sql, [name, make_id]);
    res.status(201).json({
      success: true,
      message: 'Model created successfully!',
      newModel: { id: result.insertId, name: name, make_id: make_id },
    });
  } catch (err) {
    console.error('Error creating model:', err);
    res.status(500).json({ success: false, message: 'Database query failed.' });
  }
};

/**
 * @controller  createVariant
 * @desc        Create a new car variant
 * @route       POST /api/variants
 */
const createVariant = async (req, res) => {
  const { name, model_id } = req.body;
  if (!name || !model_id) {
    return res.status(400).json({ success: false, message: 'Name and model_id are required.' });
  }
  try {
    const sql = 'INSERT INTO variants (name, model_id) VALUES (?, ?)';
    const [result] = await db.query(sql, [name, model_id]);
    res.status(201).json({
      success: true,
      message: 'Variant created successfully!',
      newVariant: { id: result.insertId, name: name, model_id: model_id },
    });
  } catch (err) {
    console.error('Error creating variant:', err);
    res.status(500).json({ success: false, message: 'Database query failed.' });
  }
};

module.exports = {
  getMakes,
  getModelsByMake,
  getVariantsByModel,
  createMake,    // Added new function
  createModel,   // Added new function
  createVariant, // Added new function
};