-- Feedback & Device Telemetry System for Extension Uninstallation & Surveys
-- Target: Supabase camnragrlqzmcxtgvukj (TXA Studio Platform)

CREATE TABLE IF NOT EXISTS public.shieldblock_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_slug TEXT NOT NULL DEFAULT 'shieldblock',
    app_name TEXT DEFAULT 'ShieldBlock Pro',
    app_version TEXT DEFAULT '1.1.0',
    reason TEXT NOT NULL,
    details TEXT,
    email TEXT,
    device_info JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.shieldblock_feedbacks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'shieldblock_feedbacks' AND policyname = 'Allow public insert feedbacks'
    ) THEN
        CREATE POLICY "Allow public insert feedbacks" 
        ON public.shieldblock_feedbacks 
        FOR INSERT 
        TO anon, authenticated 
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'shieldblock_feedbacks' AND policyname = 'Allow admin read feedbacks'
    ) THEN
        CREATE POLICY "Allow admin read feedbacks" 
        ON public.shieldblock_feedbacks 
        FOR SELECT 
        TO anon, authenticated 
        USING (true);
    END IF;
END $$;

-- RPC for admin to list feedbacks
CREATE OR REPLACE FUNCTION public.txa_admin_list_feedbacks(
    p_limit INT DEFAULT 50,
    p_offset INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total INT;
    v_items JSONB;
BEGIN
    SELECT count(*) INTO v_total FROM public.shieldblock_feedbacks;

    SELECT COALESCE(jsonb_agg(f), '[]'::jsonb) INTO v_items
    FROM (
        SELECT *
        FROM public.shieldblock_feedbacks
        ORDER BY created_at DESC
        LIMIT p_limit OFFSET p_offset
    ) f;

    RETURN jsonb_build_object(
        'total', v_total,
        'items', v_items
    );
END;
$$;

-- RPC to submit feedback directly
CREATE OR REPLACE FUNCTION public.txa_submit_feedback(
    p_app_slug TEXT,
    p_app_name TEXT,
    p_app_version TEXT,
    p_reason TEXT,
    p_details TEXT,
    p_email TEXT,
    p_device_info JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO public.shieldblock_feedbacks (
        app_slug,
        app_name,
        app_version,
        reason,
        details,
        email,
        device_info
    ) VALUES (
        COALESCE(p_app_slug, 'shieldblock'),
        COALESCE(p_app_name, 'ShieldBlock Pro'),
        COALESCE(p_app_version, '1.1.0'),
        p_reason,
        p_details,
        p_email,
        COALESCE(p_device_info, '{}'::jsonb)
    ) RETURNING id INTO v_id;

    RETURN jsonb_build_object(
        'success', true,
        'id', v_id
    );
END;
$$;
