/**
 * ShieldBlock - YouTube Pro Dedicated Content Script
 * Gắn nút khiên vào YouTube player với hiệu ứng sáng/tối đèn theo trạng thái,
 * popup điều khiển nhanh & bộ bỏ qua video ads tức thì (Zero-Delay Ad Skip).
 */

(function () {
  'use strict';

  function isExtensionValid() {
    return typeof chrome !== 'undefined' && Boolean(chrome.runtime && chrome.runtime.id);
  }

  let isProtectionActive = true;
  let skippedCount = 0;
  let ytSettings = {
    enabled: true,
    autoSkip: true,
    bypassEnforcement: true
  };

  // 1. Kiểm tra trạng thái lọc của extension đối với youtube.com
  function syncProtectionStatus() {
    if (!isExtensionValid()) return;

    try {
      chrome.runtime.sendMessage({ what: 'getFilteringMode', hostname: 'youtube.com' }, (response) => {
        if (chrome.runtime.lastError) return;
        // level 0 = MODE_NONE (tắt lọc), level > 0 = đang lọc
        if (typeof response === 'number') {
          isProtectionActive = response > 0 && ytSettings.enabled;
        }
        updateShieldButtonLight();
      });
    } catch (e) {}

    try {
      chrome.storage.local.get(['shieldBlockYtSettings', 'shieldBlockYtSkippedCount'], (data) => {
        if (chrome.runtime.lastError || !data) return;
        if (data.shieldBlockYtSettings) {
          ytSettings = Object.assign(ytSettings, data.shieldBlockYtSettings);
        }
        if (typeof data.shieldBlockYtSkippedCount === 'number') {
          skippedCount = data.shieldBlockYtSkippedCount;
        }
        updateShieldButtonLight();
      });
    } catch (e) {}
  }

  // 2. Cập nhật hiệu ứng đèn SÁNG / TỐI cho Icon Khiên trên player
  function updateShieldButtonLight() {
    const shieldBtn = document.querySelector('.ytp-shieldblock-btn');
    if (!shieldBtn) return;

    const shouldGlow = isProtectionActive && ytSettings.enabled;
    if (shouldGlow) {
      shieldBtn.classList.remove('disabled');
      shieldBtn.title = 'ShieldBlock: Đang bảo vệ (Đèn sáng)';
    } else {
      shieldBtn.classList.add('disabled');
      shieldBtn.title = 'ShieldBlock: Đã tắt / Tạm dừng (Đèn tối)';
    }

    const statusBadge = document.getElementById('ytpSbStatusBadge');
    if (statusBadge) {
      statusBadge.textContent = shouldGlow ? 'BẬT' : 'TẮT';
      statusBadge.className = 'ytp-sb-toggle-btn' + (shouldGlow ? '' : ' off');
    }

    const countEl = document.getElementById('ytpSbCount');
    if (countEl) {
      countEl.textContent = skippedCount + ' ads';
    }
  }

  // 3. Bộ xử lý Video Ads tức thì (Zero-Delay Ad Skip)
  function initInstantYouTubeAdBlocker() {
    let wasAdPlaying = false;

    function processAdSkip() {
      if (!isProtectionActive || !ytSettings.enabled) return;

      const player = document.querySelector('#movie_player, .html5-video-player');
      const video = document.querySelector('video.html5-main-video');

      // Tự động gỡ thông báo chống chặn quảng cáo (Anti-Adblock)
      if (ytSettings.bypassEnforcement) {
        const enforcementElements = document.querySelectorAll(
          'ytd-enforcement-message-view-model, tp-yt-paper-dialog:has(ytd-enforcement-message-view-model), #error-screen:has(ytd-enforcement-message-view-model), yt-playability-error-supported-renderers'
        );
        if (enforcementElements.length > 0) {
          enforcementElements.forEach(el => el.remove());
          const backdrops = document.querySelectorAll('tp-yt-iron-overlay-backdrop');
          backdrops.forEach(b => b.remove());
          if (video && video.paused) {
            video.play().catch(() => {});
          }
        }
      }

      if (!player || !video) return;

      const isAdShowing = player.classList.contains('ad-showing') ||
                          player.classList.contains('ad-interrupting') ||
                          Boolean(player.querySelector('.ytp-ad-player-overlay, .ytp-ad-module > *'));

      if (isAdShowing && ytSettings.autoSkip) {
        if (!wasAdPlaying) {
          wasAdPlaying = true;
          skippedCount += 1;
          if (isExtensionValid()) {
            try {
              chrome.storage.local.set({ shieldBlockYtSkippedCount: skippedCount });
              chrome.runtime.sendMessage({ what: 'recordBlocked', count: 1 });
            } catch (e) {}
          }
          updateShieldButtonLight();
        }

        // Tắt tiếng video ad để không làm phiền
        video.muted = true;

        // Bấm các nút Skip nếu có
        const skipButtons = document.querySelectorAll(
          '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-text, .ytp-ad-overlay-close-button, [id^="skip-button"] button, button.ytp-ad-skip-button-modern'
        );
        skipButtons.forEach(btn => {
          try { btn.click(); } catch (e) {}
        });

        // Tăng tốc phát x16 để lướt qua ad siêu tốc
        try {
          video.playbackRate = 16.0;
        } catch (e) {}

        // Nhảy thẳng tới cuối video ad
        if (Number.isFinite(video.duration) && video.duration > 0 && video.currentTime < video.duration - 0.1) {
          video.currentTime = video.duration - 0.05;
        }
      } else {
        if (wasAdPlaying) {
          wasAdPlaying = false;
          video.muted = false;
          video.playbackRate = 1.0;
        }
      }
    }

    // Quét chu kỳ nhẹ 250ms
    setInterval(processAdSkip, 250);

    window.addEventListener('yt-navigate-finish', () => {
      setTimeout(processAdSkip, 100);
      syncProtectionStatus();
    });
  }

  // 4. Nhúng Nút Icon Khiên ShieldBlock vào YouTube Player
  function injectInPlayerButton() {
    function tryInject() {
      const rightControls = document.querySelector('.ytp-right-controls');
      if (!rightControls) return;

      if (rightControls.querySelector('.ytp-shieldblock-btn')) return;

      const shieldBtn = document.createElement('button');
      shieldBtn.className = 'ytp-button ytp-shieldblock-btn';
      shieldBtn.title = 'ShieldBlock YouTube Pro';
      shieldBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      `;

      const popup = document.createElement('div');
      popup.className = 'ytp-sb-popup';
      popup.innerHTML = `
        <div class="ytp-sb-header">
          <span>🛡️ ShieldBlock Pro</span>
          <span class="ytp-sb-tag">YouTube</span>
        </div>
        <div class="ytp-sb-row">
          <span>Bảo vệ Video Ads:</span>
          <button class="ytp-sb-toggle-btn" id="ytpSbStatusBadge">BẬT</button>
        </div>
        <div class="ytp-sb-row">
          <span>Đã lọc & bỏ qua:</span>
          <strong id="ytpSbCount" style="color: #22c55e;">${skippedCount} ads</strong>
        </div>
        <button class="ytp-sb-btn" id="ytpSkipNowBtn">⏭️ Bỏ qua Ads ngay</button>
      `;

      const player = document.querySelector('#movie_player, .html5-video-player');
      if (player && !player.querySelector('.ytp-sb-popup')) {
        player.appendChild(popup);
      }

      // Sự kiện bấm vào nút khiên mở popup
      shieldBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isShown = popup.classList.contains('show');
        popup.classList.toggle('show', !isShown);
        if (!isShown) {
          updateShieldButtonLight();
        }
      });

      // Bấm ra ngoài để đóng popup
      document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && e.target !== shieldBtn) {
          popup.classList.remove('show');
        }
      });

      // Bấm nút Bỏ qua Ads ngay
      const skipNowBtn = popup.querySelector('#ytpSkipNowBtn');
      if (skipNowBtn) {
        skipNowBtn.addEventListener('click', () => {
          const video = document.querySelector('video.html5-main-video');
          if (video && Number.isFinite(video.duration)) {
            video.currentTime = video.duration;
            skippedCount += 1;
            if (isExtensionValid()) {
              try { chrome.storage.local.set({ shieldBlockYtSkippedCount: skippedCount }); } catch (e) {}
            }
            updateShieldButtonLight();
          }
          popup.classList.remove('show');
        });
      }

      // Bấm nút bật/tắt nhanh bảo vệ YouTube
      const statusBadge = popup.querySelector('#ytpSbStatusBadge');
      if (statusBadge) {
        statusBadge.addEventListener('click', () => {
          ytSettings.enabled = !ytSettings.enabled;
          if (isExtensionValid()) {
            try {
              chrome.storage.local.set({ shieldBlockYtSettings: ytSettings });
            } catch (e) {}
          }
          updateShieldButtonLight();
        });
      }

      rightControls.insertBefore(shieldBtn, rightControls.firstChild);
      updateShieldButtonLight();
    }

    tryInject();

    window.addEventListener('yt-navigate-finish', tryInject);
    window.addEventListener('yt-page-data-updated', tryInject);
    window.addEventListener('spfdone', tryInject);

    setInterval(tryInject, 1000);
  }

  // Lắng nghe lệnh điều khiển từ popup hoặc context menu
  function safeSkipCurrentAd() {
    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    const video = document.querySelector('video');

    if (!player || !video) {
      return { success: false, reason: 'no_player' };
    }

    // KIỂM TRA NGHIÊM NGẶT: Chỉ xử lý nếu ĐÚNG THẬT SỰ là đang phát quảng cáo!
    // Tuyệt đối KHÔNG ĐƯỢC tua nếu đang xem video chính!
    const isAdStrict = (
      player.classList.contains('ad-showing') ||
      player.classList.contains('ad-interrupting') ||
      Boolean(player.querySelector('.ytp-ad-player-overlay, .ytp-ad-text, .ytp-ad-module > *')) ||
      Boolean(document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, button.ytp-ad-skip-button-modern'))
    );

    if (!isAdStrict) {
      // BẢO VỆ TUYỆT ĐỐI: Video chính đang phát -> KHÔNG ĐƯỢC CHẠM VÀO currentTime!
      cleanBannerAds();
      return { success: false, reason: 'no_ad_playing' };
    }

    // Đang phát Ads thật sự: Bấm nút Skip trước
    const skipButtons = document.querySelectorAll(
      '.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-text, .ytp-ad-overlay-close-button, [id^="skip-button"] button, button.ytp-ad-skip-button-modern'
    );
    skipButtons.forEach(btn => {
      try { btn.click(); } catch (e) {}
    });

    // Mute và tua nhanh riêng cho ad
    try {
      video.muted = true;
      video.playbackRate = 16.0;
      if (Number.isFinite(video.duration) && video.duration > 0 && video.currentTime < video.duration - 0.1) {
        video.currentTime = video.duration - 0.05;
      }
    } catch (e) {}

    skippedCount += 1;
    if (isExtensionValid()) {
      try {
        chrome.storage.local.set({ shieldBlockYtSkippedCount: skippedCount });
        chrome.runtime.sendMessage({ what: 'recordBlocked', count: 1 });
      } catch (e) {}
    }
    updateShieldButtonLight();

    return { success: true, reason: 'ad_skipped' };
  }

  // Khởi động
  syncProtectionStatus();
  initInstantYouTubeAdBlocker();
  injectInPlayerButton();

  // Lắng nghe messages từ extension popup hoặc background
  if (isExtensionValid()) {
    try {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'SKIP_YOUTUBE_AD_NOW') {
          const res = safeSkipCurrentAd();
          sendResponse(res);
          return true;
        }
        if (request.action === 'CHECK_YOUTUBE_AD_STATUS') {
          const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
          const isAd = Boolean(
            player && (
              player.classList.contains('ad-showing') ||
              player.classList.contains('ad-interrupting') ||
              player.querySelector('.ytp-ad-player-overlay, .ytp-ad-text') ||
              document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern')
            )
          );
          sendResponse({ isAd });
          return true;
        }
      });

      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && (changes.shieldBlockYtSettings || changes.shieldBlockYtSkippedCount)) {
          syncProtectionStatus();
        }
      });
    } catch (e) {}
  }
})();
