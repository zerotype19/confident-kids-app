import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const PillarView = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [pillar, setPillar] = useState(null);
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get pillar data
    const getPillarData = () => {
      const pillars = [
        {
          id: 1,
          title: 'Independence & Problem-Solving',
          description: 'Help your child develop independence and problem-solving skills through guided discovery and the "Ask, Don\'t Tell" method.',
          longDescription: 'Independence and problem-solving skills are foundational to a child\'s confidence. When children learn to solve problems on their own, they develop a sense of capability and self-reliance that builds lasting confidence. This pillar focuses on techniques that help parents guide their children to find solutions independently rather than solving problems for them.',
          ageGroups: {
            toddler: 'For toddlers (2-5), focus on simple choices and basic problem-solving in everyday activities.',
            elementary: 'For elementary age children (6-11), encourage independent thinking and decision-making with appropriate guidance.',
            teen: 'For teens (12+), support autonomous problem-solving while being available as a resource when needed.'
          }
        },
        {
          id: 2,
          title: 'Growth Mindset & Resilience',
          description: 'Foster a growth mindset and resilience in your child through the "Yet" technique and embracing challenges.',
          longDescription: 'A growth mindset—the belief that abilities can be developed through dedication and hard work—is crucial for building confidence. Children with a growth mindset see challenges as opportunities to grow rather than threats to their self-image. This pillar provides techniques to help children develop resilience and persist through difficulties.',
          ageGroups: {
            toddler: 'For toddlers (2-5), use simple language to praise effort and introduce the concept of "not yet".',
            elementary: 'For elementary age children (6-11), help them understand the brain can grow and change with practice.',
            teen: 'For teens (12+), connect growth mindset to their personal goals and help them develop strategies for overcoming obstacles.'
          }
        },
        {
          id: 3,
          title: 'Social Confidence & Communication',
          description: 'Build social confidence and communication skills through the "Conversation Challenge" and real-life scenarios.',
          longDescription: 'Social confidence enables children to express themselves, form relationships, and navigate social situations effectively. This pillar focuses on developing communication skills and social awareness that help children feel confident in various social contexts.',
          ageGroups: {
            toddler: 'For toddlers (2-5), practice basic social interactions and taking turns in conversation.',
            elementary: 'For elementary age children (6-11), develop active listening skills and practice expressing thoughts and feelings clearly.',
            teen: 'For teens (12+), focus on complex social skills like perspective-taking, conflict resolution, and assertive communication.'
          }
        },
        {
          id: 4,
          title: 'Purpose & Strength Discovery',
          description: 'Help your child discover their purpose and strengths through the "Strength Journal" exercise and exploration activities.',
          longDescription: 'Understanding personal strengths and developing a sense of purpose contributes significantly to confidence. This pillar helps children identify their unique abilities and interests, and connect them to meaningful goals and activities.',
          ageGroups: {
            toddler: 'For toddlers (2-5), notice and name their natural interests and abilities.',
            elementary: 'For elementary age children (6-11), explore various activities and help them reflect on what they enjoy and do well.',
            teen: 'For teens (12+), connect strengths to potential future paths and encourage deeper exploration of interests.'
          }
        },
        {
          id: 5,
          title: 'Managing Fear & Anxiety',
          description: 'Help your child manage fear and anxiety through the "Reframe the Fear" technique and gradual exposure.',
          longDescription: 'Learning to manage fear and anxiety is essential for building confidence. This pillar provides techniques to help children understand their emotions, challenge unhelpful thoughts, and gradually face fears in a supported way.',
          ageGroups: {
            toddler: 'For toddlers (2-5), use simple language to name feelings and provide comfort and reassurance.',
            elementary: 'For elementary age children (6-11), teach basic emotional regulation strategies and help them identify and challenge scary thoughts.',
            teen: 'For teens (12+), develop more sophisticated emotional management skills and connect thoughts, feelings, and behaviors.'
          }
        }
      ];

      const techniques = [
        {
          id: 1,
          pillarId: 1,
          title: 'Ask, Don\'t Tell Method',
          description: 'Instead of giving direct answers or solutions, ask guiding questions that help your child think through the problem.',
          instructions: 'When your child asks for help, respond with a question that guides them toward finding the answer themselves. For example, if they ask how to spell a word, ask "What sounds do you hear in that word?" or "How could you find out how to spell that?"',
          examples: [
            'Child: "I can\'t figure out this math problem." Parent: "What part are you stuck on? What do you know so far?"',
            'Child: "I can\'t reach my toy." Parent: "What could you use to help you reach it?"'
          ]
        },
        {
          id: 2,
          pillarId: 1,
          title: 'Structured Independence',
          description: 'Gradually increase independence by providing clear structures and expectations.',
          instructions: 'Identify tasks your child can do independently with some structure. Create visual guides or checklists if needed. Gradually reduce support as they master each step.',
          examples: [
            'Morning routine checklist with pictures for younger children',
            'Homework planning template for older children'
          ]
        },
        {
          id: 3,
          pillarId: 2,
          title: 'The Power of "Yet"',
          description: 'Add the word "yet" to statements about inability to emphasize growth potential.',
          instructions: 'When your child says "I can\'t do this," gently add "yet" to the end: "You can\'t do this yet." Explain that learning takes time and practice.',
          examples: [
            'Child: "I\'m not good at reading." Parent: "You\'re not good at reading yet, but you\'re learning new words every day."',
            'Child: "I can\'t ride a bike." Parent: "You can\'t ride a bike yet. Let\'s keep practicing."'
          ]
        }
      ];

      const selectedPillar = pillars.find(p => p.id === parseInt(id));
      const pillarTechniques = techniques.filter(t => t.pillarId === parseInt(id));
      
      setTimeout(() => {
        setPillar(selectedPillar);
        setTechniques(pillarTechniques);
        setLoading(false);
      }, 500);
    };

    getPillarData();
  }, [id]);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (!pillar) {
    return <div className="container">Pillar not found</div>;
  }

  return (
    <div className="pillar-view-page">
      <div className="container">
        <h1>{pillar.title}</h1>
        
        <div className="pillar-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'techniques' ? 'active' : ''} 
            onClick={() => setActiveTab('techniques')}
          >
            Techniques
          </button>
          <button 
            className={activeTab === 'age-specific' ? 'active' : ''} 
            onClick={() => setActiveTab('age-specific')}
          >
            Age-Specific Guidance
          </button>
        </div>
        
        <div className="pillar-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <p className="pillar-description">{pillar.description}</p>
              <div className="pillar-long-description">
                <p>{pillar.longDescription}</p>
              </div>
              
              <div className="progress-section">
                <h3>Your Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: '20%' }}
                  ></div>
                </div>
                <p>20% Complete</p>
              </div>
            </div>
          )}
          
          {activeTab === 'techniques' && (
            <div className="techniques-tab">
              <p>Apply these research-backed techniques to build {pillar.title.toLowerCase()}:</p>
              
              {techniques.length > 0 ? (
                techniques.map(technique => (
                  <div key={technique.id} className="technique-card">
                    <h3>{technique.title}</h3>
                    <p className="technique-description">{technique.description}</p>
                    
                    <div className="technique-instructions">
                      <h4>How to Apply:</h4>
                      <p>{technique.instructions}</p>
                    </div>
                    
                    <div className="technique-examples">
                      <h4>Examples:</h4>
                      <ul>
                        {technique.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p>No techniques available yet. Check back soon!</p>
              )}
            </div>
          )}
          
          {activeTab === 'age-specific' && (
            <div className="age-specific-tab">
              <p>Adapt your approach based on your child's developmental stage:</p>
              
              <div className="age-group-card">
                <h3>Toddlers (Ages 2-5)</h3>
                <p>{pillar.ageGroups.toddler}</p>
              </div>
              
              <div className="age-group-card">
                <h3>Elementary (Ages 6-11)</h3>
                <p>{pillar.ageGroups.elementary}</p>
              </div>
              
              <div className="age-group-card">
                <h3>Teens (Ages 12+)</h3>
                <p>{pillar.ageGroups.teen}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PillarView;
