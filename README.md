# SpaceSoul Library

Ứng dụng quản lý thư viện dùng Vue/Vite, Express và MongoDB.

## Chạy bằng Docker

Yêu cầu: Docker Engine/Desktop có Docker Compose v2.

1. Tạo file `.env` ở thư mục gốc:

   ```env
   JWT_SECRET=thay-bang-mot-chuoi-bi-mat-dai-va-ngau-nhien
   WEB_PORT=8080
   ```

2. Build và khởi động toàn bộ hệ thống:

   ```bash
   docker compose up -d --build
   ```

3. Mở `http://localhost:8080`. API được Nginx chuyển tiếp nội bộ từ `/api` sang server Express; MongoDB không được công khai ra Internet.

## Quản lý vận hành

```bash
# Xem trạng thái container
docker compose ps

# Theo dõi log
docker compose logs -f --tail=200

# Khởi động lại riêng API
docker compose restart server

# Cập nhật sau khi lấy mã nguồn mới
docker compose up -d --build

# Dừng hệ thống (dữ liệu vẫn được giữ)
docker compose down
```

Không chạy `docker compose down -v` trên môi trường thật vì lệnh đó xóa volume MongoDB. Sao lưu dữ liệu trước khi nâng cấp lớn:

```bash
docker compose exec mongo mongodump --archive=/data/db/backup.archive --db=spacesoul_library
docker compose cp mongo:/data/db/backup.archive ./backup.archive
```

Để deploy lên VPS, cài Docker, clone repo, tạo `.env`, chạy `docker compose up -d --build`, sau đó đặt reverse proxy HTTPS (Nginx/Caddy/Cloudflare) trước cổng `WEB_PORT`. Chỉ mở cổng 80/443 công khai; không mở cổng MongoDB 27017.

## Luồng yêu cầu trả sách

1. Độc giả bấm **Gửi yêu cầu trả** ở trang sách đang mượn.
2. Phiếu chuyển sang **Chờ nhận lại**; số lượng sách khả dụng chưa thay đổi.
3. Quản trị viên nhận sách thực tế và bấm nút xác nhận ở trang quản lý mượn/trả.
4. Phiếu chuyển sang **Đã trả** và hệ thống cộng lại một bản sách khả dụng.

## Production: backend Docker, frontend Vercel

Kiến trúc khuyến nghị:

```text
Vercel (Vue/Vite) --> https://api.example.com --> Caddy --> Express --> MongoDB
```

### Backend và database trên VPS

Trỏ bản ghi DNS `A` của `api.example.com` tới IP VPS. Trên VPS, clone repo rồi tạo `.env` từ file mẫu:

```bash
cp .env.backend.example .env
nano .env
```

Điền tên miền thật và URL Vercel, sau đó chạy:

```bash
docker compose -f docker-compose.backend.yml up -d --build
docker compose -f docker-compose.backend.yml ps
docker compose -f docker-compose.backend.yml logs -f --tail=200
```

Caddy tự lấy và gia hạn chứng chỉ HTTPS. Firewall VPS chỉ cần mở TCP 22, 80, 443 và UDP 443. MongoDB không được publish port nên chỉ Express truy cập được.

Kiểm tra API:

```bash
curl https://api.example.com/api/health
```

Khi URL Vercel production thay đổi, sửa `CLIENT_ORIGIN` rồi áp dụng lại:

```bash
docker compose -f docker-compose.backend.yml up -d
```

Có thể cho phép nhiều frontend bằng cách phân tách dấu phẩy:

```env
CLIENT_ORIGIN=https://app.example.com,https://your-project.vercel.app
```

### Frontend trên Vercel

Import GitHub repository vào Vercel và đặt:

```text
Root Directory: client
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Thêm biến môi trường cho Production và Preview:

```env
VITE_API_URL=https://api.example.com/api
```

Redeploy frontend sau khi thêm hoặc đổi biến môi trường. File `client/vercel.json` đã cấu hình fallback cho Vue Router.

### Lệnh quản lý backend

```bash
# Cập nhật phiên bản mới
git pull
docker compose -f docker-compose.backend.yml up -d --build

# Xem log API
docker compose -f docker-compose.backend.yml logs -f server

# Khởi động lại API
docker compose -f docker-compose.backend.yml restart server

# Dừng nhưng giữ dữ liệu
docker compose -f docker-compose.backend.yml down
```

Không dùng `down -v` trên production vì tùy chọn `-v` xóa database.

## Miễn phí: backend Docker Render, MongoDB Atlas, frontend Vercel

Đây là cấu hình phù hợp khi không có VPS:

```text
Vercel (Vue/Vite) --> Render Web Service (Docker/Express/Mongoose) --> MongoDB Atlas Free
```

Mongoose là ODM trong mã nguồn Node.js, không phải máy chủ database. Dữ liệu thật được lưu trong MongoDB Atlas.

### 1. Tạo MongoDB Atlas Free

1. Tạo project và cluster loại **Free (M0)**.
2. Trong **Database Access**, tạo database user và mật khẩu mạnh.
3. Trong **Network Access**, thêm `0.0.0.0/0` để Render free có thể kết nối vì địa chỉ outbound không cố định. Không dùng lại mật khẩu Atlas ở nơi khác.
4. Chọn **Connect > Drivers > Node.js** và sao chép connection string.
5. Thay `<password>` và thêm tên database `spacesoul_library`, ví dụ:

   ```text
   mongodb+srv://library_user:PASSWORD@cluster0.example.mongodb.net/spacesoul_library?retryWrites=true&w=majority
   ```

Nếu mật khẩu có ký tự đặc biệt, cần URL-encode mật khẩu hoặc tạo mật khẩu chỉ gồm chữ và số.

### 2. Deploy backend Docker lên Render

File `render.yaml` ở thư mục gốc đã khai báo Web Service Docker miễn phí.

1. Đẩy repo lên GitHub.
2. Trên Render chọn **New > Blueprint** và kết nối repo.
3. Render đọc `render.yaml`; tạo service `spacesoul-library-api`.
4. Nhập secret `MONGO_URI` bằng connection string Atlas.
5. Nhập `CLIENT_ORIGIN` bằng URL frontend Vercel, ví dụ `https://spacesoul-library.vercel.app`.
6. `JWT_SECRET` được Render sinh tự động.
7. Sau khi deploy, kiểm tra `https://spacesoul-library-api.onrender.com/api/health`.

Nếu tạo thủ công thay vì Blueprint, chọn **New > Web Service** với:

```text
Language: Docker
Dockerfile Path: server/Dockerfile
Docker Build Context Directory: server
Health Check Path: /api/health
Instance Type: Free
```

Các biến môi trường Render bắt buộc:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=mot-chuoi-ngau-nhien-rat-dai
CLIENT_ORIGIN=https://your-project.vercel.app
```

### 3. Deploy frontend lên Vercel

Import cùng repo và cấu hình:

```text
Root Directory: client
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Thêm biến môi trường:

```env
VITE_API_URL=https://spacesoul-library-api.onrender.com/api
```

Redeploy Vercel sau khi thay biến môi trường. Nếu URL Vercel production khác giá trị `CLIENT_ORIGIN`, cập nhật biến đó trên Render rồi redeploy backend.

### Lưu ý gói miễn phí

Render free sleep sau thời gian không có request nên lượt truy cập đầu có thể mất khoảng một phút để backend thức dậy. Không lưu database hoặc file upload trong filesystem của container Render; chúng mất khi restart/redeploy. MongoDB Atlas Free dùng để lưu dữ liệu bền vững.
