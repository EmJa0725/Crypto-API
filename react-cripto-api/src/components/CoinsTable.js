import { React, useState, useRef, useEffect } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import CoinChart from './CoinChart';


const TableCoins = ({ coins, search }) => {

    const [expandedRows, setExpandedRows] = useState(0);
    const lastPrice = useRef([]);
    const priceStyle = useRef([]);

    const titles = ['#', 'Coin', 'Price', 'Price Change', '24h Volume'];

    const tableStyle = {
        border: '1px solid #0d6efd',
        padding: 0,
        boxShadow: '0px 0px 10px 1px teal'
    }

    const setStylePriceChange = ((oldPrice, newPrice, currentStyle) => {
        if (oldPrice === newPrice) return currentStyle;
        if (oldPrice > newPrice) return 'text-danger priceDown';
        if (oldPrice < newPrice) return 'text-success priceUp';
    })

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(search.toLowerCase()) |
        coin.symbol.toLowerCase().includes(search.toLowerCase())
        )
    
    const currentPriceTemplate = ({ current_price, market_cap_rank}) => {
        const index = market_cap_rank-1;
        priceStyle.current[index] = setStylePriceChange(
            lastPrice.current[index]?.price, current_price, priceStyle.current[index]);   
        return <span className={`ps-1 pe-1 ${priceStyle.current[index]}`}>$ {current_price}</span>;
    }

    const totalVolumeTemplate = ({ total_volume }) => total_volume.toLocaleString();

    const nameTemplate = ({ name, image, symbol }) => {
        return (
            <div>
                <img src={image}
                    alt={name}
                    style={{ width: '8%' }}
                    className="img-fluid me-4"
                />
                <span>{name}</span>
                <span className="ms-3 text-mute text-uppercase">{symbol}</span>
            </div>
        );
    }

    const priceChangeTemplate = ({ price_change_percentage_24h }) => {
        return (
            <div className={price_change_percentage_24h > 0 ? 'text-success' : 'text-danger'}>
                {price_change_percentage_24h.toFixed(2)} %
            </div>
        );
    }

    const rowExpansionTemplate = ({symbol}) => {
        return(<CoinChart symbol={symbol}/>)
    }

    useEffect(() => {
        lastPrice.current = coins?.map(coin => ({
            symbol: coin.symbol, 
            price: coin.current_price
        }))
    }, [coins])

    if (!coins.length) return <ProgressSpinner/>

    return (
        <DataTable
            dataKey="name"
            value={filteredCoins}
            style={tableStyle}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate} 
            >
            <Column
                field="market_cap_rank"
                header={titles[0]}
                style={{width:'3em'}}
            />
            <Column
                expander
                style={{ width: '3em', paddingLeft: '1px'}}
            />
            <Column
                field="name"
                header={titles[1]}
                body={nameTemplate}
            />
            <Column
                field="current_price"
                header={titles[2]}
                body={currentPriceTemplate}
            />
            <Column
                field="price_change_percentage_24h"
                header={titles[3]}
                body={priceChangeTemplate}
            />
            <Column
                field="total_volume"
                header={titles[4]}
                body={totalVolumeTemplate}
            />
        </DataTable>
    )
}

export default TableCoins;
