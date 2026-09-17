/*******************************************************************************
    ShieldBlock - TXA Studio Cloud Sync & Smart Guard Dashboard UI
    Copyright (C) 2026-present ShieldBlock & TXA Studio
    SPDX-License-Identifier: GPL-3.0-or-later
*******************************************************************************/

import { dom, qs$ } from './dom.js';
import { sendMessage } from './ext.js';

let currentUser = null;

async function refreshCloudUI() {
    try {
        currentUser = await sendMessage({ what: 'txaCloudGetUser' });
        const meta = await sendMessage({ what: 'txaCloudGetMeta' });

        const loggedInSection = qs$('#txaCloudLoggedIn');
        const loggedOutSection = qs$('#txaCloudLoggedOut');
        const userEmailEl = qs$('#txaUserEmail');
        const userDisplayNameEl = qs$('#txaUserDisplayName');
        const lastSyncEl = qs$('#txaLastSyncTime');

        if (currentUser?.email) {
            if (loggedInSection) loggedInSection.style.display = 'block';
            if (loggedOutSection) loggedOutSection.style.display = 'none';

            if (userEmailEl) userEmailEl.textContent = currentUser.email;
            if (userDisplayNameEl) userDisplayNameEl.textContent = currentUser.display_name || 'TXA Studio Member';

            if (lastSyncEl) {
                lastSyncEl.textContent = meta?.lastSyncAt 
                    ? new Date(meta.lastSyncAt).toLocaleString() 
                    : 'Chưa đồng bộ';
            }
        } else {
            if (loggedInSection) loggedInSection.style.display = 'none';
            if (loggedOutSection) loggedOutSection.style.display = 'block';
        }
    } catch {
        // Fallback
    }
}

function setOAuthStatus(message, color) {
    const statusEl = qs$('#txaOAuthStatus');
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.style.color = color || '#38bdf8';
}

async function performOAuthExchange(code) {
    if (!code) return;
    const btn = qs$('#btnSubmitOAuthCode');
    if (btn) btn.disabled = true;
    setOAuthStatus('Đang xác thực mã ủy quyền TXA Studio...', '#38bdf8');

    try {
        const res = await sendMessage({
            what: 'txaCloudOAuthExchange',
            code: code.trim()
        });

        if (res?.success) {
            setOAuthStatus(`✓ Đăng nhập thành công! Xin chào ${res.user?.display_name || res.user?.email || 'bạn'}!`, '#4ade80');
            const codeInput = qs$('#inputOAuthCode');
            if (codeInput) codeInput.value = '';
            setTimeout(() => {
                refreshCloudUI();
                setOAuthStatus('', '');
            }, 1200);
        } else {
            setOAuthStatus(`⚠️ ${res?.error || 'Mã ủy quyền không hợp lệ hoặc đã hết hạn.'}`, '#f87171');
        }
    } catch (err) {
        setOAuthStatus(`⚠️ Lỗi: ${err.message || 'Không thể xác thực.'}`, '#f87171');
    } finally {
        if (btn) btn.disabled = false;
    }
}

// 1. Handle Fast OAuth 2.0 Authorization Launch
dom.on('#btnLaunchOAuth', 'click', () => {
    try {
        const redirectUri = chrome.runtime.getURL('dashboard.html');
        const authUrl = `https://txastudio.click/oauth/authorize?client_id=txa_ext_shieldblock_cws_2026&redirect_uri=${encodeURIComponent(redirectUri)}&state=ext_oauth`;
        window.open(authUrl, '_blank');
        setOAuthStatus('Đã mở trang ủy quyền TXA Studio. Hãy xác nhận trên trang web rồi sao chép mã dán vào ô bên dưới nếu trang không tự chuyển hướng.', '#38bdf8');
    } catch (e) {
        window.open('https://txastudio.click/oauth/authorize?client_id=txa_ext_shieldblock_cws_2026', '_blank');
    }
});

// 2. Handle Manual OAuth Code Submission
dom.on('#btnSubmitOAuthCode', 'click', () => {
    const code = qs$('#inputOAuthCode')?.value?.trim();
    if (!code) {
        setOAuthStatus('Vui lòng dán mã ủy quyền (bắt đầu bằng txa_code_)', '#f87171');
        return;
    }
    performOAuthExchange(code);
});

dom.on('#inputOAuthCode', 'keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const code = qs$('#inputOAuthCode')?.value?.trim();
        if (code) performOAuthExchange(code);
    }
});

// 3. Handle Traditional Login
dom.on('#txaLoginForm', 'submit', async (e) => {
    e.preventDefault();
    const email = qs$('#txaInputEmail')?.value?.trim();
    const password = qs$('#txaInputPassword')?.value;
    const btn = qs$('#btnTxaLogin');
    const msg = qs$('#txaLoginMsg');

    if (!email || !password) return;

    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Đang xác thực...';
    }
    if (msg) msg.textContent = '';

    try {
        const res = await sendMessage({
            what: 'txaCloudLogin',
            email,
            password
        });

        if (res?.success) {
            if (msg) {
                msg.style.color = '#4ade80';
                msg.textContent = '✓ Đăng nhập thành công! Đang tải dữ liệu đám mây...';
            }
            setTimeout(() => {
                refreshCloudUI();
                if (msg) msg.textContent = '';
            }, 1000);
        } else {
            if (msg) {
                msg.style.color = '#f87171';
                msg.textContent = `⚠️ ${res?.error || 'Đăng nhập thất bại.'}`;
            }
        }
    } catch (err) {
        if (msg) {
            msg.style.color = '#f87171';
            msg.textContent = `⚠️ Lỗi kết nối: ${err.message || 'Không thể kết nối máy chủ.'}`;
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Đăng nhập TXA Studio ID';
        }
    }
});

// 4. Handle Logout
dom.on('#btnTxaLogout', 'click', async () => {
    await sendMessage({ what: 'txaCloudLogout' });
    refreshCloudUI();
});

// 5. Handle Push Sync
dom.on('#btnTxaPushSync', 'click', async () => {
    const btn = qs$('#btnTxaPushSync');
    const status = qs$('#txaSyncActionStatus');
    if (btn) btn.disabled = true;
    if (status) status.textContent = 'Đang đồng bộ lên máy chủ TXA Studio...';

    try {
        const res = await sendMessage({
            what: 'txaCloudPush',
            payload: {
                device_name: navigator.userAgent.includes('Edg') ? 'Microsoft Edge' : 'Google Chrome',
                stats: { ads_blocked: 1 }
            }
        });

        if (res?.success) {
            if (status) {
                status.style.color = '#4ade80';
                status.textContent = '✓ Đồng bộ lên Cloud thành công!';
            }
            refreshCloudUI();
        } else {
            if (status) {
                status.style.color = '#f87171';
                status.textContent = `⚠️ ${res?.error || 'Đồng bộ thất bại.'}`;
            }
        }
    } catch (err) {
        if (status) {
            status.style.color = '#f87171';
            status.textContent = `⚠️ Lỗi: ${err.message}`;
        }
    } finally {
        if (btn) btn.disabled = false;
        setTimeout(() => {
            if (status) status.textContent = '';
        }, 3000);
    }
});

// 6. Handle Pull Sync
dom.on('#btnTxaPullSync', 'click', async () => {
    const btn = qs$('#btnTxaPullSync');
    const status = qs$('#txaSyncActionStatus');
    if (btn) btn.disabled = true;
    if (status) status.textContent = 'Đang tải thiết lập từ đám mây...';

    try {
        const res = await sendMessage({ what: 'txaCloudPull' });
        if (res?.success) {
            if (status) {
                status.style.color = '#4ade80';
                status.textContent = res.has_data ? '✓ Đã cập nhật thiết lập từ Cloud!' : '✓ Bạn chưa có dữ liệu lưu trên Cloud.';
            }
            refreshCloudUI();
        } else {
            if (status) {
                status.style.color = '#f87171';
                status.textContent = `⚠️ ${res?.error || 'Tải dữ liệu thất bại.'}`;
            }
        }
    } catch (err) {
        if (status) {
            status.style.color = '#f87171';
            status.textContent = `⚠️ Lỗi: ${err.message}`;
        }
    } finally {
        if (btn) btn.disabled = false;
        setTimeout(() => {
            if (status) status.textContent = '';
        }, 3000);
    }
});

// 7. Check if redirected with ?code=txa_code_...
async function checkUrlOAuthCode() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code && code.startsWith('txa_code_')) {
            // Activate txaCloud tab view
            dom.body.dataset.pane = 'txaCloud';
            self.location.hash = 'txaCloud';

            // Clear code from URL address bar for clean presentation
            window.history.replaceState({}, document.title, window.location.pathname + '#txaCloud');

            // Automatically exchange code
            await performOAuthExchange(code);
        }
    } catch (_) {}
}

// Initialize on DOM load
refreshCloudUI();
checkUrlOAuthCode();

// Listen to storage changes (e.g. 1-Click web direct login)
try {
    const storageApi = (typeof chrome !== 'undefined' && chrome.storage)
        ? chrome.storage
        : (typeof browser !== 'undefined' ? browser.storage : null);

    if (storageApi?.onChanged?.addListener) {
        storageApi.onChanged.addListener((changes, areaName) => {
            if (areaName === 'local' && (changes['shieldblock.cloud.user'] || changes['shieldblock.cloud.syncMeta'])) {
                refreshCloudUI();
            }
        });
    }
} catch (_) {}
