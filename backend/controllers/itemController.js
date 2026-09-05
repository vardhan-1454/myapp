const { query, checkConnection } = require('../config/db');

// In-memory fallback dataset in case MySQL server is not yet running
let mockItems = [
  { id: 1, title: 'Sample Item 1 (Fallback Mode)', description: 'MySQL server is offline or unreachable. Start MySQL to use live DB.', category: 'System', status: 'pending', priority: 'high', created_at: new Date() },
  { id: 2, title: 'Sample Item 2 (Fallback Mode)', description: 'API routes remain functional and ready for connection.', category: 'Demo', status: 'completed', priority: 'medium', created_at: new Date() }
];

// GET /api/items - Retrieve all items
exports.getAllItems = async (req, res) => {
  const dbHealth = await checkConnection();
  if (dbHealth.status !== 'connected') {
    return res.json({
      success: true,
      dbStatus: 'disconnected',
      isFallback: true,
      message: `MySQL unreachable (${dbHealth.error}). Displaying sample fallback data.`,
      data: mockItems
    });
  }

  try {
    const items = await query('SELECT * FROM items ORDER BY created_at DESC');
    res.json({
      success: true,
      dbStatus: 'connected',
      isFallback: false,
      data: items
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/items/:id - Retrieve single item
exports.getItemById = async (req, res) => {
  const { id } = req.params;
  const dbHealth = await checkConnection();
  
  if (dbHealth.status !== 'connected') {
    const item = mockItems.find(i => i.id === parseInt(id, 10));
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    return res.json({ success: true, isFallback: true, data: item });
  }

  try {
    const [item] = await query('SELECT * FROM items WHERE id = ?', [id]);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/items - Create new item
exports.createItem = async (req, res) => {
  const { title, description, category, status, priority } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const dbHealth = await checkConnection();

  if (dbHealth.status !== 'connected') {
    const newItem = {
      id: Date.now(),
      title,
      description: description || '',
      category: category || 'General',
      status: status || 'pending',
      priority: priority || 'medium',
      created_at: new Date()
    };
    mockItems.unshift(newItem);
    return res.status(201).json({
      success: true,
      isFallback: true,
      message: 'Item saved to mock storage (MySQL offline)',
      data: newItem
    });
  }

  try {
    const result = await query(
      'INSERT INTO items (title, description, category, status, priority) VALUES (?, ?, ?, ?, ?)',
      [title, description || '', category || 'General', status || 'pending', priority || 'medium']
    );
    res.status(201).json({
      success: true,
      message: 'Item inserted into MySQL database successfully',
      data: { id: result.insertId, title, description, category, status, priority }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/items/:id - Update item
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, status, priority } = req.body;

  const dbHealth = await checkConnection();

  if (dbHealth.status !== 'connected') {
    const index = mockItems.findIndex(i => i.id === parseInt(id, 10));
    if (index === -1) return res.status(404).json({ success: false, message: 'Item not found' });

    mockItems[index] = { ...mockItems[index], ...req.body };
    return res.json({ success: true, isFallback: true, data: mockItems[index] });
  }

  try {
    await query(
      'UPDATE items SET title = COALESCE(?, title), description = COALESCE(?, description), category = COALESCE(?, category), status = COALESCE(?, status), priority = COALESCE(?, priority) WHERE id = ?',
      [title, description, category, status, priority, id]
    );
    res.json({ success: true, message: 'Item updated in MySQL successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/items/:id - Delete item
exports.deleteItem = async (req, res) => {
  const { id } = req.params;

  const dbHealth = await checkConnection();

  if (dbHealth.status !== 'connected') {
    mockItems = mockItems.filter(i => i.id !== parseInt(id, 10));
    return res.json({ success: true, isFallback: true, message: 'Item deleted from mock storage' });
  }

  try {
    await query('DELETE FROM items WHERE id = ?', [id]);
    res.json({ success: true, message: 'Item deleted from MySQL successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
