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

// 1. Handle Login
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

// 2. Handle Logout
dom.on('#btnTxaLogout', 'click', async () => {
    await sendMessage({ what: 'txaCloudLogout' });
    refreshCloudUI();
});

// 3. Handle Push Sync
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

// 4. Handle Pull Sync
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

// Initialize on DOM load
refreshCloudUI();
