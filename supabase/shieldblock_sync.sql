-- ===============================================================================
-- ShieldBlock Cloud Sync & TXA Studio Integration Migration
-- Project: TXA Studio Central (camnragrlqzmcxtgvukj)
-- ===============================================================================

-- 1. Register ShieldBlock in txa_games catalog
INSERT INTO public.txa_games (
    slug,
    title,
    package_id,
    description,
    short_description,
    developer_name,
    support_email,
    genre,
    privacy_notes,
    is_active
)
VALUES (
    'shieldblock',
    'ShieldBlock - Ad & Tracker Blocker Pro',
    'neajkofkkadimcabbhekjcgdbbkfpfll',
    'High-efficiency Chromium MV3 ad and tracker blocker with Anti-Trap engine, Smart Streaming Player Guard, and TXA Studio Cloud Sync.',
    'Chặn quảng cáo, pop-up bẫy lừa đảo và bảo vệ video player thông minh.',
    'TXA Studio',
    'txasoftdev@gmail.com',
    'Browser Security / Productivity Extension',
    '{}'::jsonb,
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    short_description = EXCLUDED.short_description,
    is_active = true,
    updated_at = now();

-- 2. Create table for ShieldBlock user cloud sync
CREATE TABLE IF NOT EXISTS public.shieldblock_user_sync (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.txa_web_users(id) ON DELETE CASCADE,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    custom_rules JSONB NOT NULL DEFAULT '[]'::jsonb,
    whitelist JSONB NOT NULL DEFAULT '[]'::jsonb,
    stats JSONB NOT NULL DEFAULT '{"ads_blocked": 0, "popups_blocked": 0, "trackers_blocked": 0}'::jsonb,
    device_name TEXT NOT NULL DEFAULT 'Chrome Browser',
    version TEXT NOT NULL DEFAULT '1.1.0',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_shieldblock_user_sync_user UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_shieldblock_user_sync_user_id ON public.shieldblock_user_sync(user_id);

ALTER TABLE public.shieldblock_user_sync ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shieldblock user sync open access" ON public.shieldblock_user_sync;
CREATE POLICY "Shieldblock user sync open access" ON public.shieldblock_user_sync
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 3. Function: Pull user sync data
CREATE OR REPLACE FUNCTION public.shieldblock_sync_pull(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_record RECORD;
BEGIN
    SELECT * INTO v_record
    FROM public.shieldblock_user_sync
    WHERE user_id = p_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', true,
            'has_data', false,
            'message', 'No sync data found for this user.'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'has_data', true,
        'data', jsonb_build_object(
            'settings', v_record.settings,
            'custom_rules', v_record.custom_rules,
            'whitelist', v_record.whitelist,
            'stats', v_record.stats,
            'device_name', v_record.device_name,
            'version', v_record.version,
            'updated_at', v_record.updated_at
        )
    );
END;
$$;

-- 4. Function: Push user sync data
CREATE OR REPLACE FUNCTION public.shieldblock_sync_push(
    p_user_id UUID,
    p_settings JSONB DEFAULT '{}'::jsonb,
    p_custom_rules JSONB DEFAULT '[]'::jsonb,
    p_whitelist JSONB DEFAULT '[]'::jsonb,
    p_stats JSONB DEFAULT '{"ads_blocked": 0, "popups_blocked": 0, "trackers_blocked": 0}'::jsonb,
    p_device_name TEXT DEFAULT 'Chrome Browser',
    p_version TEXT DEFAULT '1.1.0'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_res RECORD;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.txa_web_users WHERE id = p_user_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Tài khoản TXA Studio không tồn tại.');
    END IF;

    INSERT INTO public.shieldblock_user_sync (
        user_id,
        settings,
        custom_rules,
        whitelist,
        stats,
        device_name,
        version,
        updated_at
    )
    VALUES (
        p_user_id,
        COALESCE(p_settings, '{}'::jsonb),
        COALESCE(p_custom_rules, '[]'::jsonb),
        COALESCE(p_whitelist, '[]'::jsonb),
        COALESCE(p_stats, '{"ads_blocked": 0, "popups_blocked": 0, "trackers_blocked": 0}'::jsonb),
        COALESCE(p_device_name, 'Chrome Browser'),
        COALESCE(p_version, '1.1.0'),
        now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        settings = EXCLUDED.settings,
        custom_rules = EXCLUDED.custom_rules,
        whitelist = EXCLUDED.whitelist,
        stats = EXCLUDED.stats,
        device_name = EXCLUDED.device_name,
        version = EXCLUDED.version,
        updated_at = now()
    RETURNING * INTO v_res;

    RETURN jsonb_build_object(
        'success', true,
        'updated_at', v_res.updated_at
    );
END;
$$;

-- 5. Function: Atomic login with TXA Studio ID and retrieve cloud sync profile
CREATE OR REPLACE FUNCTION public.shieldblock_login_and_pull(
    p_email TEXT,
    p_password TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_clean_email TEXT;
    v_user RECORD;
    v_sync RECORD;
BEGIN
    v_clean_email := LOWER(TRIM(p_email));

    SELECT id, email, password_hash, display_name, avatar_url, role, created_at
    INTO v_user
    FROM public.txa_web_users
    WHERE email = v_clean_email;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Tài khoản hoặc mật khẩu TXA Studio không chính xác.');
    END IF;

    IF v_user.password_hash = crypt(p_password, v_user.password_hash) THEN
        SELECT * INTO v_sync
        FROM public.shieldblock_user_sync
        WHERE user_id = v_user.id;

        RETURN jsonb_build_object(
            'success', true,
            'user', jsonb_build_object(
                'id', v_user.id,
                'email', v_user.email,
                'display_name', v_user.display_name,
                'role', v_user.role,
                'avatar_url', v_user.avatar_url,
                'created_at', v_user.created_at
            ),
            'sync_data', CASE 
                WHEN v_sync.id IS NOT NULL THEN jsonb_build_object(
                    'settings', v_sync.settings,
                    'custom_rules', v_sync.custom_rules,
                    'whitelist', v_sync.whitelist,
                    'stats', v_sync.stats,
                    'device_name', v_sync.device_name,
                    'version', v_sync.version,
                    'updated_at', v_sync.updated_at
                )
                ELSE NULL
            END
        );
    ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Tài khoản hoặc mật khẩu TXA Studio không chính xác.');
    END IF;
END;
$$;

-- 6. Register ShieldBlock in txa_oauth_apps catalog
INSERT INTO public.txa_oauth_apps (
    client_id,
    game_slug,
    name,
    app_type,
    app_abbr,
    logo_url,
    redirect_uris,
    privacy_policy_url,
    terms_url,
    delete_account_url,
    created_by_admin,
    status
)
VALUES (
    'txa_ext_shieldblock_cws_2026',
    'shieldblock',
    'ShieldBlock - Ad & Tracker Blocker Pro',
    'extension',
    'shieldblock',
    'https://txastudio.click/icons/icon_128.png',
    ARRAY['https://chromewebstore.google.com/detail/shieldblock-ad-tracker-bl/neajkofkkadimcabbhekjcgdbbkfpfll', 'chrome-extension://neajkofkkadimcabbhekjcgdbbkfpfll/dashboard.html'],
    'https://txastudio.click/privacy?app=shieldblock',
    'https://txastudio.click/terms?app=shieldblock',
    'https://txastudio.click/delete-account?app=shieldblock',
    true,
    'active'
)
ON CONFLICT (client_id) DO UPDATE SET
    name = EXCLUDED.name,
    app_type = EXCLUDED.app_type,
    app_abbr = EXCLUDED.app_abbr,
    logo_url = EXCLUDED.logo_url,
    redirect_uris = EXCLUDED.redirect_uris,
    privacy_policy_url = EXCLUDED.privacy_policy_url,
    terms_url = EXCLUDED.terms_url,
    delete_account_url = EXCLUDED.delete_account_url,
    status = 'active',
    updated_at = now();
