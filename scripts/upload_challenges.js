const fs = require('fs');
const csv = require('csv-parse');
const fetch = require('node-fetch');

// Configuration
const API_URL = 'https://confident-kids-app2.pages.dev/api/challenges/bulk';
const CSV_FILE = 'challenges.csv';

// Function to read and parse CSV
async function readCSV() {
  return new Promise((resolve, reject) => {
    const challenges = [];
    fs.createReadStream(CSV_FILE)
      .pipe(csv.parse({ columns: true, skip_empty_lines: true }))
      .on('data', (row) => {
        challenges.push({
          title: row.title,
          description: row.description,
          instructions: row.description, // Using description as instructions since they're not in the CSV
          pillar_id: parseInt(row.pillar_id),
          difficulty_level: getDifficultyLevel(parseInt(row.difficulty_level)),
          age_group: row.age_group || 'all',
          points_value: 10 // Default points value
        });
      })
      .on('end', () => resolve(challenges))
      .on('error', reject);
  });
}

// Helper function to convert numeric difficulty to text
function getDifficultyLevel(level) {
  switch (level) {
    case 1:
      return 'easy';
    case 2:
      return 'medium';
    case 3:
      return 'hard';
    default:
      return 'medium';
  }
}

// Function to upload challenges to API
async function uploadChallenges(challenges, authToken) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(challenges)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Upload result:', result);
    return result;
  } catch (error) {
    console.error('Error uploading challenges:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    // Read the CSV file
    console.log('Reading CSV file...');
    const challenges = await readCSV();
    console.log(`Found ${challenges.length} challenges to upload`);

    // Get auth token from environment variable
    const authToken = process.env.AUTH_TOKEN;
    if (!authToken) {
      throw new Error('AUTH_TOKEN environment variable is required');
    }

    // Upload challenges
    console.log('Uploading challenges...');
    await uploadChallenges(challenges, authToken);
    console.log('Upload completed successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run the script
main(); 