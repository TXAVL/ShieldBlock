/*******************************************************************************
    ShieldBlock - TXA Studio Cloud Sync Module
    Connects with TXA Studio Central Identity & Cloud Platform (Supabase)
    Copyright (C) 2026-present ShieldBlock & TXA Studio
    SPDX-License-Identifier: GPL-3.0-or-later
*******************************************************************************/

import { localRead, localWrite, localRemove } from './ext.js';

const SUPABASE_URL = 'https://camnragrlqzmcxtgvukj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhbW5yYWdybHF6bWN4dGd2dWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMDgwNjQsImV4cCI6MjA5NjU4NDA2NH0.r28rSVWb5S3oaJnDawOxuO2AB33zcuud0V2pWm7bL2Q';

const STORAGE_KEY_USER = 'txaCloudUser';
const STORAGE_KEY_SYNC_META = 'txaCloudSyncMeta';

async function callRpc(rpcName, params = {}) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${rpcName}`, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(params)
    });
    if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`RPC ${rpcName} failed: ${res.status} - ${errBody}`);
    }
    return await res.json();
}

/**
 * Get current signed-in TXA Studio user
 */
export async function getCloudUser() {
    const user = await localRead(STORAGE_KEY_USER);
    return user || null;
}

/**
 * Get sync metadata (last sync time, status)
 */
export async function getSyncMeta() {
    const meta = await localRead(STORAGE_KEY_SYNC_META);
    return meta || { lastSyncAt: null, lastStatus: 'idle' };
}

/**
 * Login with TXA Studio ID and pull latest cloud backup
 */
export async function loginTXAAccount(email, password) {
    if (!email || !password) {
        return { success: false, error: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' };
    }

    try {
        const result = await callRpc('shieldblock_login_and_pull', {
            p_email: email,
            p_password: password
        });

        if (!result?.success) {
            return {
                success: false,
                error: result?.error || 'Đăng nhập TXA Studio ID thất bại.'
            };
        }

        const user = result.user;
        await localWrite(STORAGE_KEY_USER, user);

        const syncData = result.sync_data;
        const now = new Date().toISOString();

        if (syncData) {
            await localWrite(STORAGE_KEY_SYNC_META, {
                lastSyncAt: now,
                lastStatus: 'synced_from_cloud'
            });
        } else {
            await localWrite(STORAGE_KEY_SYNC_META, {
                lastSyncAt: now,
                lastStatus: 'new_account_ready'
            });
        }

        return {
            success: true,
            user,
            syncData
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || 'Lỗi mạng khi kết nối máy chủ TXA Studio.'
        };
    }
}

/**
 * Logout from TXA Studio
 */
export async function logoutTXAAccount() {
    await localRemove([STORAGE_KEY_USER, STORAGE_KEY_SYNC_META]);
    return { success: true };
}

/**
 * Push local ShieldBlock settings & rules to TXA Studio Cloud
 */
export async function pushCloudSync(payload = {}) {
    const user = await getCloudUser();
    if (!user?.id) {
        return { success: false, error: 'Chưa đăng nhập tài khoản TXA Studio.' };
    }

    try {
        const res = await callRpc('shieldblock_sync_push', {
            p_user_id: user.id,
            p_settings: payload.settings || {},
            p_custom_rules: payload.custom_rules || [],
            p_whitelist: payload.whitelist || [],
            p_stats: payload.stats || {},
            p_device_name: payload.device_name || 'Chrome Browser',
            p_version: '1.1.0'
        });

        if (res?.success) {
            const now = new Date().toISOString();
            await localWrite(STORAGE_KEY_SYNC_META, {
                lastSyncAt: now,
                lastStatus: 'synced_to_cloud'
            });
            return { success: true, updated_at: res.updated_at };
        }

        return { success: false, error: res?.error || 'Không thể đồng bộ dữ liệu.' };
    } catch (err) {
        return { success: false, error: err.message || 'Lỗi mạng khi đồng bộ.' };
    }
}

/**
 * Pull latest ShieldBlock settings & rules from TXA Studio Cloud
 */
export async function pullCloudSync() {
    const user = await getCloudUser();
    if (!user?.id) {
        return { success: false, error: 'Chưa đăng nhập tài khoản TXA Studio.' };
    }

    try {
        const res = await callRpc('shieldblock_sync_pull', {
            p_user_id: user.id
        });

        if (res?.success) {
            if (res.has_data && res.data) {
                const now = new Date().toISOString();
                await localWrite(STORAGE_KEY_SYNC_META, {
                    lastSyncAt: now,
                    lastStatus: 'synced_from_cloud'
                });
                return { success: true, has_data: true, data: res.data };
            }
            return { success: true, has_data: false };
        }

        return { success: false, error: res?.error || 'Không thể lấy dữ liệu đồng bộ.' };
    } catch (err) {
        return { success: false, error: err.message || 'Lỗi mạng khi tải đồng bộ.' };
    }
}

/**
 * Fast OAuth 2.0 Authorization Code Login
 */
export async function exchangeOAuthCode(authCode) {
    if (!authCode || !authCode.startsWith('txa_code_')) {
        return { success: false, error: 'Định dạng mã ủy quyền không hợp lệ (phải bắt đầu bằng txa_code_).' };
    }

    try {
        const result = await callRpc('txa_exchange_oauth_code', {
            p_client_id: 'txa_ext_shieldblock_cws_2026',
            p_auth_code: authCode.trim()
        });

        if (!result?.success || !result?.user) {
            return {
                success: false,
                error: result?.error || 'Mã ủy quyền không hợp lệ hoặc đã hết hạn.'
            };
        }

        const user = result.user;
        await localWrite(STORAGE_KEY_USER, user);

        const now = new Date().toISOString();
        await localWrite(STORAGE_KEY_SYNC_META, {
            lastSyncAt: now,
            lastStatus: 'oauth_authorized'
        });

        // Auto pull cloud sync data if existing
        try {
            await pullCloudSync();
        } catch (_) {}

        return {
            success: true,
            user
        };
    } catch (err) {
        return {
            success: false,
            error: err.message || 'Lỗi mạng khi xác thực mã OAuth.'
        };
    }
}

