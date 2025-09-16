# iONexus Markdown Processor

Ứng dụng NodeJS để xử lý các file markdown và tạo output HTML/JSON.

## Cài đặt

```bash
# Cài đặt các thư viện cần thiết
npm install
```

## Sử dụng

### Chạy build

```bash
# Chạy script build để tạo output HTML/JSON
npm run build
```

Kết quả sẽ được lưu trong thư mục `build/`:
- `build/html/`: Các file HTML
- `build/json/`: Các file JSON
- `build/index.html`: Trang chủ HTML
- `build/index.json`: Danh sách tất cả các file đã xử lý
- `build/assets/`: Các file CSS và tài nguyên khác

### Cấu trúc dự án

```
ionexus/
├─ src/
│  └─ processor.js        # Module xử lý các file markdown
├─ scripts/
│  └─ build.js            # Script build
├─ index.js               # Entry point
├─ package.json           # Thông tin dự án và dependencies
└─ build/                 # Thư mục output (tạo tự động)
   ├─ html/               # Các file HTML
   ├─ json/               # Các file JSON
   ├─ assets/             # CSS và tài nguyên
   ├─ index.html          # Trang chủ HTML
   └─ index.json          # Danh sách tất cả các file
```

### Tính năng

- Phân tích front matter YAML trong các file markdown
- Chuyển đổi markdown sang HTML
- Trích xuất các section và code block
- Tạo output HTML với CSS đẹp
- Tạo output JSON để sử dụng trong các ứng dụng khác
- Tạo trang index để dễ dàng điều hướng

### Mở rộng

Để thêm tính năng mới, bạn có thể chỉnh sửa các file sau:
- `src/processor.js`: Module xử lý các file markdown
- `scripts/build.js`: Script build
- `index.js`: Entry point

## Xem kết quả

Sau khi chạy build, bạn có thể mở file `build/index.html` trong trình duyệt để xem kết quả.

```bash
# Mở file index.html trong trình duyệt (macOS)
open build/index.html
```

## Cấu trúc file markdown

Các file markdown nên có cấu trúc như sau:

```markdown
---
title: "Tiêu đề trang"
slug: "/đường-dẫn"
page_type: "loại-trang"
brand: "iONexus"
---

# Tiêu đề chính

## Section 1
Nội dung section 1

## Section 2
Nội dung section 2

```

Front matter YAML sẽ được phân tích và sử dụng để tạo metadata cho trang.
