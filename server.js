/**
 * EXPRESS SERVER WITH POSTGRESQL
 * RESTful API for E-commerce Admin Panel
 */

import express from'express';
import cors from'cors';
import pool from'./db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================================================
// PRODUCTS ENDPOINTS
// ============================================================================

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, stock, category } = req.body;
    const status = stock < 20 ? 'low-stock' : 'active';
    
    const result = await pool.query(
      'INSERT INTO products (name, price, stock, category, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, stock, category, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const status = stock < 20 ? 'low-stock' : 'active';
    
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, stock = $3, category = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, price, stock, category, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted', product: result.rows[0] });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============================================================================
// ORDERS ENDPOINTS
// ============================================================================

// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY date DESC, id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT update order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

//
// Add this new endpoint
app.patch('/api/products/:id/restock', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body; // New stock quantity
    
    const result = await pool.query(
      'UPDATE products SET stock = stock + $1 WHERE id = $2 RETURNING *',
      [quantity, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error restocking product:', error);
    res.status(500).json({ error: 'Failed to restock product' });
  }
});


// ============================================================================
// ANALYTICS ENDPOINT
// ============================================================================

// GET dashboard stats
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        SUM(price * stock) as total_inventory_value,
        COUNT(CASE WHEN stock < 20 THEN 1 END) as low_stock_items,
        (SELECT COUNT(*) FROM orders WHERE status = 'pending') as pending_orders
      FROM products
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    database: 'PostgreSQL',
    timestamp: new Date() 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(` API available at http://localhost:${PORT}/api`);
  console.log(` Health check: http://localhost:${PORT}/health`);
});