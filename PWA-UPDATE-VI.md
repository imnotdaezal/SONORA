# SONORA — bản cập nhật Web App

## Cập nhật GitHub Pages

1. Trên trang đang dùng, chọn **Export collection / Xuất bản sao** để giữ một bản dự phòng. Đợi đồng bộ hoàn tất nếu đang đăng nhập.
2. Giải nén `SONORA-Web-App-Update.zip` trên máy. Đây là bộ website đầy đủ, không phải chỉ một bản vá.
3. Trong repository GitHub đang hosting SONORA, chọn **Add file → Upload files**. Tải toàn bộ nội dung đã giải nén vào đúng thư mục đang chứa `index.html`; giữ nguyên thư mục `icons`. Không tải nguyên file ZIP, không đặt thêm một thư mục bao ngoài.
4. Cho phép ghi đè các file cùng tên và commit. Nếu cậu đã đổi dự án Firebase, giữ lại `firebase-config.js` của riêng cậu. Gói này dùng dự án `sonora-music-diary` như trước.
5. Giữ nguyên Settings → Pages và nhánh/thư mục đã dùng. Chờ lượt triển khai GitHub Pages hoàn tất rồi mở lại địa chỉ hiện tại.
6. Lần sau, nếu SONORA báo có bản mới, tạm dừng nhạc, đóng phần chỉnh sửa, đợi đồng bộ xong rồi chọn **Update & reload**. Nếu chưa hiện, đóng/mở ứng dụng hoặc chuyển sang tab khác rồi quay lại.

Giữ nguyên tên miền và đường dẫn giúp giữ dữ liệu cục bộ cùng phạm vi ứng dụng. Nếu đổi địa chỉ, dữ liệu khách trên trình duyệt không tự đi theo; hãy nhập bản sao hoặc đăng nhập tài khoản đã đồng bộ. Cài web app có thể dùng vùng lưu trữ riêng: nếu chưa thấy nhật ký, đăng nhập cùng tài khoản và đợi đồng bộ, hoặc nhập bản sao. Firebase Authentication vẫn cần đúng hostname trong Authorized domains, không kèm https:// hay đường dẫn.

## Cài trên iPhone / iPad

Mở địa chỉ GitHub Pages bằng **Safari → Chia sẻ → Thêm vào Màn hình chính**. Bật **Mở dưới dạng ứng dụng web** nếu có, rồi chọn **Thêm**. Từ đó mở SONORA qua biểu tượng riêng trên màn hình chính. Không cần App Store, APK hay tài khoản ChatGPT.

## Cài trên Android

Mở địa chỉ bằng **Chrome → menu ⋮ → Cài đặt ứng dụng / Thêm vào màn hình chính**. Có thể dùng nút **Install SONORA / Cài SONORA** trong trang; nút cài trực tiếp chỉ xuất hiện khi trình duyệt hỗ trợ và cho phép.

Đây là web app cài lên màn hình chính (PWA), không phải file APK hay ứng dụng iOS trên App Store.

## Những điểm mới

- **Tốc độ chuyển cảnh:** Account → Diary transition, chọn Quick 1,4 giây / Gentle 2,4 giây / Slow 3,2 giây. Mặc định Gentle. Tôn trọng cài đặt giảm chuyển động của thiết bị.
- **Sắp xếp Diary:** ở góc trên, chọn ngày ký ức hoặc ngày thêm; mới nhất/cũ nhất. Các nhật ký cũ không có ngày thêm giữ thứ tự tương đối ở cuối danh sách; không gán ngày giả.
- **Spotify:** Add a star chấp nhận link đầy đủ của từng bài `https://open.spotify.com/track/...`, kể cả link có `intl-vi`. Nhập tên bài và ký ức rồi lưu. Không nhập cả playlist Spotify trong bản này.
- **Âm lượng:** thanh âm lượng và tắt tiếng trong thanh Play my memories trên máy tính dành cho YouTube. Với điện thoại hoặc Spotify, dùng âm lượng thiết bị. Spotify có trình điều khiển riêng; phần nhạc được phát có thể chỉ là nghe thử.
- **Web app:** icon SONORA, cửa sổ riêng, hướng dẫn cài đặt, trạng thái mất mạng và thông báo cập nhật.
- **Play my memories:** tiếp tục dùng danh sách đang lọc và sắp xếp; có bài trước/sau, phát/tạm dừng, trộn và lặp. Khi nền tảng chặn tự phát, bấm Play trong trình phát chính thức. Chuyển bài tự động Spotify phụ thuộc sự kiện hoàn tất từ trình phát; luôn có nút chuyển bài thủ công.

Chưa thêm ảnh/video tải lên và chưa thêm tính năng nhập cả playlist thành nhiều nhật ký. Tính năng YouTube playlist cũ vẫn được giữ.

## Offline và tài khoản

Sau lần mở online thành công, giao diện và nhật ký khách đã lưu cục bộ có thể mở khi mất mạng. Nhạc, đăng nhập và đồng bộ vẫn cần internet. Không tải nhạc về, không bảo đảm phát khi khóa màn hình hoặc chạy nền. Không lưu phản hồi tài khoản/Firestore vào cache của web app.

Bản cập nhật giữ đăng nhập Firebase và đồng bộ hiện có, không tự thay đổi Firestore Rules. Nếu đã cấu hình đồng bộ thì không cần triển khai lại rules. `SYNC-SETUP-VI.md` và `firestore.rules` được kèm để tham khảo khi cần thiết lập lần đầu.

## Kiểm tra sau khi tải lên

- Mở Diary và trở về Universe; thử tốc độ ở Account.
- Thêm hai ký ức có ngày khác nhau, thử cả bốn cách sắp xếp.
- Thêm một bài YouTube và một bài Spotify công khai, thử phát/tạm dừng/chuyển bài. Nội dung có thể bị hạn chế theo bài, tài khoản, khu vực hoặc trình duyệt.
- Đăng nhập cùng tài khoản trên hai thiết bị và xác nhận một ký ức thử đồng bộ.
- Cài trên màn hình chính, đóng rồi mở lại, kiểm tra đăng nhập và dữ liệu.

Mã và luồng giao diện đã được kiểm tra tự động và trên trình duyệt desktop. Chưa kiểm thử cài đặt/đăng nhập trên iPhone thật; môi trường kiểm tra không xác nhận được âm thanh thực tế từ mọi trình phát bên ngoài. Cần thử các bước trên bằng điện thoại của cậu.

## English quick start

Back up your collection, unzip the package, and upload all files beside the existing `index.html` in your GitHub Pages repository. Preserve the `icons` folder and your Firebase configuration if customized. Commit and wait for Pages deployment.

On iOS, open your Pages URL in Safari → Share → Add to Home Screen → Open as Web App if offered → Add. On Android, use Chrome's Install app / Add to Home screen menu. This is an installable web app, not an APK or App Store package.

Choose transition speed under Account, sort in Diary, and add individual full Spotify track links. Desktop YouTube volume is in the memories player; use device volume for mobile and Spotify. Playback depends on the provider, and Spotify may offer only previews. Internet is required for music, sign-in and cloud sync. Offline support covers the app shell and locally saved guest diary after an initial online visit. Background playback and offline music are not enabled.
