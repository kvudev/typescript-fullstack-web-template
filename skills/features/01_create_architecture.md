# Tạo Mermaid file để vẽ kiến trúc hệ thống. 

## Yêu cầu hệ thống
- Hệ thống cần tự động lấy video mới nhất từ YouTube và tạo nội dung dựa trên video đó bằng cách sử dụng Gemini.
- Hệ thống cần lưu thông tin video đã xử lý để tránh xử lý lại video đã xử lý.
- Hệ thống cần hiển thị video mới nhất và nội dung đã tạo dựa trên video đó trên giao diện người dùng.


## Kiến trúc hệ thống sẽ bao gồm các thành phần chính sau:
- Backend:
    - Tạo cron job call api tới youtube để lấy video mới nhất
    - Gọi tới gemini để tạo nội dung mới dựa trên video mới nhất
    - Lưu thông tin video vào database tránh xử lý lại video đã xử lý
- Frontend:
    - Hiển thị video mới nhất và nội dung đã tạo dựa trên video đó
    - Cập nhật giao diện người dùng để hiển thị thông tin mới nhất từ backend
- Database:
    - Lưu trữ thông tin video đã xử lý và nội dung đã tạo để tránh xử lý lại video đã xử lý và hiển thị thông tin mới nhất trên frontend.