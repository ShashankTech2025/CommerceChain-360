/**
 * CommerceChain 360 - Root Application Routing
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Logistics from './pages/Logistics';
import Payments from './pages/Payments';
import DataExplorer from './pages/DataExplorer';
import Reports from './pages/Reports';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Overview />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/explorer" element={<DataExplorer />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
