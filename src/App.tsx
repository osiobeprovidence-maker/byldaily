/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Articles } from './pages/Articles';
import { ArticleDetail } from './pages/ArticleDetail';
import { CreatorHub } from './pages/CreatorHub';
import { About } from './pages/About';
import { Forum } from './pages/Forum';
import { NewDiscussion } from './pages/NewDiscussion';
import { AdminDashboard } from './pages/AdminDashboard';
import { Events } from './pages/Events';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Privacy } from './pages/Privacy';
import { Contact } from './pages/Contact';
import { Support } from './pages/Support';
import { Legal } from './pages/Legal';
import { Terms } from './pages/Terms';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="articles" element={<Articles />} />
              <Route path="articles/:id" element={<ArticleDetail />} />
              <Route path="creators" element={<CreatorHub />} />
              <Route path="about" element={<About />} />
              <Route path="spaces" element={<Forum />} />
              <Route path="spaces/new" element={<NewDiscussion />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="live" element={<Events />} />
              <Route path="profile" element={<Profile />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="contact" element={<Contact />} />
              <Route path="support" element={<Support />} />
              <Route path="legal" element={<Legal />} />
              <Route path="terms" element={<Terms />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}
