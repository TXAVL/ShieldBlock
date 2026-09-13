# Privacy Policy for ShieldBlock Pro / Chính sách quyền riêng tư

**Last Updated / Cập nhật lần cuối:** September 13, 2026  
**Developer / Nhà phát triển:** TXAVL / ShieldBlock Team  
**Extension Name:** ShieldBlock - Ad & Tracker Blocker Pro  
**Repository:** [https://github.com/TXAVL/ShieldBlock](https://github.com/TXAVL/ShieldBlock)  
**Public Privacy Policy URL:** `https://github.com/TXAVL/ShieldBlock/blob/main/PRIVACY_POLICY.md`

---

## English Version

### 1. Overview and Core Philosophy
**ShieldBlock Pro** ("ShieldBlock", "we", "our") is an open-source, client-side content blocker and privacy enhancer built for Chromium browsers on Manifest V3. 

Our core privacy principle is simple: **We do not collect, store, track, sell, or transmit any personal data or browsing history.** All filtering logic, rule matching, and cosmetic adjustments execute 100% locally on your device.

### 2. Information We Do NOT Collect
* We do **NOT** collect personal information (such as name, email address, physical address, or phone number).
* We do **NOT** log or transmit your browsing activity, website history, visited URLs, or downloaded content.
* We do **NOT** use telemetry, analytics services, advertising identifiers, or tracking beacons.
* We do **NOT** maintain any external database or analytics servers.

### 3. Data Stored Locally On Your Device
The extension uses standard browser storage APIs (`chrome.storage.local`) exclusively to store your personal configurations locally on your machine:
* Your selected filtering mode (e.g., Basic, Optimal, Strict).
* Your list of enabled filter rulesets.
* Custom user-defined cosmetic filters and rules you write or import.
* Counter statistics (e.g., number of ads blocked locally) displayed in the popup panel.
* Theme preference (dark/light/auto).

This configuration data never leaves your device unless you manually choose to export your settings as a JSON file.

### 4. Permissions Requested and Justifications
ShieldBlock requests only the minimum necessary permissions required to block ads and protect privacy:

| Permission | Justification |
| :--- | :--- |
| `declarativeNetRequest` | Core adblocking functionality. Evaluates network requests against local filter rules to block ads, banners, miners, and trackers natively. |
| `host_permissions` (`<all_urls>`) | Required to inspect network requests on any visited website and inject element-hiding CSS / scriptlets to remove empty spaces left by blocked ads across the web. |
| `scripting` & `activeTab` | Injects localized element-hiding rules, cosmetic styles, and powers user interactive tools (Element Picker & Element Zapper). |
| `storage` & `unlimitedStorage` | Stores user rule preferences, custom whitelist/blacklist rules, and compiled filter rule indexes locally. |
| `webNavigation` | Correlates frame navigations to intelligently block deceptive pop-ups and malicious redirects before they load. |
| `alarms` | Periodically refreshes filter lists in the background without needing a persistent memory-heavy background page. |
| `offscreen` | Compiles large custom or imported filter lists in an isolated sandbox without freezing the browser interface. |

### 5. Third-Party Lists
ShieldBlock incorporates trusted open-source blocklists (e.g., EasyList, EasyPrivacy, uBlock filters). These lists are updated periodically from their official public open-source endpoints. No personal data is sent when fetching filter updates.

### 6. Contact and Security Disclosures
For questions regarding this Privacy Policy, or to report an issue, please visit:
* Issues: [https://github.com/TXAVL/ShieldBlock/issues](https://github.com/TXAVL/ShieldBlock/issues)
* Security Advisories: [https://github.com/TXAVL/ShieldBlock/security](https://github.com/TXAVL/ShieldBlock/security)

---

## Tiếng Việt (Vietnamese Version)

### 1. Tổng quan & Tôn chỉ bảo mật
**ShieldBlock Pro** là tiện ích chặn quảng cáo và bảo vệ quyền riêng tư mã nguồn mở hoạt động hoàn toàn cục bộ trên trình duyệt của bạn theo chuẩn Manifest V3.

Tôn chỉ bảo mật của chúng tôi: **Tuyệt đối không thu thập, không lưu trữ, không theo dõi, không bán và không gửi bất kỳ thông tin cá nhân hay lịch sử duyệt web nào của người dùng về máy chủ ngoài.** Mọi xử lý chặn lọc đều diễn ra 100% trên thiết bị cá nhân của bạn.

### 2. Những thông tin chúng tôi KHÔNG thu thập
* **Không** thu thập thông tin danh tính (họ tên, email, số điện thoại, địa chỉ nhà).
* **Không** ghi lại lịch sử duyệt web, các trang web bạn đã truy cập, hay nội dung bạn tìm kiếm.
* **Không** tích hợp bất kỳ công cụ phân tích (Analytics), đo lường từ xa (Telemetry) hay quảng cáo theo dõi nào.
* **Không** vận hành bất kỳ máy chủ thu thập dữ liệu người dùng nào.

### 3. Dữ liệu lưu trữ cục bộ trên máy tính
Tiện ích sử dụng bộ nhớ cục bộ của trình duyệt (`chrome.storage.local`) để lưu:
* Mức độ bảo vệ bạn đã chọn (Cơ bản, Tối ưu, Nghiêm ngặt).
* Danh sách các bộ lọc bạn bật/tắt.
* Bộ đếm số lượng quảng cáo đã chặn (hiển thị trên giao diện popup).
* Quy tắc chặn tùy chỉnh (nếu bạn tự thêm vào).
* Cài đặt giao diện (Sáng/Tối).

Dữ liệu này luôn nằm trên máy của bạn và không bao giờ được chia sẻ ra ngoài trừ khi bạn chủ động bấm "Xuất tệp cấu hình" (Export).

### 4. Giải trình các quyền hạn hệ thống
| Quyền hạn | Lý do & Mục đích sử dụng |
| :--- | :--- |
| `declarativeNetRequest` | Chặn các request quảng cáo, mã độc và tracker dựa trên danh sách bộ luật một cách tối ưu và an toàn. |
| `host_permissions` (`<all_urls>`) | Cần thiết để áp dụng bộ lọc trên mọi trang web bạn lướt, ẩn khung trắng quảng cáo và chặn video ads. |
| `scripting` & `activeTab` | Chèn scriptlet chặn quảng cáo cục bộ và hỗ trợ tính năng chọn/xóa phần tử (Element Picker/Zapper). |
| `storage` & `unlimitedStorage` | Lưu trữ cấu hình cài đặt và danh sách bộ luật ngoại tuyến trên máy tính. |
| `webNavigation` | Phát hiện và chặn các cửa sổ pop-up lừa đảo, chuyển hướng độc hại trước khi chúng tải. |
| `alarms` | Lên lịch cập nhật danh sách bộ lọc tự động định kỳ mà không tốn RAM chạy nền liên tục. |
| `offscreen` | Biên dịch các danh sách lọc tùy chỉnh ở tiến trình riêng biệt để không làm chậm giao diện duyệt web. |

### 5. Thông tin liên hệ
Mọi thắc mắc hoặc báo cáo liên quan đến chính sách bảo mật, vui lòng mở issue tại:  
👉 [https://github.com/TXAVL/ShieldBlock/issues](https://github.com/TXAVL/ShieldBlock/issues)
