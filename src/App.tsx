import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthScreen from './components/AuthScreen';
import YayraChatbot from './components/YayraChatbot';

export default function App() {
  return (
    <ThemeProvider>
      <div className="app-root">
        <Header />
        <main style={{padding: '1rem', minHeight: '60vh'}}>
          <section style={{maxWidth: 960, margin: '0 auto'}}>
            <h1>Welcome to Ritem Pro</h1>
            <p>This is a polished starter build — mobile friendly and ready for Render deployment.</p>
            <p>Use the navigation to explore features, or sign in to create projects.</p>
          </section>
        </main>
        <Footer />
        <AuthScreen />
        <YayraChatbot />
      </div>
    </ThemeProvider>
  );
}
