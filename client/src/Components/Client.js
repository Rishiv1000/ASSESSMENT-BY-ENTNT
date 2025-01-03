import React, { useState, useEffect } from 'react'; // Make sure you have 'React' import
import axios from 'axios';
import './Client.css'; // CSS file

function Client() {
  const [companies, setCompanies] = useState([]);
  const [customerName, setCustomerName] = useState(''); // State for customer name
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch companies from the backend when the component is mounted
  useEffect(() => {
    axios.get('https://assessment-by-entnt.onrender.com/api/companies')
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the companies!', error);
      });
  }, []);

  // Handle the click event of the "Appoint" button
  const handleAppoint = (companyId) => {
    if (!customerName.trim()) {
      alert('Please enter a customer name!');
      return;
    }

    setIsLoading(true);
    setError(null); // Reset the error state

    // Send customer name and company ID to the backend to create the order file
    axios.post('https://assessment-by-entnt.onrender.com/api/appoint', { companyId, customerName })
      .then((response) => {
        alert(`Order created successfully with Order ID: ${response.data.orderId}`);
        setCustomerName(''); // Clear the customer name field
        setIsLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error('There was an error creating the order:', error);
        setError('Failed to create order. Please try again.');
        setIsLoading(false); // Stop loading
      });
  };

  return (
    <div className="container">
      <h2 className="company-heading">Company List</h2>

      {/* Customer Name Input */}
      <div>
        <label>
          Customer Name:
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter customer name"
            disabled={isLoading} // Disable input while loading
          />
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Display Companies List */}
      <div className="companies-list">
        {companies.map((company) => (
          <div key={company.id} className="company-row">
            <div className="company-cell">{company.companyname}</div>
            <div className="company-cell">{company.location}</div>
            <div className="company-cell">{company.linkedinProfile}</div>
            <div className="company-cell">{company.emails.join(', ')}</div>
            <div className="company-cell">{company.phoneNumbers.join(', ')}</div>
            <div className="company-cell">{company.comments}</div>
            <div className="company-cell">{company.communicationPeriodicity}</div>

            {/* Appoint Button aligned to the right */}
            <div className="company-cell appoint-button-container">
              <button
                className="appoint-button"
                onClick={() => handleAppoint(company.id)}
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? 'Creating Order...' : 'Appoint'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Client;
