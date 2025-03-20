// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
    
    // Handle OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    // Simple router
    if (path === '/api/users/register' && request.method === 'POST') {
      return handleRegister(request, env, corsHeaders);
    } else if (path === '/api/users/login' && request.method === 'POST') {
      return handleLogin(request, env, corsHeaders);
    } else if (path === '/api/seed' && request.method === 'GET') {
      return handleSeed(request, env, corsHeaders);
    }
    
    // Default 404 response
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  }
};

async function handleRegister(request, env, corsHeaders) {
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
    
    // Generate a simple ID
    const userId = crypto.randomUUID();
    
    // Store password as plain text for this simplified example
    // In production, you should use proper password hashing
    await env.DB.prepare(
      'INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, name, email, password, Date.now()).run();
    
    // Create a simple token
    const token = btoa(JSON.stringify({ id: userId, name, email }));
    
    return new Response(JSON.stringify({ token }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}

async function handleLogin(request, env, corsHeaders) {
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
    
    // Create a simple token
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
}

async function handleSeed(request, env, corsHeaders) {
  try {
    // Create tables if they don't exist
    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS children (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        age_group TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      
      CREATE TABLE IF NOT EXISTS content (
        id TEXT PRIMARY KEY,
        pillar_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        age_group TEXT NOT NULL,
        content_type TEXT NOT NULL,
        content_data TEXT NOT NULL
      );
    `);
    
    // Seed some basic content
    const pillars = [
      {
        id: 1,
        title: 'Independence & Problem-Solving',
        description: 'Help your child develop independence and problem-solving skills.'
      },
      {
        id: 2,
        title: 'Growth Mindset & Resilience',
        description: 'Foster a growth mindset and resilience in your child.'
      }
    ];
    
    for (const pillar of pillars) {
      await env.DB.prepare(
        'INSERT OR IGNORE INTO content (id, pillar_id, title, description, age_group, content_type, content_data) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        `pillar_${pillar.id}`,
        pillar.id,
        pillar.title,
        pillar.description,
        'all',
        'pillar',
        JSON.stringify(pillar)
      ).run();
    }
    
    return new Response(JSON.stringify({ message: 'Database seeded successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
