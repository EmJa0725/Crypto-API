import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios'
import CoinsTable from './components/CoinsTable'
import {ReactComponent as Icon} from './assets/cryptocurrency.svg'

function App() {

  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');

  const getData = async () => {
    try {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
      );
      setCoins(res.data)
    } catch (error) {console.log(error)}
  };

  const filterInputStyle = {
    border: '1px solid #0d6efd',
    boxShadow: '0px 0px 10px 1px teal'
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getData();
    }, 5000);
    return () => clearInterval(interval)
  }, []);

  return (
    <div className='container'>
      <div className="row">
        <h1 className="mt-3 text-left" id="main-title" >
          <span>
            <Icon id='main-title-icon' />
          </span>
          <span id="main-title-text">CRYPTO MARKET PRICES</span>
        </h1>
        <input type='text'
          className='form-control bg-dark text-light mt-4 mb-4 text-center filter-input'
          placeholder='Search a Coin'
          onChange={e => setSearch(e.target.value)}
          style={filterInputStyle}
        />
        <CoinsTable coins={coins} search={search} />
      </div>
    </div>
  );
}

export default App;
