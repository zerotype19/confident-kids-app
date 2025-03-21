// src/index.js - Complete working version with path parameter support

// Create a router for handling requests
const router = {
  routes: {
    GET: [],
    POST: [],
    PUT: [],
    DELETE: [],
    OPTIONS: []
  },
  
  get(path, handler) {
    this.routes.GET.push({ path, handler });
  },
  
  post(path, handler) {
    this.routes.POST.push({ path, handler });
  },
  
  put(path, handler) {
    this.routes.PUT.push({ path, handler });
  },
  
  delete(path, handler) {
    this.routes.DELETE.push({ path, handler });
  },
  
  options(path, handler) {
    this.routes.OPTIONS.push({ path, handler });
  },
  
  // Find matching route and extract path parameters
  findRoute(method, path) {
    const routes = this.routes[method];
    
    // First try exact match
    const exactMatch = routes.find(route => route.path === path);
    if (exactMatch) {
      return { route: exactMatch, params: {} };
    }
    
    // Then try pattern matching
    for (const route of routes) {
      const pattern = route.path;
      
      // Skip if no parameters in pattern
      if (!pattern.includes(':')) continue;
      
      // Convert route pattern to regex
      const paramNames = [];
      const regexPattern = pattern.replace(/:[^\/]+/g, (match) => {
        paramNames.push(match.substring(1));
        return '([^/]+)';
      });
      
      const regex = new RegExp(`^${regexPattern}$`);
      const match = path.match(regex);
      
      if (match) {
        // Extract parameters
        const params = {};
        match.slice(1).forEach((value, index) => {
          params[paramNames[index]] = value;
        });
        
        return { route, params };
      }
    }
    
    return null;
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
    const routeMatch = this.findRoute(method, path);
    
    if (routeMatch) {
      // Add params to request object
      request.params = routeMatch.params;
      return routeMatch.route.handler(request, env, ctx);
    }
    
    // Default 404 response
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders
    });
  }
};

// CORS headers for all responses
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
    // Log the request
    console.log('Registration request received');
    
    // Parse the request body
    const data = await request.json();
    console.log('Request data:', data);
    
    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Check if user already exists
    const existingUser = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(data.email).first();
    
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Generate a user ID
    const userId = crypto.randomUUID();
    
    // Insert the user
    await env.DB.prepare(
      'INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, data.name, data.email, data.password, Date.now()).run();
    
    // Create a simple token
    const token = btoa(JSON.stringify({ id: userId, name: data.name, email: data.email }));
    
    // Return a success response
    return new Response(JSON.stringify({ token }), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
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

// User profile endpoint
router.get('/api/users/profile', async (request, env) => {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Decode the token (it's base64 encoded)
    let userData;
    try {
      userData = JSON.parse(atob(token));
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Get user from database
    const user = await env.DB.prepare(
      'SELECT id, name, email, created_at FROM users WHERE id = ?'
    ).bind(userData.id).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Get user's children
    const children = await env.DB.prepare(
      'SELECT id, name, age, age_group FROM children WHERE user_id = ?'
    ).bind(user.id).all();
    
    // Add children to user object
    user.children = children.results || [];
    
    return new Response(JSON.stringify(user), {
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

// Add child to user profile
router.post('/api/users/child', async (request, env) => {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Decode the token
    let userData;
    try {
      userData = JSON.parse(atob(token));
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Parse the request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.age || !data.ageGroup) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Generate a child ID
    const childId = crypto.randomUUID();
    
    // Insert the child
    await env.DB.prepare(
      'INSERT INTO children (id, user_id, name, age, age_group, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(childId, userData.id, data.name, data.age, data.ageGroup, Date.now()).run();
    
    // Get updated user profile with children
    const user = await env.DB.prepare(
      'SELECT id, name, email, created_at FROM users WHERE id = ?'
    ).bind(userData.id).first();
    
    const children = await env.DB.prepare(
      'SELECT id, name, age, age_group FROM children WHERE user_id = ?'
    ).bind(userData.id).all();
    
    user.children = children.results || [];
    
    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// Get content for pillars
router.get('/api/content/pillars', async (request, env) => {
  try {
    // Get all pillars
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
      },
      {
        id: 3,
        title: 'Social Confidence & Communication',
        description: 'Build social confidence and communication skills.'
      },
      {
        id: 4,
        title: 'Purpose & Strength Discovery',
        description: 'Help your child discover their purpose and strengths.'
      },
      {
        id: 5,
        title: 'Managing Fear & Anxiety',
        description: 'Help your child manage fear and anxiety.'
      }
    ];
    
    return new Response(JSON.stringify(pillars), {
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

// Get content for a specific pillar
router.get('/api/content/pillar/:id', async (request, env) => {
  try {
    const id = request.params.id;
    
    // Get techniques for the pillar
    const techniques = [
      {
        id: 'tech1',
        pillarId: 1,
        title: 'Ask, Don\'t Tell Method',
        description: 'Instead of giving direct answers, ask guiding questions.',
        ageGroups: {
          toddler: 'Use simple questions appropriate for their understanding.',
          elementary: 'Ask more complex questions that encourage critical thinking.',
          teen: 'Guide them to resources where they can find answers independently.'
        }
      },
      {
        id: 'tech2',
        pillarId: 2,
        title: 'The Power of "Yet"',
        description: 'Add the word "yet" to statements about inability to emphasize growth potential.',
        ageGroups: {
          toddler: 'Use simple language to introduce the concept of "not yet".',
          elementary: 'Help them understand that abilities can grow with practice.',
          teen: 'Connect the concept to their personal goals and aspirations.'
        }
      }
    ];
    
    // Filter techniques for the requested pillar
    const pillarTechniques = techniques.filter(tech => tech.pillarId === parseInt(id));
    
    return new Response(JSON.stringify(pillarTechniques), {
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

// Get daily challenges
router.get('/api/challenges/daily', async (request, env) => {
  try {
    // Get a random challenge
    const challenges = [
      {
        id: 'chal1',
        title: 'Ask, Don\'t Tell Challenge',
        description: 'When your child asks for help today, respond with a question that helps them solve the problem themselves.',
        pillarId: 1,
        day: 1,
        ageGroup: 'all'
      },
      {
        id: 'chal2',
        title: 'Growth Mindset Moment',
        description: 'Add "yet" to any statement your child makes about not being able to do something.',
        pillarId: 2,
        day: 2,
        ageGroup: 'all'
      }
    ];
    
    // Get a random challenge
    const randomIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomIndex];
    
    return new Response(JSON.stringify(challenge), {
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
// Get Progress Data Endpoint
router.get('/api/progress/:childId', async (request, env) => {
  try {
    const { childId } = request.params;
    
    // Verify JWT token and get user
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }
    
    // Verify child belongs to user
    const child = await env.DB.prepare(`
      SELECT * FROM children WHERE id = ? AND user_id = ?
    `).bind(childId, user.id).first();
    
    if (!child) {
      return new Response(JSON.stringify({ message: 'Child not found' }), {
        status: 404,
        headers: corsHeaders
      });
    }
    
    // Get progress data from D1 database
    const pillars = await env.DB.prepare(`
      SELECT p.id, p.name, 
        (SELECT COUNT(*) FROM content c JOIN progress pr ON c.id = pr.technique_id 
         WHERE c.pillar_id = p.id AND pr.child_id = ? AND pr.completed = 1) as completed_techniques,
        (SELECT COUNT(*) FROM content c WHERE c.pillar_id = p.id) as total_techniques
      FROM pillars p
    `).bind(childId).all();
    
    // Calculate overall progress
    const totalTechniques = pillars.results.reduce((sum, pillar) => sum + pillar.total_techniques, 0);
    const completedTechniques = pillars.results.reduce((sum, pillar) => sum + pillar.completed_techniques, 0);
    const overallProgress = totalTechniques > 0 
      ? Math.round((completedTechniques / totalTechniques) * 100) 
      : 0;
    
    return new Response(JSON.stringify({
      progress: {
        overallProgress,
        techniquesCompleted: completedTechniques,
        totalTechniques,
        pillars: pillars.results.map(pillar => ({
          ...pillar,
          progress: pillar.total_techniques > 0 
            ? Math.round((pillar.completed_techniques / pillar.total_techniques) * 100) 
            : 0
        }))
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});

// Update Progress Endpoint
router.post('/api/progress/update', async (request, env) => {
  try {
    const { childId, techniqueId, pillarId, completed } = await request.json();
    
    // Verify JWT token and get user
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }
    
    // Verify child belongs to user
    const child = await env.DB.prepare(`
      SELECT * FROM children WHERE id = ? AND user_id = ?
    `).bind(childId, user.id).first();
    
    if (!child) {
      return new Response(JSON.stringify({ message: 'Child not found' }), {
        status: 404,
        headers: corsHeaders
      });
    }
    
    // Check if progress record exists
    const existingProgress = await env.DB.prepare(`
      SELECT * FROM progress WHERE child_id = ? AND technique_id = ?
    `).bind(childId, techniqueId).first();
    
    if (existingProgress) {
      // Update existing record
      await env.DB.prepare(`
        UPDATE progress 
        SET completed = ?, completed_at = ?
        WHERE child_id = ? AND technique_id = ?
      `).bind(
        completed ? 1 : 0,
        completed ? Date.now() : null,
        childId,
        techniqueId
      ).run();
    } else {
      // Create new record with a unique ID
      const progressId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO progress (id, user_id, child_id, pillar_id, technique_id, completed, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        progressId,
        user.id,
        childId,
        pillarId,
        techniqueId,
        completed ? 1 : 0,
        completed ? Date.now() : null
      ).run();
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Progress updated successfully'
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
});
async function checkAndUpdateAchievements(userId, childId, env) {
  try {
    // Get completed techniques count
    const completedTechniques = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM progress
      WHERE child_id = ? AND completed = 1
    `).bind(childId).first();
    
    // Check for achievements based on completed techniques
    const achievements = await env.DB.prepare(`
      SELECT * FROM achievements
      WHERE criteria_type = 'techniques_completed' AND criteria_value <= ?
    `).bind(completedTechniques.count).all();
    
    // Update user achievements
    for (const achievement of achievements.results) {
      const existingAchievement = await env.DB.prepare(`
        SELECT * FROM user_achievements
        WHERE user_id = ? AND achievement_id = ?
      `).bind(userId, achievement.id).first();
      
      if (!existingAchievement) {
        // Generate a unique ID for the achievement
        const achievementId = crypto.randomUUID();
        
        // Award new achievement
        await env.DB.prepare(`
          INSERT INTO user_achievements (id, user_id, achievement_id, progress, unlocked_at, created_at)
          VALUES (?, ?, ?, 100, ?, ?)
        `).bind(
          achievementId,
          userId, 
          achievement.id, 
          Date.now(),
          Date.now()
        ).run();
        
        // Award points for achievement
        await env.DB.prepare(`
          UPDATE users SET points = points + ? WHERE id = ?
        `).bind(achievement.points_value, userId).run();
        
        // Create certificate if applicable
        if (achievement.creates_certificate) {
          const certificateId = crypto.randomUUID();
          await env.DB.prepare(`
            INSERT INTO certificates (id, child_id, title, description, date, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(
            certificateId,
            childId,
            achievement.name + ' Certificate',
            'Awarded for ' + achievement.description,
            Date.now(),
            Date.now()
          ).run();
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return false;
  }
}
