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
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
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

// Authentication helper function - add this before your endpoints
async function verifyAuth(request, env) {
  // Get the token from the Authorization header
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  // Extract the token
  const token = authHeader.split(' ')[1];
  
  // Decode the token (it's base64 encoded)
  try {
    const userData = JSON.parse(atob(token));
    
    // Get user from database
    const user = await env.DB.prepare(
      'SELECT id, name, email, created_at FROM users WHERE id = ?'
    ).bind(userData.id).first();
    
    if (!user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}



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


// Updated Dashboard Endpoint
router.get('/api/dashboard', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');

    // If no child is selected, return a basic dashboard response
    if (!childId) {
      return new Response(JSON.stringify({
        success: true,
        overallProgress: 0,
        activitiesCompleted: 0,
        points: 0,
        pillars: [],
        todayChallenge: null,
        hasChildren: false
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Verify child belongs to user
    const child = await env.DB.prepare(
      'SELECT * FROM children WHERE id = ? AND user_id = ?'
    ).bind(childId, user.id).first();

    if (!child) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Child not found or access denied' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Get overall progress
    const overallProgress = await env.DB.prepare(`
      SELECT 
        COUNT(*) as total_challenges,
        SUM(CASE WHEN cc.child_id IS NOT NULL THEN 1 ELSE 0 END) as completed_challenges
      FROM challenges c
      LEFT JOIN challenge_completions cc ON c.id = cc.challenge_id AND cc.child_id = ?
    `).bind(childId).first();

    // Get activities completed count
    const activitiesCompleted = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM challenge_completions
      WHERE child_id = ?
    `).bind(childId).first();

    // Get points earned
    const points = await env.DB.prepare(`
      SELECT COUNT(*) as total_points
      FROM challenge_completions
      WHERE child_id = ?
    `).bind(childId).first();

    // Get pillars with progress
    const pillars = await env.DB.prepare(`
      SELECT 
        p.id,
        p.name,
        p.short_description,
        COUNT(DISTINCT c.id) as total_activities,
        COUNT(DISTINCT cc.challenge_id) as completed_activities
      FROM pillars p
      LEFT JOIN challenges c ON p.id = c.pillar_id
      LEFT JOIN challenge_completions cc ON c.id = cc.challenge_id AND cc.child_id = ?
      GROUP BY p.id
    `).bind(childId).all();

    // Get today's challenge
    const todayChallenge = await env.DB.prepare(`
      SELECT 
        c.id,
        c.title,
        c.description,
        CASE WHEN cc.child_id IS NOT NULL THEN 1 ELSE 0 END as completed
      FROM challenges c
      LEFT JOIN challenge_completions cc ON c.id = cc.challenge_id AND cc.child_id = ?
      WHERE c.id = (
        SELECT id FROM challenges 
        ORDER BY RANDOM() 
        LIMIT 1
      )
    `).bind(childId).first();

    // Calculate overall progress percentage
    const overallProgressPercentage = overallProgress.total_challenges > 0
      ? Math.round((overallProgress.completed_challenges / overallProgress.total_challenges) * 100)
      : 0;

    // Format pillars data
    const formattedPillars = pillars.results.map(pillar => ({
      id: pillar.id,
      name: pillar.name,
      shortDescription: pillar.short_description,
      progress: pillar.total_activities > 0
        ? Math.round((pillar.completed_activities / pillar.total_activities) * 100)
        : 0,
      activitiesCompleted: pillar.completed_activities,
      totalActivities: pillar.total_activities
    }));

    return new Response(JSON.stringify({
      success: true,
      overallProgress: overallProgressPercentage,
      activitiesCompleted: activitiesCompleted.count,
      points: points.total_points,
      pillars: formattedPillars,
      todayChallenge: {
        id: todayChallenge.id,
        title: todayChallenge.title,
        description: todayChallenge.description,
        completed: todayChallenge.completed === 1
      }
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


// Add child endpoint (alternative path)
router.post('/api/children', async (request, env) => {
  // This is a redirect to the existing /api/users/child endpoint
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

// Get specific pillar by ID
router.get('/api/pillars/:id', async (request, env) => {
  try {
    const id = parseInt(request.params.id);
    
    // Verify JWT token and get user
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }
    
    // Get pillar from database
    const pillar = await env.DB.prepare(`
      SELECT p.id, p.name, p.short_description,
        (SELECT COUNT(*) FROM progress pr 
         WHERE pr.pillar_id = p.id AND pr.user_id = ? AND pr.completed = 1) as activitiesCompleted,
        (SELECT COUNT(*) FROM content c WHERE c.pillar_id = p.id) as totalActivities
      FROM pillars p
      WHERE p.id = ?
    `).bind(user.id, id).first();
    
    if (!pillar) {
      return new Response(JSON.stringify({ message: 'Pillar not found' }), {
        status: 404,
        headers: corsHeaders
      });
    }
    
    // Calculate progress
    const progress = pillar.totalActivities > 0 
      ? Math.round((pillar.activitiesCompleted / pillar.totalActivities) * 100) 
      : 0;
    
    // Get techniques for this pillar
    const techniques = await env.DB.prepare(`
      SELECT id, title, description
      FROM content
      WHERE pillar_id = ?
    `).bind(id).all();
    
    // Format response
    const response = {
      id: pillar.id,
      name: pillar.name,
      shortDescription: pillar.short_description,
      progress: progress,
      activitiesCompleted: pillar.activitiesCompleted,
      totalActivities: pillar.totalActivities,
      techniques: techniques.results || []
    };
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
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

// Pillars endpoints
router.get('/api/pillars', async (request, env) => {
  try {
    // Get childId from URL search params
    const url = new URL(request.url);
    const childId = url.searchParams.get('childId');

    // Get pillars with progress if childId is provided
    if (childId) {
      const pillars = await env.DB.prepare(`
        SELECT p.*,
               (SELECT COUNT(*) FROM challenge_completions cc 
                JOIN challenges c ON c.id = cc.challenge_id 
                WHERE c.pillar_id = p.id AND cc.child_id = ?) as completed_challenges,
               (SELECT COUNT(*) FROM challenges WHERE pillar_id = p.id) as total_challenges
        FROM pillars p
        ORDER BY p.id
      `).bind(childId).all();

      // Calculate progress for each pillar
      const pillarsWithProgress = pillars.results.map(pillar => ({
        ...pillar,
        progress: pillar.total_challenges > 0 
          ? Math.round((pillar.completed_challenges / pillar.total_challenges) * 100) 
          : 0
      }));

      return new Response(JSON.stringify(pillarsWithProgress), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // If no childId, return basic pillar data
    const pillars = await env.DB.prepare(
      'SELECT * FROM pillars ORDER BY id'
    ).all();
    
    return new Response(JSON.stringify(pillars.results), {
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

// Get challenges for a specific pillar
router.get('/api/pillars/:pillarId/challenges', async (request, env) => {
  try {
    // Verify user is authenticated
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Get pillarId from URL parameters
    const url = new URL(request.url);
    const pillarId = url.pathname.split('/').pop();

    // Get childId from URL search params
    const childId = url.searchParams.get('childId');
    if (!childId) {
      return new Response(JSON.stringify({ success: false, error: 'Child ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Verify child belongs to user
    const childResult = await env.DB.prepare(`
      SELECT * FROM children 
      WHERE id = ? AND user_id = ?
    `).bind(childId, user.id).first();

    if (!childResult) {
      return new Response(JSON.stringify({ success: false, error: 'Child not found or unauthorized' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Get challenges for the pillar
    const challenges = await env.DB.prepare(`
      SELECT c.*, 
             CASE WHEN cc.id IS NOT NULL THEN 1 ELSE 0 END as completed,
             cc.completed_at
      FROM challenges c
      LEFT JOIN challenge_completions cc ON c.id = cc.challenge_id 
        AND cc.child_id = ?
      WHERE c.pillar_id = ?
      ORDER BY c.difficulty_level, c.id
    `).bind(childId, pillarId).all();

    return new Response(JSON.stringify({ 
      success: true, 
      challenges: challenges.results 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('Error fetching pillar challenges:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || 'Failed to fetch challenges'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// Content endpoints
router.get('/api/content', async (request, env) => {
  try {
    const content = await env.DB.prepare(
      'SELECT * FROM content ORDER BY id'
    ).all();
    
    return new Response(JSON.stringify(content.results), {
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

// Challenges endpoints
router.get('/api/challenges', async (request, env) => {
  try {
    const challenges = await env.DB.prepare(
      'SELECT * FROM challenges ORDER BY id'
    ).all();
    
    return new Response(JSON.stringify(challenges.results), {
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

router.get('/api/challenges/daily', async (request, env) => {
  try {
    // Get today's challenge based on the current date
    const today = new Date().toISOString().split('T')[0];
    const challenge = await env.DB.prepare(
      'SELECT * FROM challenges WHERE date = ? ORDER BY RANDOM() LIMIT 1'
    ).bind(today).first();
    
    if (!challenge) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No challenge available for today' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response(JSON.stringify(challenge), {
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

router.post('/api/challenges/:id/complete', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { id } = request.params;
    const { childId, completed } = await request.json();

    // Verify child belongs to user
    const child = await env.DB.prepare(
      'SELECT * FROM children WHERE id = ? AND user_id = ?'
    ).bind(childId, user.id).first();

    if (!child) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Child not found or access denied' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check if completion record exists
    const existingCompletion = await env.DB.prepare(
      'SELECT * FROM challenge_completions WHERE challenge_id = ? AND child_id = ?'
    ).bind(id, childId).first();

    if (existingCompletion) {
      if (completed) {
        // Update existing completion
        await env.DB.prepare(
          'UPDATE challenge_completions SET completed_at = ? WHERE challenge_id = ? AND child_id = ?'
        ).bind(new Date().toISOString(), id, childId).run();
      } else {
        // Delete the completion record
        await env.DB.prepare(
          'DELETE FROM challenge_completions WHERE challenge_id = ? AND child_id = ?'
        ).bind(id, childId).run();
      }
    } else if (completed) {
      // Create new completion record
      const completionId = `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await env.DB.prepare(
        'INSERT INTO challenge_completions (id, challenge_id, child_id, user_id, completed_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(completionId, id, childId, user.id, new Date().toISOString()).run();
    }

    // Check and update achievements
    if (completed) {
      await checkAndUpdateAchievements(user.id, childId, env);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: completed ? 'Challenge marked as complete' : 'Challenge marked as incomplete'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// Achievements endpoints
router.get('/api/achievements', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Get childId from URL search params
    const url = new URL(request.url);
    const childId = url.searchParams.get('childId');

    if (!childId) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Child ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Verify child belongs to user
    const child = await env.DB.prepare(
      'SELECT * FROM children WHERE id = ? AND user_id = ?'
    ).bind(childId, user.id).first();

    if (!child) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Child not found or access denied' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Get all achievements with completion status for the child
    const achievements = await env.DB.prepare(`
      SELECT a.*, 
             CASE WHEN ac.child_id IS NOT NULL THEN 1 ELSE 0 END as completed,
             ac.completed_at
      FROM achievements a
      LEFT JOIN achievement_completions ac ON a.id = ac.achievement_id 
        AND ac.child_id = ?
      ORDER BY a.id
    `).bind(childId).all();

    return new Response(JSON.stringify({ 
      success: true,
      achievements: achievements.results 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

router.post('/api/achievements/:id/claim', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { id } = request.params;
    const { childId } = await request.json();

    // Verify child belongs to user
    const child = await env.DB.prepare(
      'SELECT * FROM children WHERE id = ? AND user_id = ?'
    ).bind(childId, user.id).first();

    if (!child) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Child not found or access denied' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Check if achievement is already claimed
    const existing = await env.DB.prepare(
      'SELECT * FROM achievement_completions WHERE achievement_id = ? AND child_id = ?'
    ).bind(id, childId).first();

    if (existing) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Achievement already claimed' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Claim achievement
    await env.DB.prepare(
      'INSERT INTO achievement_completions (achievement_id, child_id, completed_at) VALUES (?, ?, ?)'
    ).bind(id, childId, new Date().toISOString()).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Achievement claimed successfully' 
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

// Rewards endpoints
router.get('/api/rewards', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const rewards = await env.DB.prepare(
      'SELECT * FROM rewards ORDER BY points_required'
    ).all();

    return new Response(JSON.stringify(rewards.results), {
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

router.post('/api/rewards/:id/claim', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { id } = request.params;
    const { childId } = await request.json();

    // Verify child belongs to user
    const child = await env.DB.prepare(
      'SELECT * FROM children WHERE id = ? AND user_id = ?'
    ).bind(childId, user.id).first();

    if (!child) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Child not found or access denied' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Get child's points and reward details
    const [childPoints, reward] = await Promise.all([
      env.DB.prepare(
        'SELECT points FROM children WHERE id = ?'
      ).bind(childId).first(),
      env.DB.prepare(
        'SELECT * FROM rewards WHERE id = ?'
      ).bind(id).first()
    ]);

    if (!reward) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Reward not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (childPoints.points < reward.points_required) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Not enough points' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Deduct points and record reward claim
    await env.DB.prepare(
      'UPDATE children SET points = points - ? WHERE id = ?'
    ).bind(reward.points_required, childId).run();

    await env.DB.prepare(
      'INSERT INTO reward_claims (reward_id, child_id, claimed_at) VALUES (?, ?, ?)'
    ).bind(id, childId, new Date().toISOString()).run();

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Reward claimed successfully' 
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

// Progress endpoints
router.get('/api/progress', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { childId } = request.query;

    // Get child's progress statistics
    const [totalChallenges, completedChallenges, achievements, rewards] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as total FROM challenges').first(),
      env.DB.prepare(
        'SELECT COUNT(*) as completed FROM challenge_completions WHERE child_id = ?'
      ).bind(childId).first(),
      env.DB.prepare(
        'SELECT COUNT(*) as total FROM achievements'
      ).first(),
      env.DB.prepare(
        'SELECT COUNT(*) as claimed FROM reward_claims WHERE child_id = ?'
      ).bind(childId).first()
    ]);

    // Get weekly progress
    const weeklyProgress = await env.DB.prepare(`
      SELECT 
        date(completed_at) as date,
        COUNT(*) as completed
      FROM challenge_completions
      WHERE child_id = ?
      AND completed_at >= date('now', '-7 days')
      GROUP BY date(completed_at)
      ORDER BY date
    `).bind(childId).all();

    return new Response(JSON.stringify({
      totalChallenges: totalChallenges.total,
      completedChallenges: completedChallenges.completed,
      totalAchievements: achievements.total,
      claimedRewards: rewards.claimed,
      weeklyProgress: weeklyProgress.results
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

// Get progress stats for a specific child
router.get('/api/progress/stats/child/:childId', async (request, env) => {
  try {
    // Verify JWT token and get user
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { childId } = request.params;
    
    // Get total completed challenges
    const stats = await env.DB.prepare(`
      SELECT 
        COUNT(*) as total_completed
      FROM challenge_completions
      WHERE child_id = ?
    `).bind(childId).first();

    // Get completion rates by pillar
    const pillarStats = await env.DB.prepare(`
      SELECT 
        p.id as pillar_id,
        p.name as pillar_name,
        COUNT(cc.id) as completed_challenges,
        (SELECT COUNT(*) FROM challenges WHERE pillar_id = p.id) as total_challenges
      FROM pillars p
      LEFT JOIN challenges c ON c.pillar_id = p.id
      LEFT JOIN challenge_completions cc ON cc.challenge_id = c.id AND cc.child_id = ?
      GROUP BY p.id, p.name
      ORDER BY p.id
    `).bind(childId).all();

    // If no data exists for this child, return default stats
    if (!stats || stats.total_completed === 0) {
      return new Response(JSON.stringify({
        totalCompleted: 0,
        averageRating: 0,
        pillarStats: pillarStats.results.map(pillar => ({
          ...pillar,
          completedChallenges: 0,
          totalChallenges: 0,
          completionRate: 0
        }))
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Calculate completion rates
    const pillarStatsWithRates = pillarStats.results.map(pillar => ({
      ...pillar,
      completedChallenges: pillar.completed_challenges,
      totalChallenges: pillar.total_challenges,
      completionRate: pillar.total_challenges > 0 
        ? Math.round((pillar.completed_challenges / pillar.total_challenges) * 100) 
        : 0
    }));

    return new Response(JSON.stringify({
      totalCompleted: stats.total_completed,
      averageRating: 0, // Default to 0 since we don't have ratings yet
      pillarStats: pillarStatsWithRates
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

// Get specific challenge by ID
router.get('/api/challenges/:id', async (request, env) => {
  try {
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { id } = request.params;
    
    // Get the challenge from database
    const challenge = await env.DB.prepare(`
      SELECT c.*, 
             CASE WHEN cc.child_id IS NOT NULL THEN 1 ELSE 0 END as completed,
             cc.completed_at
      FROM challenges c
      LEFT JOIN challenge_completions cc ON c.id = cc.challenge_id 
        AND cc.child_id = (
          SELECT id FROM children WHERE user_id = ? LIMIT 1
        )
      WHERE c.id = ?
    `).bind(user.id, id).first();

    // If no challenge found in database, return default challenge based on ID
    if (!challenge) {
      const defaultChallenges = {
        'chal1': {
          id: 'chal1',
          title: 'Ask, Don\'t Tell Challenge',
          description: 'When your child has a problem, resist the urge to jump in. Ask "What do you think you should do?" and let them think through solutions.',
          instructions: 'Instructions for Parents:\n1. When your child comes to you with a problem, take a deep breath\n2. Instead of giving advice, ask open-ended questions like:\n   - "What have you tried so far?"\n   - "What do you think might work?"\n   - "What would happen if you tried that?"\n3. Give them time to think and respond\n4. Praise their problem-solving efforts, even if the solution isn\'t perfect',
          pillar_id: 1,
          completed: 0,
          completed_at: null
        },
        'chal2': {
          id: 'chal2',
          title: 'Growth Mindset Moment',
          description: 'Add "yet" to any statement your child makes about not being able to do something.',
          instructions: 'Instructions for Parents:\n1. Listen for statements like "I can\'t do this" or "I\'m not good at this"\n2. Help them reframe by adding "yet"\n3. Follow up with encouraging questions:\n   - "What would help you learn this?"\n   - "Who could help you practice?"\n4. Share a story about something you learned to do with practice',
          pillar_id: 2,
          completed: 0,
          completed_at: null
        },
        'chal3': {
          id: 'chal3',
          title: 'Conversation Starter',
          description: 'Practice three conversation starters with your child: "What do you think about ___?" "That\'s cool—how did you get into it?" "What was the best part of your day?"',
          instructions: 'Instructions for Parents:\n1. Choose a good time when your child is relaxed\n2. Try these conversation starters:\n   - "What do you think about [current event or topic]?"\n   - "That\'s cool—how did you get into it?"\n   - "What was the best part of your day?"\n3. Listen actively without interrupting\n4. Ask follow-up questions to show interest',
          pillar_id: 3,
          completed: 0,
          completed_at: null
        },
        'chal4': {
          id: 'chal4',
          title: 'Strength Journal',
          description: 'Help your child list five things they enjoy doing. Ask them what they like about each activity.',
          instructions: 'Instructions for Parents:\n1. Create a special notebook or use a digital note\n2. Ask your child to list 5 activities they enjoy\n3. For each activity, ask:\n   - "What do you like about it?"\n   - "What makes you feel good when you do it?"\n   - "What skills do you use?"\n4. Add your own observations of their strengths\n5. Review the list together and celebrate their unique qualities',
          pillar_id: 4,
          completed: 0,
          completed_at: null
        },
        'chal5': {
          id: 'chal5',
          title: 'Fear Reframing',
          description: 'When your child expresses fear, ask "What if this goes great? What would that look like?" Help them imagine positive outcomes.',
          instructions: 'Instructions for Parents:\n1. When your child expresses fear, listen without dismissing\n2. Ask open-ended questions:\n   - "What if this goes great?"\n   - "What would that look like?"\n   - "What\'s the best that could happen?"\n3. Help them visualize success\n4. Share a story about a time you faced and overcame a fear\n5. Create a small action plan together',
          pillar_id: 5,
          completed: 0,
          completed_at: null
        },
        'chal6': {
          id: 'chal6',
          title: 'Morning Independence',
          description: 'Let your child choose their own clothes for the day. Ask them to check the weather and decide if they need a jacket.',
          instructions: 'Instructions for Parents:\n1. The night before, lay out weather-appropriate options\n2. In the morning, let your child choose their outfit\n3. Ask them to check the weather (you can help with this)\n4. Let them decide if they need a jacket or other weather gear\n5. Resist the urge to override their choices unless safety is at risk\n6. Praise their decision-making process',
          pillar_id: 1,
          completed: 0,
          completed_at: null
        },
        'chal7': {
          id: 'chal7',
          title: 'Learning from Mistakes',
          description: 'Share a story about a time you made a mistake and what you learned from it. Then ask your child about a mistake they learned from.',
          instructions: 'Instructions for Parents:\n1. Share a story about a mistake you made and what you learned\n2. Ask your child about a mistake they made recently\n3. Help them identify:\n   - What happened?\n   - What did they learn?\n   - What would they do differently?\n4. Emphasize that mistakes are opportunities to learn\n5. Celebrate their growth mindset when they share their experience',
          pillar_id: 2,
          completed: 0,
          completed_at: null
        },
        'chal8': {
          id: 'chal8',
          title: 'Strength Recognition',
          description: 'Point out three specific strengths you notice in your child today.',
          instructions: 'Instructions for Parents:\n1. Observe your child throughout the day\n2. Look for specific moments that show their strengths\n3. Point out three strengths you notice, being specific about:\n   - What they did\n   - Why it shows strength\n   - How it helps others or themselves\n4. Write these strengths down together\n5. Ask them how they feel about these strengths',
          pillar_id: 4,
          completed: 0,
          completed_at: null
        }
      };

      const defaultChallenge = defaultChallenges[id];
      if (!defaultChallenge) {
        return new Response(JSON.stringify({ 
          success: false, 
          message: 'Challenge not found' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      return new Response(JSON.stringify(defaultChallenge), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    return new Response(JSON.stringify(challenge), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// Get pillar-specific progress for a child
router.get('/api/progress/pillar/:pillarId/child/:childId', async (request, env) => {
  try {
    // Verify JWT token and get user
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const { pillarId, childId } = request.params;
    
    // Get total challenges for this pillar
    const totalChallenges = await env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM challenges
      WHERE pillar_id = ?
    `).bind(pillarId).first();

    // Get completed challenges for this pillar and child
    const completedChallenges = await env.DB.prepare(`
      SELECT COUNT(*) as completed
      FROM challenge_completions cc
      JOIN challenges c ON c.id = cc.challenge_id
      WHERE c.pillar_id = ? AND cc.child_id = ?
    `).bind(pillarId, childId).first();

    // If no data exists, return default progress
    if (!totalChallenges || !completedChallenges) {
      return new Response(JSON.stringify({
        totalChallenges: 0,
        completedChallenges: 0,
        progressPercentage: 0,
        recentCompletions: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Get recent completions
    const recentCompletions = await env.DB.prepare(`
      SELECT c.title, cc.completed_at
      FROM challenge_completions cc
      JOIN challenges c ON c.id = cc.challenge_id
      WHERE c.pillar_id = ? AND cc.child_id = ?
      ORDER BY cc.completed_at DESC
      LIMIT 5
    `).bind(pillarId, childId).all();

    // Calculate progress percentage
    const progressPercentage = totalChallenges.total > 0 
      ? Math.round((completedChallenges.completed / totalChallenges.total) * 100) 
      : 0;

    return new Response(JSON.stringify({
      totalChallenges: totalChallenges.total,
      completedChallenges: completedChallenges.completed,
      progressPercentage: progressPercentage,
      recentCompletions: recentCompletions.results || []
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

// Get techniques for a specific pillar
router.get('/api/content/techniques/:pillarId', async (request, env) => {
  try {
    const pillarId = parseInt(request.params.pillarId);
    
    // Verify JWT token and get user
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Get techniques from database
    const techniques = await env.DB.prepare(`
      SELECT c.id, c.title, c.description, c.content_type, c.content_data, c.age_group
      FROM content c
      WHERE c.pillar_id = ? AND c.content_type = 'technique'
      ORDER BY c.order ASC
    `).bind(pillarId).all();

    // Format the response
    const formattedTechniques = techniques.results.map(technique => ({
      id: technique.id,
      title: technique.title,
      description: technique.description,
      content_type: technique.content_type,
      content_data: JSON.parse(technique.content_data || '{}'),
      age_group: technique.age_group
    }));

    return new Response(JSON.stringify(formattedTechniques), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error('Error fetching techniques:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// Bulk insert challenges endpoint
router.post('/api/challenges/bulk', async (request, env) => {
  try {
    // Verify JWT token and get user
    const user = await verifyAuth(request, env);
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Parse the request body
    const challenges = await request.json();
    
    if (!Array.isArray(challenges)) {
      return new Response(JSON.stringify({ error: 'Request body must be an array of challenges' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Prepare the insert statement
    const stmt = env.DB.prepare(`
      INSERT INTO challenges (
        id, title, description, instructions, pillar_id, 
        difficulty_level, age_group, points_value, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Insert each challenge
    const results = [];
    for (const challenge of challenges) {
      try {
        const id = `chal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await stmt.bind(
          id,
          challenge.title,
          challenge.description,
          challenge.instructions,
          challenge.pillar_id,
          challenge.difficulty_level || 'medium',
          challenge.age_group || 'all',
          challenge.points_value || 10,
          Date.now()
        ).run();
        results.push({ id, success: true });
      } catch (error) {
        results.push({ 
          challenge: challenge.title, 
          success: false, 
          error: error.message 
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Processed ${challenges.length} challenges`,
      results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    console.error('Error bulk inserting challenges:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});

// Export default function to handle requests
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    
    console.log(`Received ${method} request for path: ${path}`);
    
    // Handle OPTIONS requests directly
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }
    
    // Find the matching route handler
    const routeMatch = router.findRoute(method, path);
    
    if (routeMatch) {
      // Add params to request object
      request.params = routeMatch.params;
      return routeMatch.route.handler(request, env, ctx);
    }
    
    // Return JSON for 404 instead of plain text
    return new Response(JSON.stringify({ 
      error: 'Not Found', 
      path: path, 
      method: method 
    }), { 
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};
