"use client";
import dynamic from 'next/dynamic';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/homepage';
import ContactPage from './pages/contact/contact';
import './globals.css';
import Organisateur from './pages/organisateur/organisateur';
import CompteOrga from './pages/CompteOrga/compteOrga';
import Notification from './pages/CompteOrga/notification/notification';

const DynamicBrowserRouter = dynamic(
  () => import('react-router-dom').then(mod => mod.BrowserRouter),
  { ssr: false }
);

const Page: React.FC = () => {
  return (
    <DynamicBrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/organisateur" element={<Organisateur />} />
        <Route path="/compteOrga" element={<CompteOrga />} />
        <Route path='/notification' element={<Notification />} />
      </Routes>
    </DynamicBrowserRouter>
  );
};

export default Page;
