# Challenges Upload Script

This script helps you upload challenges from a CSV file to the Confident Kids App API.

## Prerequisites

- Node.js installed on your system
- A valid authentication token for the API
- Your challenges CSV file

## CSV File Format

Your CSV file should have the following columns:
- title: The title of the challenge
- description: A brief description of the challenge
- instructions: Detailed instructions for the challenge
- pillar_id: The ID of the pillar (1-5)
- difficulty_level: (optional) The difficulty level (easy/medium/hard)
- age_group: (optional) The target age group (toddler/elementary/teen/all)
- points_value: (optional) Points awarded for completing the challenge

## Setup

1. Create a `scripts` directory in your project root if it doesn't exist
2. Copy your CSV file to the `scripts` directory and name it `challenges.csv`
3. Install dependencies:
   ```bash
   cd scripts
   npm install
   ```

## Usage

1. Set your authentication token as an environment variable:
   ```bash
   export AUTH_TOKEN="your_auth_token_here"
   ```

2. Run the script:
   ```bash
   node upload_challenges.js
   ```

The script will:
1. Read the CSV file
2. Convert the data to the required JSON format
3. Upload the challenges to the API
4. Display the results of the upload

## Error Handling

If any errors occur during the upload:
- The script will display detailed error messages
- Failed challenges will be reported in the results
- The script will exit with status code 1

## Example CSV

```csv
title,description,instructions,pillar_id,difficulty_level,age_group,points_value
"Morning Independence","Let your child choose their own clothes for the day","Instructions for parents...",1,medium,all,10
"Growth Mindset Moment","Add 'yet' to any statement your child makes","Instructions for parents...",2,easy,all,10
``` 