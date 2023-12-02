const Sales = require('../Models/salesModel');

const generateSalesReport = async (req, res) => {
  try {
    const { chosenMonth } = req.body; // Assuming the month is sent in the request body

    // Create a Date object representing the start of the chosen month
    const startOfMonth = new Date(chosenMonth);
    startOfMonth.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    // Create a Date object representing the start of the next month
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);
    endOfMonth.setHours(0, 0, 0, 0); // Set time to the beginning of the day

    // Use the Sales model to find sales data within the specified date range
    const salesData = await Sales.find({
      saleDate: { $gte: startOfMonth, $lt: endOfMonth },
    });

    // Check if there is no sales data for the specified month
    if (salesData.length === 0) {
      return res.status(404).json({ message: 'No sales data available for the specified month' });
    }

    // Calculate total sales and format the sales data
    const totalSales = salesData.reduce((total, sale) => total + sale.quantitySold, 0);

    // Return the total sales along with the salesData
    res.status(200).json({ salesData, totalSales });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error generating total sales report:', error);

    // Return an error message
    res.status(500).json({ error: 'Error generating total sales report' });
  }
};

module.exports = { generateSalesReport };
