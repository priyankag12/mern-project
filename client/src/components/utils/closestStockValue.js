export const closestStockValue = async (symbol) => {
    try {
        const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=demo`
        );

        const data = await response.json();

        if (!data["Time Series (5min)"]) {
            // If the stock data is not available, return an error message
            return { message: "Stock data not available." };
        }

        const currentTime = new Date();
        const time24HoursAgo = new Date(
            currentTime.getTime() - 24 * 60 * 60 * 1000
        );

        const fiveMinutesInMs = 5 * 60 * 1000;
        let matchFound = null;

        const timeSeries = data["Time Series (5min)"];
        for (const timestamp in timeSeries) {
            const dataTime = new Date(timestamp);
            const timeDifference = Math.abs(time24HoursAgo - dataTime);

            if (timeDifference <= fiveMinutesInMs) {
                matchFound = {
                    timestamp,
                    data: timeSeries[timestamp],
                };
                break;
            }
        }

        // Return the matching stock data or a message if the market is closed
        return matchFound
            ? matchFound.data
            : { message: "Stock market is closed." };
    } catch (error) {
        // Return an error message in case of failure
        return { message: "Error fetching stock data.", error: error.message };
    }
};
