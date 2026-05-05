Dựa trên system_architecutre.md file hãy tạo hệ thống file structure cho project news_summarizer. Hệ thống file structure sẽ bao gồm các thư mục chính sau:
- `backend/`: Chứa mã nguồn cho phần backend của hệ thống, bao gồm các cron job, API calls, và logic xử lý dữ liệu.
- `frontend/`: Chứa mã nguồn cho phần frontend của hệ thống, bao gồm các thành phần giao diện người dùng và logic hiển thị.
- `database/`: Chứa các file liên quan đến cấu trúc và quản lý cơ sở dữ liệu, bao gồm các script tạo bảng và quản lý dữ liệu.
- `architecture/`: Chứa các file liên quan đến kiến trúc hệ thống, bao gồm các sơ đồ và tài liệu mô tả kiến trúc.
- `skills/`: Chứa các file liên quan đến các kỹ năng và tính năng của hệ thống, bao gồm các file mô tả yêu cầu và các file log ghi lại quá trình phát triển.
- `issues/`: Chứa các file liên quan đến các vấn đề và lỗi phát sinh trong quá trình phát triển, bao gồm các file mô tả lỗi và các file log ghi lại quá trình sửa lỗi.
- `tests/`: Chứa các file liên quan đến việc kiểm thử hệ thống, bao gồm các script kiểm thử tự động và các file mô tả kế hoạch kiểm thử.
- `docs/`: Chứa các tài liệu hướng dẫn sử dụng và tài liệu kỹ thuật liên quan đến hệ thống, bao gồm các file hướng dẫn cài đặt và sử dụng hệ thống.
- `config/`: Chứa các file cấu hình cho hệ thống, bao gồm các file cấu hình môi trường và các file cấu hình cho các thành phần của hệ thống.
- `logs/`: Chứa các file log ghi lại quá trình hoạt động của hệ thống, bao gồm các file log cho backend, frontend, và các thành phần khác của hệ thống.
- `scripts/`: Chứa các script hỗ trợ cho quá trình phát triển và triển khai hệ thống, bao gồm các script để chạy cron job, các script để quản lý cơ sở dữ liệu, và các script để triển khai hệ thống.


# Tech Stack:
- Backend: Node.js, Express (cho server), node-cron (cho cron job), axios (cho API calls)
- Frontend: Next.js (cho React framework), Tailwind CSS (cho styling)
- Database: PostgreSQL + Prisma (cho ORM)
- Kiến trúc hệ thống: Mermaid (cho sơ đồ kiến trúc)

## Backend API Feature Folder Structure

Trong `backend/server/api/`, mỗi feature cần có cấu trúc tách biệt để dễ mở rộng và test:

- `backend/server/api/<feature>/src/index.js`: entry router/controller của feature
- `backend/server/api/<feature>/test/`: chứa test cho feature

Ví dụ với feature content:

```text
backend/server/api/
	content/
		src/
			index.js
		test/
```