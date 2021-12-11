import { React, useState, useRef, useEffect, Fragment } from 'react'
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
        if (oldPrice > newPrice) return 'text-danger price-down';
        if (oldPrice < newPrice) return 'text-success price-up';
    })

    const filteredCoins = coins.filter(coin =>
        coin.name.toLowerCase().includes(search.toLowerCase()) |
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    )

    const marketCapRankTemplate = ({ market_cap_rank }) => (
        <Fragment>
            <span className="p-column-title"> Ranking </span>
            <span> {market_cap_rank} </span>
        </Fragment>
    
    )
    
    const nameTemplate = ({ name, image, symbol }) => (
        <Fragment>
            <span className="p-column-title"> {titles[1]} </span>
            <span>
                <img src={image}
                    alt={name}
                    style={{ width: '20px' }}
                    className="img-fluid me-4"
                />
                <span>{name}</span>
                <span className="ms-3 text-mute text-uppercase">{symbol}</span>
            </span>
        </ Fragment>
    );

    const currentPriceTemplate = ({ current_price, market_cap_rank }) => {
        const index = market_cap_rank - 1;
        priceStyle.current[index] = setStylePriceChange(
            lastPrice.current[index]?.price, current_price, priceStyle.current[index]);
        return (
            <Fragment>
                <span className="p-column-title"> {titles[2]} </span>
                <span className={`pe-1 ${priceStyle.current[index]}`}>$ {current_price}</span>
            </ Fragment>
        )
    }

    const priceChangeTemplate = ({price_change_percentage_24h}) => (
        <Fragment>
            <span className="p-column-title"> {titles[3]} </span>
            {price_change_percentage_24h != null ?
            <span className={price_change_percentage_24h > 0? 'text-success' : 'text-danger'}>
                {price_change_percentage_24h.toFixed(2) ?? 0} %
            </span>
            : <span>{0}</span>
            }
        </Fragment>
    );

    const totalVolumeTemplate = ({ total_volume }) => (
        <Fragment>
            <span className="p-column-title"> {titles[4]} </span>
            {total_volume.toLocaleString()}
        </Fragment>
    );
    
    const rowExpansionTemplate = ({ symbol }) => <CoinChart symbol={symbol}/>
    
    useEffect(() => {
        lastPrice.current = coins?.map(coin => ({
            symbol: coin.symbol,
            price: coin.current_price
        }))
    }, [coins])
    
    if (!coins.length) return <ProgressSpinner />
    
    return (
        <DataTable
            dataKey="name"
            value={filteredCoins}
            style={tableStyle}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            className="mb-4 coins-datatable"
        >
            <Column
                field="market_cap_rank"
                header={titles[0]}
                className="marketcap-rank"
                body={marketCapRankTemplate}
            />
            <Column
                expander
                className="chart-expand"
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
