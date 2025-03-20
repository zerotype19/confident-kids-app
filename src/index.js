import { Router } from 'itty-router';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from '@tsndr/cloudflare-worker-jwt';

// Create a new router
const router = Router();

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Handle OPTIONS requests for CORS
router.options('*', () => new Response(null, {
  status: 204,
  headers: corsHeaders
}));

// Middleware to verify JWT
const authenticate = async (request, env) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const isValid = await jwt.verify(token, env.JWT_SECRET);
    if (!isValid) throw new Error('Invalid token');
    
    const payload = jwt.decode(token);
    request.user = payload.user;
    return null;
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

// User routes
router.post('/api/users/register', async (request, env) => {
  const { name, email, password } = await request.json();
  
  // Validate input
  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: 'Please provide all required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  try {
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
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const userId = uuidv4();
    await env.DB.prepare(
      'INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, name, email, hashedPassword, Date.now()).run();
    
    // Generate JWT
    const token = await jwt.sign({
      user: { id: userId, name, email }
    }, env.JWT_SECRET);
    
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
});

router.post('/api/users/login', async (request, env) => {
  const { email, password } = await request.json();
  
  // Validate input
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Please provide email and password' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  try {
    // Find user
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    // Generate JWT
    const token = await jwt.sign({
      user: { id: user.id, name: user.name, email: user.email }
    }, env.JWT_SECRET);
    
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

// Protected route - get user profile
router.get('/api/users/profile', async (request, env) => {
  const authResult = await authenticate(request, env);
  if (authResult) return authResult;
  
  try {
    // Get user data
    const user = await env.DB.prepare(
      'SELECT id, name, email, created_at FROM users WHERE id = ?'
    ).bind(request.user.id).first();
    
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
  const authResult = await authenticate(request, env);
  if (authResult) return authResult;
  
  const { name, age, ageGroup } = await request.json();
  
  // Validate input
  if (!name || !age || !ageGroup) {
    return new Response(JSON.stringify({ error: 'Please provide all required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  try {
    // Create child
    const childId = uuidv4();
    await env.DB.prepare(
      'INSERT INTO children (id, user_id, name, age, age_group, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(childId, request.user.id, name, age, ageGroup, Date.now()).run();
    
    // Get updated user profile with children
    const user = await env.DB.prepare(
      'SELECT id, name, email, created_at FROM users WHERE id = ?'
    ).bind(request.user.id).first();
    
    const children = await env.DB.prepare(
      'SELECT id, name, age, age_group FROM children WHERE user_id = ?'
    ).bind(user.id).all();
    
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

// Get content for a specific pillar
router.get('/api/content/pillar/:id', async (request, env) => {
  const { id } = request.params;
  
  try {
    // Get content for the pillar
    const content = await env.DB.prepare(
      'SELECT * FROM content WHERE pillar_id = ?'
    ).bind(id).all();
    
    return new Response(JSON.stringify(content.results || []), {
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

// Get daily challenge
router.get('/api/challenges/daily', async (request, env) => {
  const authResult = await authenticate(request, env);
  if (authResult) return authResult;
  
  try {
    // Get a random challenge
    const challenge = await env.DB.prepare(
      'SELECT * FROM challenges ORDER BY RANDOM() LIMIT 1'
    ).first();
    
    if (!challenge) {
      return new Response(JSON.stringify({ error: 'No challenges available' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
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

// Complete a challenge
router.post('/api/challenges/complete', async (request, env) => {
  const authResult = await authenticate(request, env);
  if (authResult) return authResult;
  
  const { challengeId, childId } = await request.json();
  
  // Validate input
  if (!challengeId || !childId) {
    return new Response(JSON.stringify({ error: 'Please provide all required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
  
  try {
    // Record challenge completion
    const completionId = uuidv4();
    await env.DB.prepare(
      'INSERT INTO challenge_completions (id, user_id, child_id, challenge_id, completed_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(completionId, request.user.id, childId, challengeId, Date.now()).run();
    
    return new Response(JSON.stringify({ success: true }), {
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

// Seed database endpoint (for development)
router.get('/api/seed', async (request, env) => {
  try {
    // Seed pillars
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
    
    // Seed techniques
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
      // Add more techniques as needed
    ];
    
    // Seed challenges
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
      // Add more challenges as needed
    ];
    
    // Insert data into database
    for (const pillar of pillars) {
      try {
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
      } catch (e) {
        console.error(`Error inserting pillar ${pillar.id}: ${e.message}`);
      }
    }
    
    for (const technique of techniques) {
      for (const [ageGroup, content] of Object.entries(technique.ageGroups)) {
        try {
          await env.DB.prepare(
            'INSERT OR IGNORE INTO content (id, pillar_id, title, description, age_group, content_type, content_data) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(
            `${technique.id}_${ageGroup}`,
            technique.pillarId,
            technique.title,
            technique.description,
            ageGroup,
            'technique',
            JSON.stringify({
              instructions: technique.description,
              content: content
            })
          ).run();
        } catch (e) {
          console.error(`Error inserting technique ${technique.id} for ${ageGroup}: ${e.message}`);
        }
      }
    }
    
    for (const challenge of challenges) {
      try {
        await env.DB.prepare(
          'INSERT OR IGNORE INTO challenges (id, title, description, pillar_id, day, age_group) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
          challenge.id,
          challenge.title,
          challenge.description,
          challenge.pillarId,
          challenge.day,
          challenge.ageGroup
        ).run();
      } catch (e) {
        console.error(`Error inserting challenge ${challenge.id}: ${e.message}`);
      }
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
});

// 404 handler
router.all('*', () => new Response('Not Found', { 
  status: 404,
  headers: corsHeaders
}));

// Export default function to handle requests
export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  }
};
