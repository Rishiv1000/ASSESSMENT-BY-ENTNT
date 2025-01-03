const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// File path to store the companies data
const companiesFilePath = path.join(__dirname, './companies.json');

// Read all companies data from the JSON file
const readCompaniesData = () => {
  if (!fs.existsSync(companiesFilePath)) {
    throw new Error('Companies file does not exist');
  }
  const data = fs.readFileSync(companiesFilePath);
  return JSON.parse(data);
};

// Write companies data to the JSON file
const writeCompaniesData = (data) => {
  fs.writeFileSync(companiesFilePath, JSON.stringify(data, null, 2));
};

// Get all companies
router.get('/companies', (req, res) => {
  try {
    const companies = readCompaniesData();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Error reading companies data', details: err.message });
  }
});

// Add a new company
router.post('/companies', (req, res) => {
  const { companyname, location, linkedinProfile, emails, phoneNumbers, comments, communicationPeriodicity } = req.body;

  if (!companyname || !location || !linkedinProfile || !emails || !phoneNumbers || !communicationPeriodicity) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  try {
    const companies = readCompaniesData();
    const newCompany = {
      id: companies.length + 1,  // Simple method, but consider a better unique ID approach
      companyname,
      location,
      linkedinProfile,
      emails: Array.isArray(emails) ? emails : emails.split(',').map(email => email.trim()),  // Ensure emails is an array
      phoneNumbers: Array.isArray(phoneNumbers) ? phoneNumbers : phoneNumbers.split(',').map(phone => phone.trim()),  // Ensure phoneNumbers is an array
      comments,
      communicationPeriodicity
    };

    companies.push(newCompany);
    writeCompaniesData(companies);

    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ error: 'Error adding new company', details: err.message });
  }
});

// Update a company by ID
// Update a company by ID
router.put('/companies/:id', (req, res) => {
  const { id } = req.params;
  const { companyname, location, linkedinProfile, emails, phoneNumbers, comments, communicationPeriodicity } = req.body;

  try {
    const companies = readCompaniesData();
    const companyIndex = companies.findIndex(company => company.id === parseInt(id));

    if (companyIndex === -1) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Ensure emails and phoneNumbers are arrays
    const updatedCompany = {
      ...companies[companyIndex],
      companyname,
      location,
      linkedinProfile,
      emails: Array.isArray(emails) ? emails : emails.split(',').map(email => email.trim()),  // Ensure emails is an array
      phoneNumbers: Array.isArray(phoneNumbers) ? phoneNumbers : phoneNumbers.split(',').map(phone => phone.trim()),  // Ensure phoneNumbers is an array
      comments,
      communicationPeriodicity
    };

    // Update the company in the list
    companies[companyIndex] = updatedCompany;

    // Write updated data to storage
    writeCompaniesData(companies);

    // Respond with the updated company data
    res.json(updatedCompany);
  } catch (err) {
    console.error('Error during PUT /companies/:id', err);
    res.status(500).json({ error: 'Error updating company', details: err.message });
  }
});
// Delete a company by ID
router.delete('/companies/:id', (req, res) => {
  const { id } = req.params;

  try {
    let companies = readCompaniesData();
    companies = companies.filter(company => company.id !== parseInt(id));

    writeCompaniesData(companies);
    res.status(200).json({ message: 'Company deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting company', details: err.message });
  }
});

module.exports = router;
