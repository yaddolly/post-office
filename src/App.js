import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import CircularIndeterminate from "./loader";

function App() {
  const [pincode, setPincode] = useState("");
  const [filteredPincode, setFilteredPincode] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    if (pincode.length === 6) {
      fetchPincodeDetails(pincode);
    } else {
      setFilteredPincode([]);
      setError("");
    }
  }, [pincode]);

  const fetchPincodeDetails = async (pincode) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = response.data[0]?.PostOffice || [];
      setFilteredPincode(data);
      setError("");
    } catch (error) {
      setFilteredPincode([]);
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeChange = (e) => {
    const inputPincode = e.target.value.trim();
    if (/^\d+$/.test(inputPincode) || inputPincode === "") {
      setPincode(inputPincode);
    }
  };

  const handleFilterChange = (e) => {
    const filter = e.target.value.toLowerCase();
    setFilterText(filter);
    console.log(filter);
    const filteredResults =
      pincode.length === 6
        ? filteredPincode.filter((item) =>
            item.Name.toLowerCase().includes(filter)
          )
        : [];
     console.log("filteredresult",filteredResults)
    setFilteredPincode(filteredResults);
  };

  

  return (
    <div className="App">
      <div className="container">
        <form>
          <label htmlFor="pincodeInput">Enter Pincode:</label>
          <input
            type="text"
            id="pincodeInput"
            maxLength="6"
            value={pincode}
            onChange={handlePincodeChange}
            placeholder="Pincode"
          />
          <button type="button" onClick={() => fetchPincodeDetails(pincode)}>
            Lookup
          </button>
        </form>

        {loading && <div className="loader"><CircularIndeterminate/></div>}

        {error && <div className="error">{error}</div>}

        {filteredPincode.length === 0 &&
          pincode.length === 6 &&
          !loading &&
          !error && (
            <div className="no-results">
              Couldn't find the postal data you're looking for...
            </div>
          )}

        {filteredPincode.length > 0 && (
          <div className="result-container">
            <input
              type="text"
              id="filterInput"
              value={filterText}
              onChange={handleFilterChange}
              disabled={pincode.length !== 6}
              placeholder="Filter"
            />
          
            {filteredPincode.map((item, index) => (
              <div key={index} className="result-item">
                <p>
                  <strong>Name:</strong> {item.Name}
                </p>
                <p>
                  <strong>Branch Type:</strong> {item.BranchType}
                </p>
                <p>
                  <strong>Delivery Status:</strong> {item.BranchType}
                </p>
                <p>
                  <strong>District:</strong> {item.District}
                </p>
                <p>
                  <strong>State:</strong> {item.State}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;