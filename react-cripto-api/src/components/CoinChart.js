import { React, useEffect } from 'react'
import { pairList } from '../config/pairList' 

function CoinChart({symbol}) {

    const containerId = `tradingviewChart-${symbol}`;

    const tradingViewChartConfig = () => {
        const symbolTradingview = pairList[symbol] || `BINANCE:${symbol.toUpperCase()}USDT`;

        const script = document.createElement('script');
        script.innerHTML = `new TradingView.widget({
            "width": '100%',
            "height": 510,
            "symbol": "${symbolTradingview}",
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "${containerId}"
        })`
        document.getElementById(containerId).appendChild(script)
    }

    useEffect(() => {
        tradingViewChartConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="col-12 mx-auto">
            <div className="tradingview-widget-container">
                <div id={containerId}></div>
            </div>
        </div>
    )
}

export default CoinChart;