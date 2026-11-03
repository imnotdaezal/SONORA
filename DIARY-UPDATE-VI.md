# SONORA · Universe → Diary

Bản cập nhật 03/11/2026.

## Cài lên GitHub Pages
1. Xuất bản sao JSON trong SONORA trước khi cập nhật.
2. Giải nén SONORA-Universe-Diary-Update.zip.
3. Tải toàn bộ các tệp bên trong lên thư mục đang chứa index.html của website GitHub Pages, giữ nguyên cấu hình Firebase riêng của bạn nếu đã thay đổi.
4. Commit, đợi GitHub Pages triển khai, rồi tải lại trang (Ctrl+Shift+R trên máy tính).

Đây là bản website đầy đủ; các tệp mới cần có cùng thư mục: memories.js và memories.css. Không chỉ tải index.html. Không cần sửa Firestore Rules cho tính năng Diary hoặc hàng đợi.

## Sử dụng
- Nút Diary thu không gian sao thành bìa sách rồi mở trang nhật ký. Nút đổi thành Universe để quay về.
- Chọn chòm sao hoặc tìm kiếm: danh sách nhật ký lọc theo cùng lựa chọn. Nhật ký xếp ngày mới nhất trước; mục chưa ghi ngày nằm phía sau.
- Nhấn tiêu đề để mở/đóng nội dung. Đọc một mục khác không đổi bài đang nghe. Nhấn Lắng nghe mới đổi bài.
- Nghe những ký ức tạo hàng đợi từ danh sách đang xem. Đổi bộ lọc sau đó không thay hàng đợi đã chọn.
- Thanh phát dưới cùng: phát/tạm dừng, trước/sau, tua, trộn và lặp. Nút lặp luân phiên Tắt → Tất cả → Một mục → Tắt; biểu tượng ¹ chỉ chế độ một mục.
- Playlist YouTube được tính là một mục nhật ký: nghe tới video cuối rồi mới sang mục kế tiếp. Lặp một playlist bắt đầu lại từ video đầu.
- Chọn một ngôi sao trực tiếp từ Universe/sidebar thoát hàng đợi cũ; chọn Nghe những ký ức để tạo lại.
- Chuyển tài khoản xóa hàng đợi trong phiên, tránh lẫn dữ liệu tài khoản.

## Phạm vi và kiểm tra
- EN/VI; màn hình nhỏ 390px; giảm chuyển động theo thiết lập hệ thống.
- Ngân hà tạm ngừng vẽ khi Diary che kín để giảm tải.
- Không thay đổi cấu trúc bản sao hoặc lưu trữ Firebase. Chưa thêm tải ảnh/video lên.
- Đã kiểm tra tương tác giao diện, chuyển chế độ, hàng đợi, bộ lọc, bản dịch, và kiểm thử logic phát tiếp/lặp/playlist với mô phỏng sự kiện.
- Môi trường thử tải được trình phát YouTube và metadata, nhưng luồng video dừng ở buffering; chưa xác nhận nghe hết bài thật và tự chuyển bài trên mạng/thiết bị của người dùng. Nếu bị chặn phát tự động, bấm Play trong khung YouTube. Không cam kết phát nền khi khóa màn hình.

## English quick guide
Switch Diary / Universe to fold the sky into a journal and return. Expand a memory to read without changing playback. Play my memories queues the current filtered list, newest first. The bottom player supports previous/next, seeking, shuffle, and repeat off/all/one. A YouTube playlist counts as one memory. Account changes clear the queue. Upload every file in the ZIP beside your existing GitHub Pages index.html; preserve your Firebase configuration if customized. No Firestore schema change is needed. Photo/video uploads are not included in this update.

## Bản sửa chuyển cảnh
- Universe thu nhỏ tới đúng kích thước bìa; bìa mở để lộ nội dung nhỏ bên trong rồi nội dung phóng lớn.
- Khi đóng, cùng chuyển động chạy theo chiều ngược lại.
- Giữ nguyên chiều cao trên điện thoại, giữ vị trí đọc, khóa bấm lặp trong lúc chuyển cảnh và dọn trạng thái nếu đổi kích thước cửa sổ.
- Tôn trọng chế độ giảm chuyển động của hệ thống.
