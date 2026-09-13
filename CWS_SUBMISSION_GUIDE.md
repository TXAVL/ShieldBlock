# Hướng dẫn điền thông tin đăng lên Google Chrome Web Store (CWS)

Tài liệu này tổng hợp sẵn các nội dung chuẩn hóa theo chính sách mới nhất của Google Chrome Web Store để bạn copy-paste khi tạo item trên CWS Developer Dashboard.

---

## 1. Tab Store Listing (Thông tin hiển thị trên Cửa hàng)

* **Item Name (Tên tiện ích):**  
  `ShieldBlock - Ad & Tracker Blocker Pro`
* **Short Description (Mô tả ngắn - dưới 132 ký tự):**  
  `An efficient content blocker. Blocks ads, trackers, miners, and more immediately upon installation.`
* **Detailed Description (Mô tả chi tiết):**
```markdown
ShieldBlock Pro is a lightweight, efficient, and privacy-focused content blocker built for Chromium browsers on Manifest V3.

Key Features:
- Native Declarative Filtering: Ultra-fast request blocking powered by Chrome's native Declarative Net Request engine.
- Zero-Delay YouTube Ad Cleaner: Automatically cleans video banners, skippable ads, and anti-adblock notices.
- Comprehensive Protection: Blocks invasive banner ads, video promotions, pop-ups, coin miners, and third-party trackers.
- Memory & Performance Optimized: Designed with an intelligent memory manager that reduces memory consumption during extended browsing sessions.
- In-Player Tools: Quick Element Picker and Element Zapper to remove annoying elements on any page instantly.
- 100% Privacy Focused: No analytics, no telemetry, no external tracking servers. All rules and preferences are evaluated locally on your device.

Open-Source:
ShieldBlock Pro is an independent open-source project licensed under GNU General Public License v3.0.
Source code: https://github.com/TXAVL/ShieldBlock
Privacy Policy: https://github.com/TXAVL/ShieldBlock/blob/main/PRIVACY_POLICY.md
```
* **Category (Danh mục):**  
  `Productivity` (Năng suất) hoặc `Privacy & Security` (Bảo mật và Quyền riêng tư).
* **Language (Ngôn ngữ mặc định):**  
  `English` (Hệ thống sẽ tự động dùng các bản dịch có sẵn trong thư mục `_locales` cho người dùng Việt Nam và các nước khác).

---

## 2. Tab Privacy (Khai báo quyền riêng tư - RẤT QUAN TRỌNG)

### Single Purpose (Mục đích duy nhất):
> `ShieldBlock Pro is a content blocking extension dedicated to blocking unwanted advertisements, network trackers, and malicious pop-ups to protect user privacy and improve page loading performance.`

### Permission Justification (Giải trình lý do xin quyền):
Copy các đoạn giải trình dưới đây vào từng ô tương ứng:

1. **Host Permissions (`<all_urls>`):**  
   > `Required to evaluate network requests across all websites against blocking rulesets, and to inject cosmetic stylesheet rules to remove visual ad place-holders and intrusive floating ads.`

2. **`declarativeNetRequest`:**  
   > `Core mechanism for blocking network requests matching known advertising and tracker filter rules natively via the browser engine.`

3. **`declarativeNetRequestFeedback`:**  
   > `Used in developer mode to inspect matched rule IDs and display diagnostic information in the matched-rules troubleshooting tool.`

4. **`scripting`:**  
   > `Used to inject cosmetic filter CSS and localized scriptlets into webpages to block anti-adblock scripts and power the Element Picker and Zapper tools.`

5. **`activeTab`:**  
   > `Allows user-initiated interaction on the active tab when clicking the extension popup or activating the Element Picker tool.`

6. **`storage` / `unlimitedStorage`:**  
   > `Stores user preferences, enabled filter lists, custom filter text, and compiled rule states locally on the user machine.`

7. **`webNavigation`:**  
   > `Enables the Smart Popup Blocker to detect and block malicious pop-under and tab-redirect behaviors before page navigation occurs.`

8. **`alarms`:**  
   > `Used to schedule background filter list maintenance and cache cleanups without requiring a permanent background page.`

9. **`offscreen`:**  
   > `Compiles imported custom filter lists into declarative format in an isolated sandbox to prevent UI freezing.`

10. **`userScripts`:**  
    > `Allows executing packaged filter scriptlets when enabled by user policy.`

### Data Usage Declarations:
* **Does this extension collect or transmit user data?**  
  $\rightarrow$ Chọn **NO** (Không thu thập bất kỳ dữ liệu cá nhân nào).
* **Privacy Policy URL:**  
  `https://github.com/TXAVL/ShieldBlock/blob/main/PRIVACY_POLICY.md`
* **Certification:**  
  Tích chọn cam kết tuân thủ chính sách Developer Program Policy.
