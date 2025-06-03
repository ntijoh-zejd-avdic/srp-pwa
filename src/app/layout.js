'use client'
import { Geist, Geist_Mono } from "next/font/google";
import '../styles/globals.css';
import Navbar from '../components/Navbar';

import Notification from '../components/Notification';
import SettingsSaved from '../components/SettingsSaved';
import InstallPrompt from '../components/InstallPrompt';
import NotificationManager from '../components/NotificationManager';
import AchievementTracker from '../components/AchievementTracker';
import { SettingsProvider } from '../contexts/SettingsContext';
import { useEffect } from 'react';

import RegisterSW from './register-sw';

// ...

export const metadata = {
  title: "SRP PWA",
  description: "A simple SRP-based Progressive Web App",
};
=======
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#FC6B03" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background-section text-black`}
      >
        <Navbar />
        <main className="p-4">{children}</main>
        <RegisterSW />
      </body>
    </html>
  );
}

