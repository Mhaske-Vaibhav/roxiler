   const express = require('express');
   const router = express.Router();
   const transactionController = require('../controllers/transactionController');

   router.get('/initialize', transactionController.initializeDatabase);
   router.get('/transactions', transactionController.listTransactions);
   router.get('/statistics', transactionController.getStatistics);
   router.get('/barchart', transactionController.getBarChartData);
   router.get('/piechart', transactionController.getPieChartData);
   router.get('/all', transactionController.getAllData);

   module.exports = router;