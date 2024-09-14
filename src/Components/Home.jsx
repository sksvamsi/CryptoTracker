import React, { useEffect, useState } from "react";
import axios from "axios";
import './Home.css'; // Import the CSS file

const Home = () => {
  const [search, setSearch] = useState("");
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const fetchCoins = async () => {
    try {
      const res = await axios.get("https://api.coinlore.net/api/tickers/");
      console.log(res.data);

      setCoins(res.data.data); // Assuming the coins are in res.data.data
      setFilteredCoins(res.data.data);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 30000); // Poll every 30 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    const result = coins.filter((coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCoins(result);
  }, [search, coins]);

  return (
    <div className="container">
      <header className="header">
        <h1>Real-Time Cryptocurrency Tracker</h1>
        <p>Track the latest prices and changes for your favorite cryptocurrencies.</p>
      </header>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <input
            type="text"
            name="search"
            placeholder="Search here"
            value={search}
            onChange={handleChange}
            className="search-input"
          />
          <table className="coin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Price (USD)</th>
                <th>Change (24h)</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.length > 0 ? (
                filteredCoins.map((coin) => (
                  <tr key={coin.id}>
                    <td className="coin-name">{coin.name}</td>
                    <td className="coin-symbol">{coin.symbol}</td>
                    <td className="coin-price">${parseFloat(coin.price_usd).toFixed(2)}</td>
                    <td className={`coin-change-24h ${parseFloat(coin.percent_change_24h) >= 0 ? 'positive' : ''}`}>
                      {coin.percent_change_24h}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-results">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Home;
