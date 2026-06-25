import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthScreen from './components/AuthScreen';
import YayraChatbot from './components/YayraChatbot';
import Dashboard from './components/Dashboard';
import TemplateGallery from './components/TemplateGallery';
import CoverDesigner from './components/CoverDesigner';
import ExportPanel from './components/ExportPanel';
import './index.css';

export default function App() {
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'home'|'dashboard'|'templates'|'design'|'export'>('home');

  return (
    <ThemeProvider>
      <div className="app-root">
        <Header
          currentTab={currentTab}
          onChangeTab={(t) => setCurrentTab(t)}
          onOpenAuth={() => setAuthOpen(true)}
        />

        <main style={{ padding: '1rem', minHeight: '60vh' }}>
          <section style={{ maxWidth: 960, margin: '0 auto' }}>
            {currentTab === 'home' && (
              <>
                <h1>Welcome to Ritem Pro</h1>
                <p>This is a polished, mobile-first full-stack app ready for Render.</p>
                <p>Use the navigation to explore features, or sign in to create projects.</p>
              </>
            )}

            {currentTab === 'dashboard' && <Dashboard />}
            {currentTab === 'templates' && <TemplateGallery onSelect={(name)=>{ alert(`Template selected: ${name}`); }} />}
            {currentTab === 'design' && <CoverDesigner />}
            {currentTab === 'export' && <ExportPanel />}
          </section>
        </main>

        <Footer />

        <AuthScreen
          open={isAuthOpen}
          onClose={() => setAuthOpen(false)}
          onAuthSuccess={() => { setAuthOpen(false); setCurrentTab('dashboard'); }}
        />

        <YayraChatbot />

        {/* Mobile bottom nav (simple, always visible on small screens) */}
        <nav className="mobile-bottom-nav" aria-label="Primary mobile navigation">
          <button aria-current={currentTab==='home'} onClick={()=>setCurrentTab('home')} aria-label="Home">Home</button>
          <button aria-current={currentTab==='dashboard'} onClick={()=>setCurrentTab('dashboard')} aria-label="Dashboard">Works</button>
          <button aria-current={currentTab==='templates'} onClick={()=>setCurrentTab('templates')} aria-label="Templates">Templates</button>
          <button aria-current={currentTab==='export'} onClick={()=>setCurrentTab('export')} aria-label="Export">Export</button>
          <button onClick={()=>setAuthOpen(true)} aria-label="Sign in">Sign In</button>
        </nav>
      </div>
    </ThemeProvider>
  );
}
