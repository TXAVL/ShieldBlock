import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'cws_assets');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const chromeExe = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const shieldSvg = `
<svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="512" height="512" rx="110" fill="url(#bgGrad)"/>
  <path d="M256 70 L390 125 V256 C390 350 330 425 256 450 C182 425 122 350 122 256 V125 Z" 
        fill="none" stroke="#38bdf8" stroke-width="20" stroke-opacity="0.3" filter="url(#glow)"/>
  <path d="M256 85 L375 135 V256 C375 340 320 405 256 430 C192 405 137 340 137 256 V135 Z" 
        fill="url(#shieldGrad)"/>
  <path d="M256 120 L345 160 V256 C345 320 305 370 256 390 C207 370 167 320 167 256 V160 Z" 
        fill="#0f172a" fill-opacity="0.35"/>
  <path d="M200 255 L240 295 L315 200" 
        fill="none" stroke="#ffffff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// Templates
const templates = {
  // 1. Screenshot 1: Overview & Active Blocking
  'screenshot-1-overview': {
    width: 1280,
    height: 800,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body {
    width: 1280px;
    height: 800px;
    background: radial-gradient(ellipse at top left, #0e1e38 0%, #080d1a 100%);
    color: #f8fafc;
    overflow: hidden;
    position: relative;
    padding: 36px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  /* Background decorative glow */
  .bg-glow-1 {
    position: absolute;
    top: -120px;
    right: -100px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, rgba(14, 165, 233, 0) 70%);
    border-radius: 50%;
    filter: blur(50px);
    pointer-events: none;
  }
  .bg-glow-2 {
    position: absolute;
    bottom: -150px;
    left: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(2, 132, 199, 0.2) 0%, rgba(2, 132, 199, 0) 70%);
    border-radius: 50%;
    filter: blur(50px);
    pointer-events: none;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .logo-wrap {
    width: 48px;
    height: 48px;
  }
  .brand-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff 40%, #7dd3fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .brand-tag {
    font-size: 13px;
    font-weight: 600;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 3px 10px;
    border-radius: 999px;
    margin-left: 8px;
  }
  .header-features {
    display: flex;
    gap: 12px;
  }
  .feature-pill {
    font-size: 13px;
    font-weight: 500;
    color: #94a3b8;
    background: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 6px 14px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .feature-pill span { color: #38bdf8; font-weight: 700; }

  /* Main Hero Showcase */
  .showcase {
    display: flex;
    gap: 32px;
    align-items: center;
    height: 570px;
    position: relative;
    z-index: 10;
  }

  /* Browser Window Mockup */
  .browser-window {
    flex: 1.4;
    height: 100%;
    background: #0b1120;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .window-bar {
    height: 42px;
    background: #111b2e;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    padding: 0 16px;
    gap: 14px;
  }
  .window-dots {
    display: flex;
    gap: 8px;
  }
  .dot { width: 11px; height: 11px; border-radius: 50%; }
  .dot-red { background: #ef4444; }
  .dot-yellow { background: #eab308; }
  .dot-green { background: #22c55e; }

  .address-bar {
    flex: 1;
    height: 28px;
    background: #070d18;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.07);
    display: flex;
    align-items: center;
    padding: 0 12px;
    font-size: 12px;
    color: #94a3b8;
    gap: 8px;
  }
  .lock-icon { color: #22c55e; font-size: 11px; }

  .browser-body {
    flex: 1;
    background: #060913;
    position: relative;
    overflow: hidden;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  
  .fake-page-header {
    height: 32px;
    background: rgba(255,255,255,0.04);
    border-radius: 6px;
    width: 60%;
  }
  .fake-video-player {
    height: 270px;
    background: linear-gradient(145deg, #111a2e, #0c1322);
    border-radius: 12px;
    border: 1px solid rgba(56, 189, 248, 0.15);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
  }
  .play-btn {
    width: 68px;
    height: 68px;
    background: rgba(2, 132, 199, 0.85);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 30px rgba(56, 189, 248, 0.4);
  }
  .play-triangle {
    width: 0;
    height: 0;
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
    border-left: 22px solid #ffffff;
    margin-left: 5px;
  }
  .video-clean-tag {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(34, 197, 94, 0.15);
    border: 1px solid rgba(34, 197, 94, 0.4);
    color: #4ade80;
    font-size: 12px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .fake-lines {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .fake-line {
    height: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  /* Extension Popup Overlay */
  .popup-card {
    flex: 1;
    height: 100%;
    background: rgba(15, 23, 42, 0.94);
    border-radius: 20px;
    border: 1px solid rgba(56, 189, 248, 0.35);
    box-shadow: 0 20px 50px -10px rgba(2, 132, 199, 0.3), 0 0 30px rgba(56, 189, 248, 0.1);
    backdrop-filter: blur(12px);
    display: flex;
    flex-direction: column;
    padding: 24px;
    position: relative;
  }
  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }
  .popup-title {
    font-size: 18px;
    font-weight: 700;
    color: #f1f5f9;
  }
  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.15);
    padding: 4px 10px;
    border-radius: 999px;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    background: #38bdf8;
    border-radius: 50%;
    box-shadow: 0 0 8px #38bdf8;
  }

  /* Power button */
  .power-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 0 18px 0;
  }
  .power-btn {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: radial-gradient(circle, #0284c7 0%, #0369a1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 35px rgba(56, 189, 248, 0.5), inset 0 2px 4px rgba(255,255,255,0.4);
    border: 3px solid rgba(255, 255, 255, 0.2);
    position: relative;
  }
  .power-icon {
    width: 44px;
    height: 44px;
    fill: none;
    stroke: #ffffff;
    stroke-width: 3.5;
    stroke-linecap: round;
  }
  .power-label {
    margin-top: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #38bdf8;
    letter-spacing: 0.5px;
  }

  /* Stats grid */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 10px;
  }
  .stat-card {
    background: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .stat-val {
    font-size: 26px;
    font-weight: 800;
    color: #38bdf8;
    line-height: 1;
  }
  .stat-desc {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
  }

  /* Quick action row */
  .action-row {
    margin-top: 16px;
    display: flex;
    gap: 8px;
  }
  .act-btn {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: 10px;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: #cbd5e1;
  }
  .act-btn.highlight {
    background: rgba(14, 165, 233, 0.15);
    border-color: rgba(14, 165, 233, 0.4);
    color: #38bdf8;
  }

  /* Bottom footer */
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 10;
    padding-top: 6px;
  }
  .footer-left {
    font-size: 13px;
    color: #64748b;
  }
  .footer-badges {
    display: flex;
    gap: 10px;
  }
  .badge-item {
    font-size: 12px;
    font-weight: 700;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.2);
    padding: 4px 12px;
    border-radius: 6px;
  }
</style>
</head>
<body>
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>

  <!-- Header -->
  <div class="header">
    <div class="brand">
      <div class="logo-wrap">${shieldSvg}</div>
      <div>
        <div style="display:flex; align-items:center;">
          <span class="brand-title">ShieldBlock Pro</span>
          <span class="brand-tag">Manifest V3</span>
        </div>
        <div style="font-size:12px; color:#94a3b8; margin-top:2px;">Lightweight Ad & Tracker Blocker for Chromium</div>
      </div>
    </div>
    <div class="header-features">
      <div class="feature-pill">⚡ <span>Native DNR</span> Engine</div>
      <div class="feature-pill">🛡️ <span>Zero Telemetry</span></div>
      <div class="feature-pill">🚀 <span>Ultra-low RAM</span></div>
    </div>
  </div>

  <!-- Main Showcase Area -->
  <div class="showcase">
    <!-- Browser Mockup -->
    <div class="browser-window">
      <div class="window-bar">
        <div class="window-dots">
          <div class="dot dot-red"></div>
          <div class="dot dot-yellow"></div>
          <div class="dot dot-green"></div>
        </div>
        <div class="address-bar">
          <span class="lock-icon">🔒</span>
          <span>https://www.youtube.com/watch?v=shieldblock-fast-stream</span>
        </div>
      </div>
      <div class="browser-body">
        <div class="fake-page-header"></div>
        <div class="fake-video-player">
          <div class="video-clean-tag">✓ YouTube Video Ads Cleaned</div>
          <div class="play-btn">
            <div class="play-triangle"></div>
          </div>
        </div>
        <div class="fake-lines">
          <div class="fake-line" style="width: 85%;"></div>
          <div class="fake-line" style="width: 70%;"></div>
          <div class="fake-line" style="width: 40%;"></div>
        </div>
      </div>
    </div>

    <!-- Extension Popup Mockup -->
    <div class="popup-card">
      <div class="popup-header">
        <div class="popup-title">ShieldBlock Pro</div>
        <div class="status-badge">
          <div class="status-dot"></div>
          PROTECTION ON
        </div>
      </div>

      <div class="power-section">
        <div class="power-btn">
          <svg class="power-icon" viewBox="0 0 24 24">
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
            <line x1="12" y1="2" x2="12" y2="12"></line>
          </svg>
        </div>
        <div class="power-label">Active on this site</div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-val">34</div>
          <div class="stat-desc">Blocked on this page</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">12.8k</div>
          <div class="stat-desc">Total threats stopped</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">0 ms</div>
          <div class="stat-desc">Network rule latency</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">100%</div>
          <div class="stat-desc">Local evaluation</div>
        </div>
      </div>

      <div class="action-row">
        <div class="act-btn highlight">🎯 Element Picker</div>
        <div class="act-btn">⚡ Element Zapper</div>
        <div class="act-btn">⚙️ Settings</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="footer-left">Open Source • GPL v3 • Designed for Chrome, Brave, Edge & Opera</div>
    <div class="footer-badges">
      <div class="badge-item">Instant YouTube Bypass</div>
      <div class="badge-item">Anti-Adblock Defeated</div>
      <div class="badge-item">Popup Blocker</div>
    </div>
  </div>
</body>
</html>`
  },

  // 2. Screenshot 2: Features & Architecture
  'screenshot-2-features': {
    width: 1280,
    height: 800,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body {
    width: 1280px;
    height: 800px;
    background: radial-gradient(ellipse at top right, #0e1e38 0%, #080d1a 100%);
    color: #f8fafc;
    overflow: hidden;
    position: relative;
    padding: 44px 52px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .bg-glow-1 {
    position: absolute;
    top: -100px;
    left: -100px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(14, 165, 233, 0) 70%);
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
  }

  .header {
    text-align: center;
    position: relative;
    z-index: 10;
  }
  .top-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 4px 14px;
    border-radius: 999px;
    margin-bottom: 12px;
  }
  .title {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff 30%, #7dd3fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .subtitle {
    font-size: 15px;
    color: #94a3b8;
    margin-top: 6px;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }

  /* 4 Pillars Grid */
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px;
    position: relative;
    z-index: 10;
    margin: 20px 0;
  }
  .card {
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 16px;
    padding: 24px 26px;
    display: flex;
    gap: 18px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
  }
  .card-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.25), rgba(2, 132, 199, 0.1));
    border: 1px solid rgba(56, 189, 248, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }
  .card-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #f1f5f9;
  }
  .card-desc {
    font-size: 13px;
    line-height: 1.5;
    color: #94a3b8;
  }
  .card-tag {
    margin-top: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #38bdf8;
  }

  /* Bottom banner */
  .privacy-banner {
    background: rgba(14, 165, 233, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: 14px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 10;
  }
  .privacy-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .privacy-icon {
    font-size: 28px;
  }
  .privacy-title {
    font-size: 15px;
    font-weight: 700;
    color: #ffffff;
  }
  .privacy-desc {
    font-size: 12px;
    color: #94a3b8;
  }
  .privacy-badge {
    background: #0284c7;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    padding: 8px 16px;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(2, 132, 199, 0.4);
  }
</style>
</head>
<body>
  <div class="bg-glow-1"></div>

  <div class="header">
    <div class="top-tag">🛡️ NEXT-GENERATION CONTENT FILTERING</div>
    <div class="title">Engineered for Extreme Speed & Privacy</div>
    <div class="subtitle">Built entirely on Chromium's native Declarative Net Request architecture for frictionless web navigation.</div>
  </div>

  <div class="features-grid">
    <div class="card">
      <div class="card-icon">⚡</div>
      <div class="card-content">
        <div class="card-title">Native Declarative Net Request</div>
        <div class="card-desc">Evaluates ad and tracker rules natively inside the browser engine. Zero JavaScript execution overhead for rule matching.</div>
        <div class="card-tag">⚡ 0ms Latency Overhead</div>
      </div>
    </div>

    <div class="card">
      <div class="card-icon">🎬</div>
      <div class="card-content">
        <div class="card-title">Zero-Delay YouTube Ad Cleaner</div>
        <div class="card-desc">Automatically eliminates video ads, mid-rolls, and sponsorship banners while bypassing anti-adblock detection scripts.</div>
        <div class="card-tag">✓ Seamless Video Playback</div>
      </div>
    </div>

    <div class="card">
      <div class="card-icon">🚫</div>
      <div class="card-content">
        <div class="card-title">Intelligent Pop-up & Redirect Blocker</div>
        <div class="card-desc">Intercepts deceptive pop-unders, shady background tabs, and forced redirect attempts before they hijack your browser.</div>
        <div class="card-tag">🔒 Safe Browsing Guaranteed</div>
      </div>
    </div>

    <div class="card">
      <div class="card-icon">🎯</div>
      <div class="card-content">
        <div class="card-title">Live Element Picker & Zapper</div>
        <div class="card-desc">Point, preview, and permanently eliminate any annoying overlay, newsletter popup, or sticky video with 1 click.</div>
        <div class="card-tag">🛠️ Custom Visual Rules</div>
      </div>
    </div>
  </div>

  <div class="privacy-banner">
    <div class="privacy-left">
      <div class="privacy-icon">🛡️</div>
      <div>
        <div class="privacy-title">100% Client-Side Evaluation & Zero Telemetry</div>
        <div class="privacy-desc">No accounts, no external tracking, no analytics. All rules and preferences reside strictly on your device.</div>
      </div>
    </div>
    <div class="privacy-badge">Strict Privacy Shield</div>
  </div>
</body>
</html>`
  },

  // 3. Screenshot 3: Settings & Dashboard
  'screenshot-3-dashboard': {
    width: 1280,
    height: 800,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body {
    width: 1280px;
    height: 800px;
    background: #080d1a;
    color: #f8fafc;
    overflow: hidden;
    position: relative;
    padding: 36px 48px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .logo-box {
    width: 44px;
    height: 44px;
  }
  .title {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
  }
  .subtitle {
    font-size: 13px;
    color: #94a3b8;
  }
  .nav-tabs {
    display: flex;
    background: #111b2e;
    border-radius: 10px;
    padding: 4px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .nav-tab {
    font-size: 13px;
    font-weight: 600;
    padding: 8px 18px;
    border-radius: 8px;
    color: #94a3b8;
  }
  .nav-tab.active {
    background: #0284c7;
    color: #ffffff;
    box-shadow: 0 0 12px rgba(2, 132, 199, 0.4);
  }

  /* Main Dashboard UI Mockup */
  .dashboard-window {
    flex: 1;
    background: #0f172a;
    border-radius: 16px;
    border: 1px solid rgba(56, 189, 248, 0.2);
    margin: 20px 0;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    display: flex;
    overflow: hidden;
  }

  /* Sidebar */
  .dash-sidebar {
    width: 240px;
    background: #0b1220;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .side-item {
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    padding: 10px 14px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .side-item.active {
    background: rgba(14, 165, 233, 0.15);
    color: #38bdf8;
    border: 1px solid rgba(14, 165, 233, 0.3);
  }

  /* Main list */
  .dash-content {
    flex: 1;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: hidden;
  }
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content-title {
    font-size: 17px;
    font-weight: 700;
    color: #f1f5f9;
  }
  .update-btn {
    font-size: 12px;
    font-weight: 700;
    background: #0284c7;
    color: white;
    padding: 6px 14px;
    border-radius: 6px;
    border: none;
  }

  .ruleset-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .ruleset-item {
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    padding: 12px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ruleset-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .checkbox {
    width: 18px;
    height: 18px;
    background: #0284c7;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }
  .ruleset-name {
    font-size: 13px;
    font-weight: 600;
    color: #f1f5f9;
  }
  .ruleset-meta {
    font-size: 11px;
    color: #64748b;
  }
  .ruleset-count {
    font-size: 12px;
    font-weight: 700;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
    padding: 3px 10px;
    border-radius: 999px;
  }

  /* Bottom status bar */
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .stat-pill {
    font-size: 12px;
    color: #94a3b8;
  }
  .stat-pill strong { color: #38bdf8; }
</style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <div class="logo-box">${shieldSvg}</div>
      <div>
        <div class="title">ShieldBlock Control Dashboard</div>
        <div class="subtitle">Complete control over your privacy rulesets and declarative filter engines</div>
      </div>
    </div>
    <div class="nav-tabs">
      <div class="nav-tab">General</div>
      <div class="nav-tab active">Filter Lists</div>
      <div class="nav-tab">My Filters</div>
      <div class="nav-tab">Backup</div>
    </div>
  </div>

  <div class="dashboard-window">
    <div class="dash-sidebar">
      <div class="side-item active">📋 Built-in Filters</div>
      <div class="side-item">🛡️ Ads & Trackers</div>
      <div class="side-item">🎬 YouTube Enhancer</div>
      <div class="side-item">🚫 Malicious Domains</div>
      <div class="side-item">💾 Storage & Backup</div>
      <div class="side-item">⚙️ Advanced Settings</div>
    </div>

    <div class="dash-content">
      <div class="content-header">
        <div class="content-title">Active Filter Rulesets (325,480 rules compiled)</div>
        <div class="update-btn">Update Now</div>
      </div>

      <div class="ruleset-list">
        <div class="ruleset-item">
          <div class="ruleset-left">
            <div class="checkbox">✓</div>
            <div>
              <div class="ruleset-name">ShieldBlock Filters – Core Engine</div>
              <div class="ruleset-meta">Optimized Declarative Net Request rules</div>
            </div>
          </div>
          <div class="ruleset-count">48,210 rules</div>
        </div>

        <div class="ruleset-item">
          <div class="ruleset-left">
            <div class="checkbox">✓</div>
            <div>
              <div class="ruleset-name">EasyList Standard Ad Blocker</div>
              <div class="ruleset-meta">Global primary ad blocking network rules</div>
            </div>
          </div>
          <div class="ruleset-count">64,192 rules</div>
        </div>

        <div class="ruleset-item">
          <div class="ruleset-left">
            <div class="checkbox">✓</div>
            <div>
              <div class="ruleset-name">EasyPrivacy Tracker Defense</div>
              <div class="ruleset-meta">Blocks third-party web trackers & analytics</div>
            </div>
          </div>
          <div class="ruleset-count">32,840 rules</div>
        </div>

        <div class="ruleset-item">
          <div class="ruleset-left">
            <div class="checkbox">✓</div>
            <div>
              <div class="ruleset-name">Peter Lowe's Ad & Tracking Server List</div>
              <div class="ruleset-meta">Curated ad server DNS & domain blocks</div>
            </div>
          </div>
          <div class="ruleset-count">4,200 rules</div>
        </div>

        <div class="ruleset-item">
          <div class="ruleset-left">
            <div class="checkbox">✓</div>
            <div>
              <div class="ruleset-name">YouTube Ad Cleaner & Bypass</div>
              <div class="ruleset-meta">Eliminates video ads and anti-adblock notices</div>
            </div>
          </div>
          <div class="ruleset-count">12,150 rules</div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <div class="stat-pill">Engine status: <strong>Operational (Manifest V3)</strong></div>
    <div class="stat-pill">Local Memory Profile: <strong>14.2 MB RAM consumed</strong></div>
    <div class="stat-pill">Declarative Net Request: <strong>Active (Zero latency)</strong></div>
  </div>
</body>
</html>`
  },

  // 4. Promo Small Tile: 440x280 px
  'promo-small-440x280': {
    width: 440,
    height: 280,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body {
    width: 440px;
    height: 280px;
    background: radial-gradient(ellipse at top left, #0e1e38 0%, #060913 100%);
    color: #f8fafc;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 24px;
  }
  
  .glow {
    position: absolute;
    width: 250px;
    height: 250px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(14, 165, 233, 0) 70%);
    border-radius: 50%;
    filter: blur(40px);
    pointer-events: none;
  }

  .logo {
    width: 76px;
    height: 76px;
    margin-bottom: 12px;
    position: relative;
    z-index: 10;
    filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.4));
  }

  .title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff 40%, #7dd3fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    z-index: 10;
  }

  .subtitle {
    font-size: 13px;
    font-weight: 500;
    color: #94a3b8;
    margin-top: 4px;
    position: relative;
    z-index: 10;
  }

  .badges {
    display: flex;
    gap: 8px;
    margin-top: 14px;
    position: relative;
    z-index: 10;
  }

  .badge {
    font-size: 11px;
    font-weight: 700;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 3px 10px;
    border-radius: 999px;
  }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="logo">${shieldSvg}</div>
  <div class="title">ShieldBlock Pro</div>
  <div class="subtitle">Ad & Tracker Blocker • Manifest V3</div>
  <div class="badges">
    <div class="badge">⚡ Fast & Private</div>
    <div class="badge">🎬 Clean YouTube</div>
    <div class="badge">🛡️ Zero Ads</div>
  </div>
</body>
</html>`
  },

  // 5. Promo Marquee Tile: 1400x560 px
  'promo-marquee-1400x560': {
    width: 1400,
    height: 560,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body {
    width: 1400px;
    height: 560px;
    background: radial-gradient(ellipse at top left, #0e1e38 0%, #050811 100%);
    color: #f8fafc;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 60px 80px;
  }
  
  .glow-left {
    position: absolute;
    top: -100px;
    left: -100px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, rgba(14, 165, 233, 0) 70%);
    border-radius: 50%;
    filter: blur(60px);
    pointer-events: none;
  }

  .left-col {
    max-width: 650px;
    position: relative;
    z-index: 10;
  }
  .logo-row {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 20px;
  }
  .logo {
    width: 64px;
    height: 64px;
    filter: drop-shadow(0 0 20px rgba(56, 189, 248, 0.5));
  }
  .brand-name {
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff 40%, #7dd3fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .brand-pill {
    font-size: 13px;
    font-weight: 700;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 4px 12px;
    border-radius: 999px;
  }

  .headline {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.25;
    color: #ffffff;
    margin-bottom: 14px;
  }
  .subheadline {
    font-size: 16px;
    line-height: 1.5;
    color: #94a3b8;
    margin-bottom: 24px;
  }

  .chips {
    display: flex;
    gap: 12px;
  }
  .chip {
    font-size: 13px;
    font-weight: 600;
    background: rgba(30, 41, 59, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 8px 16px;
    border-radius: 999px;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .chip span { color: #38bdf8; font-weight: 700; }

  /* Right cards */
  .right-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 460px;
    position: relative;
    z-index: 10;
  }
  .info-card {
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid rgba(56, 189, 248, 0.25);
    border-radius: 14px;
    padding: 18px 22px;
    display: flex;
    align-items: center;
    gap: 16px;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }
  .info-icon {
    font-size: 28px;
    width: 48px;
    height: 48px;
    background: rgba(14, 165, 233, 0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .info-title {
    font-size: 16px;
    font-weight: 700;
    color: #f1f5f9;
  }
  .info-desc {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 2px;
  }
</style>
</head>
<body>
  <div class="glow-left"></div>

  <div class="left-col">
    <div class="logo-row">
      <div class="logo">${shieldSvg}</div>
      <div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="brand-name">ShieldBlock Pro</span>
          <span class="brand-pill">Manifest V3</span>
        </div>
      </div>
    </div>
    <div class="headline">Block Ads, Stop Trackers & Enjoy Lightning-Fast Browsing</div>
    <div class="subheadline">An intelligent, privacy-first ad blocker powered by Chrome's native Declarative Net Request engine. 100% telemetry-free and open-source.</div>
    <div class="chips">
      <div class="chip">⚡ <span>Native DNR</span> 0ms Latency</div>
      <div class="chip">🎬 <span>YouTube</span> Ad Cleaner</div>
      <div class="chip">🔒 <span>100% Local</span> Privacy</div>
    </div>
  </div>

  <div class="right-col">
    <div class="info-card">
      <div class="info-icon">⚡</div>
      <div>
        <div class="info-title">Zero CPU & Memory Burden</div>
        <div class="info-desc">No heavy background scripts slowing your browser down.</div>
      </div>
    </div>
    <div class="info-card">
      <div class="info-icon">🎬</div>
      <div>
        <div class="info-title">Zero-Delay YouTube Cleaner</div>
        <div class="info-desc">Instant ad bypass with automatic anti-blocker resolution.</div>
      </div>
    </div>
    <div class="info-card">
      <div class="info-icon">🛡️</div>
      <div>
        <div class="info-title">Complete Data Privacy</div>
        <div class="info-desc">No tracking, no remote logging. Your data belongs to you.</div>
      </div>
    </div>
  </div>
</body>
</html>`
  }
};

console.log('Rendering CWS Assets via Headless Chrome...');

for (const [name, config] of Object.entries(templates)) {
  const htmlPath = path.join(outDir, `${name}.html`);
  const pngPath = path.join(outDir, `${name}.png`);
  
  fs.writeFileSync(htmlPath, config.html, 'utf8');
  
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  
  console.log(`Rendering ${name}.png (${config.width}x${config.height})...`);
  
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${config.width},${config.height}`,
    `--screenshot=${pngPath}`,
    fileUrl
  ];
  
  const result = spawnSync(chromeExe, args);
  if (result.status !== 0) {
    console.error(`Failed to render ${name}:`, result.stderr?.toString());
  } else {
    const stats = fs.statSync(pngPath);
    console.log(`✓ Generated ${name}.png (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

console.log('\\nAll CWS assets generated successfully in:', outDir);
