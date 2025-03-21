import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaStar, FaShare, FaPrint, FaTrophy } from 'react-icons/fa';

const Rewards = () => {
  const [activeTab, setActiveTab] = useState('achievements');
  const [achievements, setAchievements] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser, hasPremiumAccess } = useAuth();
  
  useEffect(() => {
    const fetchRewardsData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rewards`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch rewards data');
        }

        setAchievements(data.achievements);
        setCertificates(data.certificates);
        setMarketplace(data.marketplace);
        setPoints(data.points);
      } catch (error) {
        console.error('Error fetching rewards data:', error);
        setError('Failed to load rewards data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (hasPremiumAccess()) {
      fetchRewardsData();
    } else {
      setLoading(false);
    }
  }, [hasPremiumAccess]);

  const handleShareCertificate = (certificateId) => {
    // Implementation for sharing certificate to social media
    console.log(`Sharing certificate ${certificateId}`);
    // This would typically open a social sharing modal or redirect to a sharing page
  };

  const handlePrintCertificate = (certificateId) => {
    // Implementation for printing certificate
    console.log(`Printing certificate ${certificateId}`);
    window.print();
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/rewards/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rewardId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to redeem reward');
      }

      // Update points after redemption
      setPoints(data.updatedPoints);
      
      // Update marketplace items to reflect availability changes
      setMarketplace(prevMarketplace => 
        prevMarketplace.map(item => 
          item.id === rewardId 
            ? { ...item, redeemed: true } 
            : item
        )
      );
      
      alert('Reward redeemed successfully!');
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert(`Failed to redeem reward: ${error.message}`);
    }
  };

  if (!hasPremiumAccess()) {
    return (
      <div className="container mt-5">
        <div className="upgrade-prompt standard">
          <h2><FaTrophy className="me-2" /> Unlock the Rewards System</h2>
          <p>The Rewards System is a premium feature that allows your child to earn achievements, collect certificates, and redeem points for special rewards.</p>
          <p>Subscribe to our premium plan to motivate your child with tangible rewards for their confidence journey.</p>
          <a href="/subscription" className="upgrade-button">Upgrade Now</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center p-5">Loading rewards data...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="rewards-container">
      <h1 className="mb-4">Rewards & Achievements</h1>
      
      <div className="points-display">
        <span className="points-icon"><FaStar /></span>
        <span className="points-value">{points} Points</span>
      </div>
      
      <div className="rewards-tabs">
        <button 
          className={activeTab === 'achievements' ? 'active' : ''}
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button 
          className={activeTab === 'certificates' ? 'active' : ''}
          onClick={() => setActiveTab('certificates')}
        >
          Certificates
        </button>
        <button 
          className={activeTab === 'marketplace' ? 'active' : ''}
          onClick={() => setActiveTab('marketplace')}
        >
          Rewards Marketplace
        </button>
      </div>
      
      <div className="rewards-content">
        {activeTab === 'achievements' && (
          <div>
            <h3 className="mb-3">Your Child's Achievements</h3>
            <div className="achievement-grid">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`achievement-item ${!achievement.unlocked ? 'achievement-locked' : ''}`}
                >
                  <div className="achievement-icon">
                    {achievement.icon}
                  </div>
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  {achievement.unlocked ? (
                    <div className="text-success">Unlocked!</div>
                  ) : (
                    <div className="text-muted">{achievement.progress}% Complete</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'certificates' && (
          <div>
            <h3 className="mb-3">Printable Certificates</h3>
            {certificates.length === 0 ? (
              <p>No certificates earned yet. Complete activities to earn certificates!</p>
            ) : (
              certificates.map((certificate) => (
                <div key={certificate.id} className="mb-4">
                  <h4>{certificate.title}</h4>
                  <div className="certificate-preview">
                    <div className="certificate-content">
                      <h2>{certificate.title}</h2>
                      <h3>Awarded to: {currentUser.children?.find(child => child.id === certificate.childId)?.name || 'Your Child'}</h3>
                      <p>{certificate.description}</p>
                      <p>Date: {new Date(certificate.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="certificate-actions">
                    <button 
                      className="btn btn-outline" 
                      onClick={() => handleShareCertificate(certificate.id)}
                    >
                      <FaShare className="me-2" /> Share
                    </button>
                    <button 
                      className="btn btn-primary print-button" 
                      onClick={() => handlePrintCertificate(certificate.id)}
                    >
                      <FaPrint className="me-2" /> Print
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        
        {activeTab === 'marketplace' && (
          <div>
            <h3 className="mb-3">Rewards Marketplace</h3>
            <p>Use your points to redeem these special rewards for your child:</p>
            
            <div className="marketplace-grid">
              {marketplace.map((reward) => (
                <div key={reward.id} className="reward-item">
                  <img src={reward.image} alt={reward.name} className="reward-image" />
                  <div className="reward-content">
                    <div className="reward-points">{reward.points} Points</div>
                    <h4>{reward.name}</h4>
                    <p>{reward.description}</p>
                    <button 
                      className="btn btn-primary w-100 mt-2" 
                      disabled={points < reward.points || reward.redeemed}
                      onClick={() => handleRedeemReward(reward.id)}
                    >
                      {reward.redeemed ? 'Redeemed' : 'Redeem Reward'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
