// CONFIGURATION - Put your details here
const CLIENT_ID = "1106824599"; 
const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJkaGFuIiwicGFydG5lcklkIjoiIiwiZXhwIjoxNzY4ODg1ODMzLCJpYXQiOjE3Njg3OTk0MzMsInRva2VuQ29uc3VtZXJUeXBlIjoiU0VMRiIsIndlYmhvb2tVcmwiOiIiLCJkaGFuQ2xpZW50SWQiOiIxMTA2ODI0NTk5In0.1hEk9mNUpJgcE5wIWP1dIkFvMH1m2ZOd6x69_UjvreqOb8e2BeVKRAYUcnZlzgsGsuxYmo5WdouYeLIiSP5Keg";

// The "Security IDs" for the stocks we want to scan (Nifty 50 Examples)
const stockList = {
    "NSE_EQ": [115, 1333, 11536, 1594, 3045, 4963, 1348, 11630, 10604, 1660] 
};

async function startScanner() {
    try {
        const response = await fetch('https://cors-anywhere.herokuapp.com/https://api.dhan.co/v2/marketfeed/ohlc', {
            method: 'POST',
            headers: {
                'access-token': TOKEN,
                'client-id': CLIENT_ID,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stockList)
        });

        const result = await response.json();
        const data = result.data.NSE_EQ;

        const tableBody = document.querySelector('tbody');
        tableBody.innerHTML = ''; // Clear the table

        for (const id in data) {
            const stock = data[id];
            const open = stock.ohlc.open;
            const low = stock.ohlc.low;
            const ltp = stock.last_price;

            // The Core Logic: Is it Open = Low?
            const isOpenLow = (open === low && open > 0);
            
            const row = `
                <tr style="background: ${isOpenLow ? 'rgba(34, 197, 94, 0.1)' : 'transparent'}">
                    <td>ID: ${id}</td>
                    <td>${ltp.toFixed(2)}</td>
                    <td>${open.toFixed(2)}</td>
                    <td>${low.toFixed(2)}</td>
                    <td><span class="badge ${isOpenLow ? 'buy' : 'neutral'}">
                        ${isOpenLow ? 'OPEN=LOW (BUY)' : 'SCANNING'}
                    </span></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        }
    } catch (error) {
        console.error("Scanner Error:", error);
    }
}

// Refresh data every 10 seconds
setInterval(startScanner, 10000);
window.onload = startScanner;
