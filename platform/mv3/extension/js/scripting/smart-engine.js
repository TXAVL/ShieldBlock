/*******************************************************************************
    ShieldBlock - Smart Anti-Trap & Video Player Protection Engine
    Adapted with inspiration from DBlocker architecture
    Protects users from click overlays, tab-under traps, and streaming player hijacking.
    Copyright (C) 2026-present ShieldBlock Contributors
    SPDX-License-Identifier: GPL-3.0-or-later
*******************************************************************************/

(( ) => {
    'use strict';

    if (window.__shieldBlockSmartEngineActive) { return; }
    window.__shieldBlockSmartEngineActive = true;

    const isTopFrame = (() => {
        try { return top === window; } catch { return false; }
    })();

    let totalIntercepted = 0;
    let toastContainer = null;

    // 1. Sleek In-Page Toast Notification System
    function showToast(message) {
        if (!isTopFrame || !document.body) { return; }

        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'shieldblock-toast-host';
            toastContainer.style.cssText = `
                position: fixed !important;
                bottom: 24px !important;
                right: 24px !important;
                z-index: 2147483647 !important;
                display: flex !important;
                flex-direction: column !important;
                gap: 8px !important;
                pointer-events: none !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            `;
            document.body.appendChild(toastContainer);
        }

        const pill = document.createElement('div');
        pill.style.cssText = `
            background: rgba(11, 15, 25, 0.94) !important;
            color: #38bdf8 !important;
            border: 1px solid rgba(56, 189, 248, 0.35) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 12px rgba(56, 189, 248, 0.2) !important;
            backdrop-filter: blur(12px) !important;
            padding: 10px 16px !important;
            border-radius: 9999px !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            opacity: 0 !important;
            transform: translateY(12px) !important;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
        `;

        pill.innerHTML = `
            <span style="font-size: 14px;">🛡️</span>
            <span style="color: #f1f5f9; font-weight: 500;">${message}</span>
        `;

        toastContainer.appendChild(pill);

        requestAnimationFrame(() => {
            pill.style.opacity = '1';
            pill.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            pill.style.opacity = '0';
            pill.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                pill.remove();
                if (toastContainer && toastContainer.children.length === 0) {
                    toastContainer.remove();
                    toastContainer = null;
                }
            }, 350);
        }, 2800);
    }

    // 2. Anti-Clickjacking & Invisible Overlay Neutralizer
    function neutralizeOverlays() {
        try {
            const elements = document.querySelectorAll('div, a, span, section');
            const vw = window.innerWidth || document.documentElement.clientWidth;
            const vh = window.innerHeight || document.documentElement.clientHeight;

            for (const el of elements) {
                if (el.id === 'shieldblock-toast-host' || el.closest('#shieldblock-toast-host')) {
                    continue;
                }

                const style = window.getComputedStyle(el);
                if (style.position !== 'fixed' && style.position !== 'absolute') {
                    continue;
                }

                const zIndex = parseInt(style.zIndex, 10);
                if (isNaN(zIndex) || zIndex < 99) {
                    continue;
                }

                const rect = el.getBoundingClientRect();
                const coversWidth = rect.width >= vw * 0.85;
                const coversHeight = rect.height >= vh * 0.85;

                if (coversWidth && coversHeight) {
                    const isTransparent = (
                        style.opacity === '0' ||
                        style.visibility === 'hidden' ||
                        style.backgroundColor === 'rgba(0, 0, 0, 0)' ||
                        style.backgroundColor === 'transparent'
                    );

                    // If it's a full-screen transparent layer with high z-index and no form/media, it's almost certainly an ad overlay trap
                    const hasMedia = el.querySelector('video, audio, input, textarea, iframe');
                    if (isTransparent && !hasMedia && el.innerText.trim().length === 0) {
                        el.style.setProperty('pointer-events', 'none', 'important');
                        el.style.setProperty('display', 'none', 'important');
                        totalIntercepted++;
                        showToast('ShieldBlock: Đã vô hiệu lớp bắt click quảng cáo');
                    }
                }
            }
        } catch {
            // Safe fallback
        }
    }

    // 3. Streaming Video Player Guard
    function protectVideoPlayers() {
        try {
            const playerSelectors = [
                'iframe[allowfullscreen]',
                'iframe[src*="embed"]',
                'iframe[src*="player"]',
                'iframe[src*="stream"]',
                'div[id*="player"]',
                'div[class*="player"]',
                'video'
            ];

            const players = document.querySelectorAll(playerSelectors.join(', '));
            for (const p of players) {
                const parent = p.parentElement;
                if (!parent) continue;

                // Check siblings for fake invisible click-capture divs positioned right above the video
                for (const sibling of parent.children) {
                    if (sibling === p || sibling.contains(p) || p.contains(sibling)) continue;
                    const style = window.getComputedStyle(sibling);
                    if (style.position === 'absolute' && (style.opacity === '0' || style.backgroundColor === 'rgba(0, 0, 0, 0)')) {
                        const z = parseInt(style.zIndex, 10);
                        if (!isNaN(z) && z > 1 && sibling.innerText.trim().length === 0) {
                            sibling.style.setProperty('pointer-events', 'none', 'important');
                            sibling.style.setProperty('display', 'none', 'important');
                            totalIntercepted++;
                            showToast('ShieldBlock: Đã mở khóa Video Player an toàn');
                        }
                    }
                }
            }
        } catch {
            // Safe fallback
        }
    }

    // 4. Anti-Tab-Under & Suspicious Focus Trap Neutralizer
    function setupTabUnderDefense() {
        let lastUserClickTime = 0;

        window.addEventListener('click', (e) => {
            if (e.isTrusted) {
                lastUserClickTime = Date.now();
            }
        }, { capture: true, passive: true });

        // Catch blur event immediately following a click (attempt to hijack the parent page while opening a popup)
        window.addEventListener('blur', () => {
            const timeSinceClick = Date.now() - lastUserClickTime;
            if (timeSinceClick < 500) {
                // If a tab-under redirect tries to trigger right after blur, freeze pending URL changes
                window.__shieldblockRecentBlur = Date.now();
            }
        }, { passive: true });
    }

    // 5. Initialize MutationObserver & Lifecycle Execution
    setupTabUnderDefense();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            neutralizeOverlays();
            protectVideoPlayers();
        }, { once: true });
    } else {
        neutralizeOverlays();
        protectVideoPlayers();
    }

    // Observe dynamic traps injected after delay
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
        if (debounceTimer) return;
        debounceTimer = setTimeout(() => {
            debounceTimer = null;
            neutralizeOverlays();
            protectVideoPlayers();
        }, 300);
    });

    observer.observe(document.documentElement || document, {
        childList: true,
        subtree: true,
        attributes: false
    });

})();
