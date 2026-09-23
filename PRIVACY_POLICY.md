# Privacy Policy for ShieldBlock Pro / Chính sách Quyền riêng tư

**Last Updated / Cập nhật lần cuối:** September 23, 2026  
**Version / Phiên bản:** 1.1.1+  
**Developer / Nhà phát triển:** TXAVL / ShieldBlock Team  
**Extension Name:** ShieldBlock - Ad & Tracker Blocker Pro  
**Official Repository:** [https://github.com/TXAVL/ShieldBlock](https://github.com/TXAVL/ShieldBlock)  
**Public Privacy Policy URL:** [https://github.com/TXAVL/ShieldBlock/blob/main/PRIVACY_POLICY.md](https://github.com/TXAVL/ShieldBlock/blob/main/PRIVACY_POLICY.md)  
**Developer / Privacy Contact Email:** `support@txastudio.click` | `contact@txastudio.click`  

---

## English Version

### 1. Overview and Core Philosophy
**ShieldBlock Pro** ("ShieldBlock", "we", "our", or "us") is an open-source, client-side content blocker and privacy enhancer built for Chromium browsers on Manifest V3. 

Our fundamental privacy principle is: **Local-First and Minimal Data.**  
For standard ad-blocking operations, ShieldBlock functions entirely on your local device. We do not track your browsing habits, monitor visited websites, sell personal information, or utilize third-party telemetry and analytics.

---

### 2. User Data Collection and Handling Disclosure
In full compliance with the **Google Chrome Web Store User Data Policy (Prominent Disclosure & Limited Use)**, this section discloses all data collected, processed, and stored by ShieldBlock:

#### A. Standard Content Blocking (Default Operation - No Data Collected)
* **Browsing History & URLs:** We do **NOT** collect, inspect, record, or transmit your browsing activity, website history, visited URLs, downloaded files, or search queries. Rule evaluation happens strictly in-memory using Chromium's native `declarativeNetRequest` engine.
* **Personal Information:** We do **NOT** collect names, physical addresses, telephone numbers, financial details, or device identifiers during ordinary usage.
* **Analytics & Telemetry:** We do **NOT** embed Google Analytics, Mixpanel, Sentry, advertising SDKs, or any user tracking beacons in the extension package.

#### B. Optional Cloud Sync Feature (User-Initiated Only)
ShieldBlock includes an **optional** "TXA Studio Cloud Sync" feature designed solely to allow users to synchronize custom filter rules and settings across multiple browser installations. This feature is **disabled by default** and only activates upon explicit, affirmative user login.

When you voluntarily log into Cloud Sync (via OAuth 2.0 or Email/Password):
1. **Authentication Data:** We collect and securely transmit your email address and an authenticated session token to verify your account identity.
2. **User Preferences & Configurations:** We synchronize your selected filtering modes, enabled filter list identifiers, custom element-hiding cosmetic rules, and user-defined allowlist/blocklist domains.
3. **Exclusions:** Passwords are never stored in plaintext. We never synchronize browsing history, cookies, form data, or visited URLs to the cloud.

#### C. Extension Lifecycle & Feedback URLs
* **Installation & Uninstallation Survey:** Upon installation or uninstallation, ShieldBlock may open a web page hosted on `https://txastudio.click/installed` or `https://txastudio.click/uninstalled`. This URL transmits only non-personally identifiable technical query parameters: the extension version (e.g., `version=1.1.1`) and extension name (`name=ShieldBlock`). No user identity or browsing logs are attached.

---

### 3. Data Processing and Use
All data handled by ShieldBlock is processed strictly for the following purposes:
1. **Ad and Tracker Blocking:** Local rule lists and element cosmetic selectors are executed to remove invasive advertisements, crypto-miners, and tracking scripts from web pages.
2. **Cross-Device Settings Synchronization:** Cloud Sync data is used exclusively to restore user configuration settings across the user's own authorized browser profiles.

#### Limited Use and Non-Sale Affirmation:
* We **NEVER** sell, rent, monetize, or trade any user data to third parties, data brokers, or advertising networks.
* We **NEVER** use or transfer user data for determining creditworthiness or lending purposes.
* We **NEVER** use user data for targeted advertising or user profiling.

---

### 4. Data Storage, Retention, and Security

#### A. Local Storage (`chrome.storage.local`)
* Preferences, active rulesets, blocked-ad counters, and UI themes are stored locally on your machine via Chromium's sandboxed `chrome.storage.local` API.
* This data remains on your device and is automatically erased when you uninstall the extension or clear browser storage.

#### B. Cloud Storage (Supabase Backend)
* Cloud Sync records are stored on secure cloud database infrastructure provided by **Supabase Inc.**, protected by PostgreSQL Row-Level Security (RLS) policies and encrypted in transit via Transport Layer Security (TLS/HTTPS).
* **Data Retention:** Synced settings and account credentials are retained only as long as you maintain an active TXA Studio account.
* **Right to Deletion:** You can delete your Cloud Sync data and account at any time either directly from the extension dashboard or by visiting our automated deletion portal:  
  👉 [https://txastudio.click/delete-account?app=shieldblock](https://txastudio.click/delete-account?app=shieldblock)

---

### 5. Third Parties and Data Sharing
In compliance with the Chrome Web Store policy requiring disclosure of **all parties with whom user data is shared**, we disclose the following third-party infrastructure and service providers:

| Third Party | Purpose of Interaction | Data Shared | Privacy Policy |
| :--- | :--- | :--- | :--- |
| **Supabase, Inc.** | Cloud database and authentication infrastructure provider for the optional Cloud Sync feature. | User email, hashed authentication token, and custom filter configurations (only for logged-in Cloud Sync users). | [Supabase Privacy Policy](https://supabase.com/privacy) |
| **TXA Studio** (`txastudio.click`) | Identity provider for 1-Click OAuth 2.0 authorization, uninstall feedback survey, and account deletion portal. | OAuth authorization codes during login; anonymous extension version/name parameters during install/uninstall. | [TXA Studio Privacy](https://txastudio.click/privacy) |
| **Open-Source Filter List Providers** (GitHub, EasyList, AdGuard) | Distributing public filter list text updates. | Standard HTTP GET requests to fetch static text files. No user identifiers, cookies, or personal data are transmitted. | Public GitHub / CDN policies |

**Under no other circumstances is any user data shared, transferred, or disclosed to any external organization, government entity, or commercial third party.**

---

### 6. Permissions Requested and Technical Justification

ShieldBlock requests only the minimum permissions necessary to perform its content-blocking functions:

| Permission | Justification |
| :--- | :--- |
| `declarativeNetRequest` | Primary ad-blocking engine. Matches incoming network requests against local filter rules to block ads, malicious banners, and trackers natively. |
| `host_permissions` (`<all_urls>`) | Required to inspect web requests across visited websites and inject element-hiding CSS / scriptlets to eliminate empty visual placeholders left by blocked ads. |
| `scripting` & `activeTab` | Injects cosmetic styles and localized scriptlets, and powers user interactive tools (Element Picker & Element Zapper). |
| `storage` & `unlimitedStorage` | Stores user configuration settings, custom rule lists, and compiled filter rule caches locally on the user's device. |
| `webNavigation` | Detects frame navigations to preemptively block deceptive pop-ups and malicious redirects before they load. |
| `alarms` | Periodically schedules filter list updates and memory maintenance in the background without needing a persistent background process. |
| `offscreen` | Compiles large custom or imported filter lists in an isolated sandbox thread to avoid freezing the browser interface. |
| `userScripts` | Executes packaged filter scriptlets when enabled by user policy. |
| `optional_permissions` (`webRequest`, `privacy`) | Optional debugging and privacy protection toggles that can be activated on demand by advanced users. |

---

### 7. Children's Privacy (COPPA)
ShieldBlock does not knowingly collect, solicit, or maintain personal information from children under the age of 13. If you believe a child has provided us with personal information via Cloud Sync, please contact us immediately for account removal.

---

### 8. User Rights and Controls
You retain full control over your data:
* **Export / Backup:** Export all custom filters and configurations at any time as a `.json` backup file from the Dashboard.
* **Erase Local Data:** Reset all settings to factory default directly in the Dashboard Settings tab.
* **Delete Cloud Account:** Erase all cloud-synced records immediately via the extension dashboard or the deletion portal at `https://txastudio.click/delete-account?app=shieldblock`.

---

### 9. Contact Information
If you have questions, feedback, or data privacy requests concerning this Privacy Policy, please contact our team at:
* **Email:** [support@txastudio.click](mailto:support@txastudio.click) or [contact@txastudio.click](mailto:contact@txastudio.click)
* **GitHub Issues:** [https://github.com/TXAVL/ShieldBlock/issues](https://github.com/TXAVL/ShieldBlock/issues)
* **Security Advisories:** [https://github.com/TXAVL/ShieldBlock/security](https://github.com/TXAVL/ShieldBlock/security)

---

## Tiếng Việt (Vietnamese Version)

### 1. Tổng quan & Tôn chỉ bảo mật cốt lõi
**ShieldBlock Pro** ("ShieldBlock", "chúng tôi") là tiện ích mở rộng chặn quảng cáo, bảo vệ quyền riêng tư hoạt động hoàn toàn cục bộ trên trình duyệt Chromium theo tiêu chuẩn Manifest V3.

Tôn chỉ bảo mật cốt lõi: **Ưu tiên xử lý cục bộ và tối giản dữ liệu.**  
Đối với chức năng chặn quảng cáo thông thường, ShieldBlock xử lý 100% trên thiết bị cá nhân của bạn. Chúng tôi không theo dõi lịch sử duyệt web, không ghi lại các trang web bạn truy cập, không bán dữ liệu cá nhân và không cài cắm bất kỳ công cụ phân tích hay đo lường từ xa (telemetry) nào.

---

### 2. Minh bạch về việc Thu thập và Xử lý Dữ liệu Người dùng
Tuân thủ đầy đủ **Chính sách Dữ liệu Người dùng của Chrome Web Store (Yêu cầu Công bố Nổi bật & Sử dụng Giới hạn)**, mục này nêu rõ toàn bộ các loại dữ liệu được thu thập, xử lý và lưu trữ:

#### A. Quá trình Chặn Quảng Cáo Tiêu Chuẩn (Mặc định - Tuyệt đối không thu thập dữ liệu)
* **Lịch sử duyệt web & URL:** Chúng tôi **KHÔNG** thu thập, ghi nhận hay truyền tải lịch sử lướt web, các liên kết đã bấm, nội dung đã tải hay từ khóa tìm kiếm. Việc so khớp bộ lọc diễn ra hoàn toàn trong bộ nhớ máy tính thông qua engine `declarativeNetRequest` gốc của trình duyệt.
* **Thông tin cá nhân:** Chúng tôi **KHÔNG** thu thập họ tên, địa chỉ, số điện thoại, thông tin thanh toán hay mã định danh thiết bị.
* **Không dùng công cụ theo dõi:** Tiện ích hoàn toàn không tích hợp Google Analytics, Mixpanel, Sentry hay bất kỳ SDK quảng cáo nào.

#### B. Tính năng Đồng bộ Đám mây Tuỳ chọn (Chỉ kích hoạt khi Người dùng chủ động đăng nhập)
ShieldBlock cung cấp tính năng **Đồng bộ Đám mây TXA Studio (Cloud Sync)** nhằm giúp người dùng đồng bộ quy tắc chặn tùy chỉnh và thiết lập cá nhân qua nhiều trình duyệt khác nhau. Tính năng này **mặc định tắt** và chỉ hoạt động khi bạn chủ động đăng nhập.

Khi bạn tự nguyện đăng nhập Cloud Sync (qua OAuth 2.0 hoặc Email/Mật khẩu):
1. **Dữ liệu xác thực:** Chúng tôi tiếp nhận và gửi an toàn địa chỉ email cùng mã token phiên đăng nhập đã xác thực để nhận diện tài khoản.
2. **Cấu hình cá nhân:** Chúng tôi đồng bộ chế độ chặn lọc bạn đã chọn, danh sách bộ lọc được bật, quy tắc ẩn phần tử tùy chỉnh và danh sách tên miền cho phép/chặn do bạn tạo.
3. **Phạm vi bảo mật:** Mật khẩu không bao giờ được lưu dưới dạng văn bản thuần (plaintext). Lịch sử duyệt web, cookie hay dữ liệu biểu mẫu KHÔNG BAO GIỜ bị đồng bộ lên đám mây.

#### C. Trang thông báo Vòng đời Tiện ích (Cài đặt / Gỡ cài đặt)
* Khi cài đặt mới hoặc khi gỡ cài đặt, ShieldBlock có thể mở trang phản hồi tại `https://txastudio.click/installed` hoặc `https://txastudio.click/uninstalled`. Đường dẫn này chỉ mang theo tham số kỹ thuật ẩn danh: phiên bản tiện ích (ví dụ `version=1.1.1`) và tên tiện ích (`name=ShieldBlock`) để phục vụ khảo sát lý do gỡ cài đặt. Không có bất kỳ dữ liệu cá nhân hay lịch sử duyệt web nào được gửi kèm.

---

### 3. Xử lý và Mục đích Sử dụng Dữ liệu
Mọi dữ liệu xử lý trong tiện ích chỉ phục vụ duy nhất 2 mục đích kỹ thuật:
1. **Chặn quảng cáo và mã theo dõi:** So khớp và áp dụng bộ lọc để loại bỏ quảng cáo gây phiền toái và bảo vệ trình duyệt.
2. **Đồng bộ thiết lập giữa các thiết bị của chính bạn:** Khôi phục cấu hình cá nhân đã sao lưu lên đám mây khi bạn đăng nhập tài khoản.

#### Cam kết Không Bán Dữ liệu & Sử dụng Đúng Mục đích:
* Chúng tôi **TUYỆT ĐỐI KHÔNG** bán, cho thuê, thương mại hóa hay trao đổi dữ liệu người dùng cho bất kỳ bên thứ ba, nhà môi giới dữ liệu (data brokers) hay mạng lưới quảng cáo nào.
* Chúng tôi **KHÔNG** sử dụng dữ liệu để đánh giá điểm tín nhiệm hay cho vay tài chính.
* Chúng tôi **KHÔNG** sử dụng dữ liệu để tạo hồ sơ hành vi hay hiển thị quảng cáo cá nhân hóa.

---

### 4. Lưu trữ, Thời gian Lưu giữ và Bảo mật Dữ liệu

#### A. Lưu trữ cục bộ trên máy tính (`chrome.storage.local`)
* Danh sách bộ lọc, số lượng quảng cáo đã chặn và giao diện sáng/tối được lưu hoàn toàn trên bộ nhớ trình duyệt của máy tính bạn. Dữ liệu này tự động biến mất khi bạn gỡ bỏ tiện ích.

#### B. Lưu trữ đám mây (Hệ thống máy chủ Supabase)
* Bản sao lưu đồng bộ được lưu trữ trên hạ tầng cơ sở dữ liệu đám mây của **Supabase Inc.**, được bảo vệ bằng chính sách phân quyền cấp hàng (Row Level Security) và mã hóa đường truyền bằng giao thức HTTPS/TLS.
* **Thời gian lưu giữ:** Dữ liệu đám mây chỉ được lưu giữ chừng nào bạn còn duy trì tài khoản TXA Studio.
* **Quyền yêu cầu xóa bỏ:** Bạn có thể xóa toàn bộ dữ liệu đồng bộ và tài khoản bất kỳ lúc nào ngay trên Dashboard tiện ích hoặc tại cổng xóa tài khoản:  
  👉 [https://txastudio.click/delete-account?app=shieldblock](https://txastudio.click/delete-account?app=shieldblock)

---

### 5. Các bên thứ ba và Phạm vi Chia sẻ Dữ liệu
Để đáp ứng yêu cầu của Google Chrome Web Store về việc **tiết lộ toàn bộ các bên có thể được chia sẻ dữ liệu**, chúng tôi công bố danh sách các đối tác hạ tầng kỹ thuật sau:

| Bên thứ ba | Mục đích tương tác | Dữ liệu chia sẻ | Chính sách bảo mật |
| :--- | :--- | :--- | :--- |
| **Supabase, Inc.** | Hạ tầng cơ sở dữ liệu và xác thực cho tính năng Đồng bộ Đám mây. | Email, token xác thực phiên và danh sách cấu hình bộ lọc (chỉ áp dụng với người dùng đăng nhập Cloud Sync). | [Chính sách của Supabase](https://supabase.com/privacy) |
| **TXA Studio** (`txastudio.click`) | Cổng xác thực ủy quyền 1-Click OAuth 2.0, tiếp nhận khảo sát gỡ cài đặt và xử lý yêu cầu xóa tài khoản. | Mã ủy quyền OAuth khi đăng nhập; tham số kỹ thuật phiên bản tiện ích khi gỡ cài đặt. | [Chính sách của TXA Studio](https://txastudio.click/privacy) |
| **Kho bộ lọc mã nguồn mở** (GitHub, EasyList, AdGuard) | Tải bản cập nhật danh sách quy tắc chặn định kỳ. | Các yêu cầu HTTP GET tĩnh để tải tệp văn bản. Không gửi kèm danh tính người dùng hay cookie. | Chính sách GitHub / CDN |

**Ngoài các đối tác hạ tầng kỹ thuật nêu trên, chúng tôi không chia sẻ bất kỳ dữ liệu nào cho bất kỳ tổ chức hay bên thứ ba nào khác.**

---

### 6. Giải trình Mục đích Sử dụng Quyền hạn (Permissions)
| Quyền hạn | Lý do & Mục đích kỹ thuật |
| :--- | :--- |
| `declarativeNetRequest` | Chức năng cốt lõi: Phân tích và chặn các yêu cầu mạng quảng cáo/tracker trực tiếp từ tầng engine trình duyệt. |
| `host_permissions` (`<all_urls>`) | Cần thiết để xóa khung trắng quảng cáo, chèn CSS ẩn phần tử và chặn quảng cáo video trên các trang web bạn truy cập. |
| `scripting` & `activeTab` | Chèn scriptlet chặn quảng cáo cục bộ và cung cấp tính năng nhấp chọn xóa phần tử (Element Picker / Zapper). |
| `storage` & `unlimitedStorage` | Lưu trữ danh sách quy tắc chặn và thiết lập cá nhân ngoại tuyến trên máy tính người dùng. |
| `webNavigation` | Phát hiện chuyển hướng bất thường để chặn pop-up lừa đảo và tab mở tự động độc hại. |
| `alarms` | Lên lịch cập nhật danh sách bộ lọc tự động ở chế độ nền mà không gây tốn RAM. |
| `offscreen` | Biên dịch các bộ lọc tùy chỉnh trong tiến trình độc lập để tránh gây giật/đơ giao diện trình duyệt. |
| `userScripts` | Thực thi các đoạn scriptlet nâng cao được đóng gói sẵn khi người dùng cho phép. |

---

### 7. Quyền của Người dùng đối với Dữ liệu
* **Xuất dữ liệu:** Bạn có thể xuất toàn bộ quy tắc bộ lọc ra tệp JSON bất kỳ lúc nào từ Dashboard.
* **Xóa dữ liệu cục bộ:** Bạn có thể bấm nút cài đặt lại mặc định (Reset) để xóa sạch dữ liệu trên trình duyệt.
* **Xóa tài khoản đám mây:** Bạn có quyền xóa vĩnh viễn tài khoản và bản sao lưu trên đám mây tại `https://txastudio.click/delete-account?app=shieldblock`.

---

### 8. Thông tin Liên hệ Bảo mật
Nếu bạn có bất kỳ câu hỏi, góp ý hay yêu cầu xóa dữ liệu liên quan đến Chính sách Quyền riêng tư này, vui lòng liên hệ:
* **Email hỗ trợ kỹ thuật:** [support@txastudio.click](mailto:support@txastudio.click) hoặc [contact@txastudio.click](mailto:contact@txastudio.click)
* **Báo cáo lỗi qua GitHub:** [https://github.com/TXAVL/ShieldBlock/issues](https://github.com/TXAVL/ShieldBlock/issues)
* **Kênh bảo mật:** [https://github.com/TXAVL/ShieldBlock/security](https://github.com/TXAVL/ShieldBlock/security)
