const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Paths to the data files
const appointFilePath = path.join(__dirname, './appoint.json');
const companiesFilePath = path.join(__dirname, './companies.json');

// Route to handle appoint requests
router.post('/', (req, res) => {
  const { companyId, customerName } = req.body;

  // Check if appoint.json exists, and if not, create an empty array
  if (!fs.existsSync(appointFilePath)) {
    fs.writeFileSync(appointFilePath, JSON.stringify([])); // Create the file with an empty array if it doesn't exist
  }

  // Check if companies.json exists
  if (!fs.existsSync(companiesFilePath)) {
    return res.status(500).json({ error: 'Companies data is missing' });
  }

  // Read the current content of companies.json
  fs.readFile(companiesFilePath, 'utf8', (err, companyData) => {
    if (err) {
      console.error('Error reading companies.json:', err);
      return res.status(500).json({ error: 'Failed to read companies.json' });
    }

    let companies;
    try {
      companies = JSON.parse(companyData); // Parse the companies data
    } catch (error) {
      console.error('Error parsing companies.json:', error);
      return res.status(500).json({ error: 'Failed to parse companies.json' });
    }

    // Find the company by ID
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Create the new appointment object with the company name instead of ID
    const newAppointment = {
      id: Date.now(), // Use current timestamp as unique ID
      customername: customerName,
      companyname: company.companyname, // Corrected: Use the company name from the found company object
      orderDate: new Date().toISOString().split('T')[0], // Get current date in YYYY-MM-DD format
      status: 'pending', // Default status is 'pending'
      communicationPeriodicity: "Every month" // Default communication periodicity
    };

    // Read the current content of appoint.json
    fs.readFile(appointFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading appoint.json:', err);
        return res.status(500).json({ error: 'Failed to read appoint.json' });
      }

      let appoints;
      try {
        appoints = JSON.parse(data); // Parse the appoint data
      } catch (error) {
        console.error('Error parsing appoint.json:', error);
        return res.status(500).json({ error: 'Failed to parse appoint.json' });
      }

      // Push the new appointment to the array
      appoints.push(newAppointment);

      // Write the updated array back to appoint.json
      fs.writeFile(appointFilePath, JSON.stringify(appoints, null, 2), (err) => {
        if (err) {
          console.error('Error writing to appoint.json:', err);
          return res.status(500).json({ error: 'Failed to write to appoint.json' });
        }

        // Respond with the newly created appointment
        res.status(200).json({ orderId: newAppointment.id });
      });
    });
  });
});

module.exports = router;
