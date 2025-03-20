// src/index.js - Complete working version

// Create a router for handling requests
const router = {
  routes: {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
    OPTIONS: {}
  },
  
  get(path, handler) {
    this.routes.GET[path] = handler;
  },
  
  post(path, handler) {
    this.routes.POST[path] = handler;
  },
  
  options(path, handler) {
    this.routes.OPTIONS[path] = handler;
  },
  
  handle(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    // Handle OPTIONS requests for CORS
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    // Find the matching route handler
    const handler = this.routes[method][path];
    
    if (handler) {
      return handler(request, env, ctx);
    }
    
    // Default 404 response
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  }
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // For development; in production, use your specific domain
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-token',
  'Access-Control-Allow-Credentials': 'true'  // Add this if you're using credentials
};


// Test endpoint
router.get('/api/test', (request, env) => {
  return new Response(JSON.stringify({ message: 'API is working!' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
});

// Database check endpoint
router.get('/api/db-check', async (request, env) => {
  try {
    // Try a simple query
    const result = await env.DB.prepare('SELECT sqlite_version()').first();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Database connection successful',
      version: result 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// Table check endpoint
router.get('/api/table-check', async (request, env) => {
  try {
    // Check if tables exist
    const tables = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table'"
    ).all();
    
    // Get structure of users table if it exists
    let userColumns = [];
    if (tables.results.some(table => table.name === 'users')) {
      userColumns = await env.DB.prepare(
        "PRAGMA table_info(users)"
      ).all();
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      tables: tables.results,
      userColumns: userColumns.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// Database write test endpoint
router.get('/api/db-test', async (request, env) => {
  try {
    // Try a simple insert
    const result = await env.DB.prepare(
      'INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(
      crypto.randomUUID(),
      'Test User',
      `test${Date.now()}@example.com`, // Add timestamp to make email unique
      'password123',
      Date.now()
    ).run();
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Database write successful',
      result: result 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// User registration endpoint
router.post('/api/users/register', async (request, env) => {
  try {
    const { name, email, password } = await request.json();
    
    // Validate input
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Please provide all required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Check if user already exists
    const existingUser = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Generate ID
    const userId = crypto.randomUUID();
    
    // Insert user
    await env.DB.prepare(
      'INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, name, email, password, Date.now()).run();
    
    // Generate token
    const token = btoa(JSON.stringify({ id: userId, name, email }));
    
    return new Response(JSON.stringify({ token }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// User login endpoint
router.post('/api/users/login', async (request, env) => {
  try {
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Please provide email and password' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Find user
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Generate token
    const token = btoa(JSON.stringify({ id: user.id, name: user.name, email: user.email }));
    
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// Export default function to handle requests
export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  }
};
