import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import CoinsTable from './components/CoinsTable'

function App() {

  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');

  const getData = async () => {
    try {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
      );
      console.log(res.data);
      setCoins(res.data)
    } catch (error) {console.log(error)}
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className='container'>
      <div className="row">
        <h1 className="mt-3 text-center text-">CRYPTO MARKET PRICES</h1>
        <input type='text'
              className='form-control bg-dark text-light border-0 mt-4 text-center'
              placeholder='Search a Coin' 
              onChange={e => setSearch(e.target.value)}
        />
        <CoinsTable coins={coins}  search={search} />
      </div>
    </div>
  );
}

export default App;
