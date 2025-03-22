import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/main.css';
import '../styles/DailyChallenge.css';
import '../styles/ChallengeCard.css';

const Challenges = () => {
  const { currentUser } = useAuth();
  const [activeChild, setActiveChild] = useState(null);
  const [activeTab, setActiveTab] = useState('daily');
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [calendarChallenges, setCalendarChallenges] = useState([
    {
      day: 1,
      title: 'Ask, Don\'t Tell Challenge',
      description: 'When your child asks for help today, respond with a question that helps them solve the problem themselves.',
      completed: true
    },
    {
      day: 2,
      title: 'Growth Mindset Moment',
      description: 'Add "yet" to any statement your child makes about not being able to do something.',
      completed: true
    },
    {
      day: 3,
      title: 'Conversation Starter',
      description: 'Practice a new conversation skill with your child in a low-pressure situation.',
      completed: true
    },
    {
      day: 4,
      title: 'Strength Spotlight',
      description: 'Point out a specific strength you notice in your child today.',
      completed: true
    },
    {
      day: 5,
      title: 'Fear Reframe',
      description: 'Help your child identify and reframe one fear or worry they have.',
      completed: true
    },
    {
      day: 6,
      title: 'Problem-Solving Practice',
      description: 'Present a small problem and guide your child through solving it independently.',
      completed: false
    },
    {
      day: 7,
      title: 'Mistake Celebration',
      description: 'Share a mistake you made and what you learned from it.',
      completed: false
    },
    {
      day: 8,
      title: 'Social Scenario Practice',
      description: 'Role-play a challenging social situation with your child.',
      completed: false
    },
    {
      day: 9,
      title: 'Purpose Exploration',
      description: 'Ask your child what activities make them feel happy and helpful.',
      completed: false
    },
    {
      day: 10,
      title: 'Brave Step Challenge',
      description: 'Encourage your child to take one small step toward something that makes them nervous.',
      completed: false
    },
    {
      day: 11,
      title: 'Independent Task',
      description: 'Identify one new responsibility your child can take on independently.',
      completed: false
    },
    {
      day: 12,
      title: 'Effort Praise',
      description: 'Focus exclusively on praising effort rather than results today.',
      completed: false
    },
    {
      day: 13,
      title: 'Active Listening',
      description: 'Practice active listening with your child for at least 10 minutes without interruption.',
      completed: false
    },
    {
      day: 14,
      title: 'Strength in Action',
      description: 'Create an opportunity for your child to use one of their strengths today.',
      completed: false
    },
    {
      day: 15,
      title: 'Worry Detective',
      description: 'Help your child investigate evidence for and against a worry they have.',
      completed: false
    },
    {
      day: 16,
      title: 'Choice Menu',
      description: 'Offer your child meaningful choices throughout the day.',
      completed: false
    },
    {
      day: 17,
      title: 'Challenge Embrace',
      description: 'Encourage your child to try something challenging and discuss how their brain grows from challenges.',
      completed: false
    },
    {
      day: 18,
      title: 'Assertiveness Practice',
      description: 'Help your child practice expressing their needs clearly and respectfully.',
      completed: false
    },
    {
      day: 19,
      title: 'Values Exploration',
      description: 'Discuss what matters most to your child and how they can live those values.',
      completed: false
    },
    {
      day: 20,
      title: 'Relaxation Technique',
      description: 'Teach your child a new relaxation technique to manage anxiety.',
      completed: false
    },
    {
      day: 21,
      title: 'Problem-Solving Steps',
      description: 'Guide your child through the formal steps of problem-solving for a current challenge.',
      completed: false
    },
    {
      day: 22,
      title: 'Learning from Others',
      description: 'Share a story about someone who overcame obstacles through persistence.',
      completed: false
    },
    {
      day: 23,
      title: 'Empathy Builder',
      description: 'Help your child practice understanding someone else\'s perspective.',
      completed: false
    },
    {
      day: 24,
      title: 'Passion Project',
      description: 'Help your child take one step forward on a project they\'re passionate about.',
      completed: false
    },
    {
      day: 25,
      title: 'Gradual Exposure',
      description: 'Create a small step toward facing something your child fears.',
      completed: false
    },
    {
      day: 26,
      title: 'Self-Help Skills',
      description: 'Teach your child one new self-help skill appropriate for their age.',
      completed: false
    },
    {
      day: 27,
      title: 'Persistence Practice',
      description: 'Encourage your child to stick with something difficult for a set period of time.',
      completed: false
    },
    {
      day: 28,
      title: 'Conversation Challenge',
      description: 'Challenge your child to start a conversation with someone new or ask questions to keep a conversation going.',
      completed: false
    },
    {
      day: 29,
      title: 'Strength Celebration',
      description: 'Have a special celebration of your child\'s unique strengths and qualities.',
      completed: false
    },
    {
      day: 30,
      title: 'Confidence Reflection',
      description: 'Reflect with your child on how they\'ve grown in confidence over the past month.',
      completed: false
    }
  ]);

  useEffect(() => {
    if (currentUser && currentUser.children && currentUser.children.length > 0) {
      setActiveChild(currentUser.children[0]);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      if (!activeChild) {
        console.log('No active child selected, skipping daily challenge fetch');
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        console.log('Fetching daily challenge for child:', activeChild.id);
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/challenges/daily?childId=${activeChild.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch daily challenge: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Received daily challenge data:', data);
        setDailyChallenge(data);
      } catch (err) {
        console.error('Error fetching daily challenge:', err);
        setError(`Failed to load daily challenge for ${activeChild.name}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyChallenge();
  }, [activeChild]);

  const handleChildChange = (e) => {
    const childId = e.target.value;
    const selected = currentUser.children.find(child => child.id === childId);
    setActiveChild(selected);
  };

  const handleCompleteChallenge = async () => {
    if (!activeChild || !dailyChallenge) {
      setError('No active child or challenge selected');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      console.log('Marking challenge as complete for child:', activeChild.id);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/challenges/${dailyChallenge.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childId: activeChild.id,
          completed: true
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to mark challenge as complete: ${response.statusText}`);
      }

      const updatedChallenge = await response.json();
      console.log('Challenge completion response:', updatedChallenge);
      setDailyChallenge(updatedChallenge);
    } catch (err) {
      console.error('Error completing challenge:', err);
      setError(`Failed to mark challenge as complete for ${activeChild.name}. Please try again later.`);
    }
  };

  const handleCalendarChallengeToggle = async (day) => {
    if (!activeChild) {
      setError('No active child selected');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const challenge = calendarChallenges.find(c => c.day === day);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/challenges/${challenge.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          childId: activeChild.id,
          completed: !challenge.completed
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update challenge status: ${response.statusText}`);
      }

      // Update local state after successful API call
      setCalendarChallenges(
        calendarChallenges.map(challenge => 
          challenge.day === day 
            ? { ...challenge, completed: !challenge.completed } 
            : challenge
        )
      );
    } catch (err) {
      console.error('Error updating challenge status:', err);
      setError(`Failed to update challenge status. Please try again later.`);
    }
  };

  if (!currentUser) {
    return <div className="loader">Loading...</div>;
  }

  if (loading) {
    return <div className="loader">Loading challenges...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="challenges-page">
      {activeChild && (
        <>
          <div className="challenges-header">
            <h1>Challenges for {activeChild.name}</h1>
            <div className="challenges-tabs">
              <button 
                className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
                onClick={() => setActiveTab('daily')}
              >
                Daily Challenge
              </button>
              <button 
                className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
                onClick={() => setActiveTab('calendar')}
              >
                30-Day Calendar
              </button>
            </div>
          </div>

          <div className="challenges-content">
            {activeTab === 'daily' && (
              <div className="daily-challenge-tab">
                <div className="dashboard-section">
                  <h2>Today's Challenge for {activeChild.name}</h2>
                  {dailyChallenge ? (
                    <div className="challenge-card">
                      <h3>{dailyChallenge.title}</h3>
                      <p>{dailyChallenge.description}</p>
                      {dailyChallenge.completed ? (
                        <div className="completed-message">
                          <span className="completed-badge">Completed</span>
                          <p>Great job! Come back tomorrow for a new challenge.</p>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-primary"
                          onClick={handleCompleteChallenge}
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="no-challenge">
                      <p>No daily challenge available at the moment.</p>
                    </div>
                  )}
                  
                  <div className="challenge-tips">
                    <h3>Tips for Success</h3>
                    <ul>
                      <li>Try to complete the challenge early in the day</li>
                      <li>Explain to your child what you're doing and why</li>
                      <li>Take notes on what worked and what didn't</li>
                      <li>Be consistent with daily challenges for best results</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="calendar-challenges-tab">
                <div className="calendar-header">
                  <h2>30-Day Challenge Calendar</h2>
                  <p>Complete one challenge each day to build lasting confidence and skills.</p>
                </div>

                <div className="calendar-challenges">
                  {calendarChallenges.map(challenge => (
                    <div 
                      key={challenge.day} 
                      className={`calendar-day ${challenge.completed ? 'completed' : ''}`}
                    >
                      <div className="day-number">Day {challenge.day}</div>
                      <div className="day-content">
                        <h3>{challenge.title}</h3>
                        <p>{challenge.description}</p>
                      </div>
                      <div className="day-action">
                        <button 
                          className={`btn ${challenge.completed ? 'btn-secondary' : 'btn-primary'}`}
                          onClick={() => handleCalendarChallengeToggle(challenge.day)}
                        >
                          {challenge.completed ? 'Completed' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Challenges;