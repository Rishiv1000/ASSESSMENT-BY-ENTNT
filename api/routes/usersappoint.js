const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Path to the appoint.json file
const appointFilePath = path.join(__dirname, './appoint.json');

// Route to get appointment data
router.get('/appointments', (req, res) => {
  console.log('Request for appointment data received');

  // Check if appoint.json exists
  if (!fs.existsSync(appointFilePath)) {
    console.error('Appointments file not found');
    return res.status(404).json({ error: 'Appointments file not found' });
  }

  // Read the content of appoint.json
  fs.readFile(appointFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading appoint.json:', err);
      return res.status(500).json({ error: 'Failed to read appoint.json' });
    }

    let appoints;
    try {
      appoints = JSON.parse(data); // Parse the appoint data
      console.log('Appointments data parsed:', appoints); // Log parsed data to debug
    } catch (error) {
      console.error('Error parsing appoint.json:', error);
      return res.status(500).json({ error: 'Failed to parse appoint.json' });
    }

    // Send the parsed appointment data back as a response
    res.status(200).json(appoints);
  });
});

module.exports = router;
