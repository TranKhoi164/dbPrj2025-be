# Hospital Management System Backend

## Mô tả
Hệ thống quản lý bệnh viện backend được xây dựng bằng Node.js, Express và Sequelize MySQL.

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình cơ sở dữ liệu
- Sao chép file `.env.example` thành `.env`
- Cập nhật thông tin kết nối database trong file `.env`

### 3. Chạy migration để tạo bảng
```bash
node migrate.js
```

### 4. Khởi chạy server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy trên: http://localhost:5000

## Cấu trúc dự án

```
dbPrj2025-be/
├── controller/          # Controllers xử lý request/response
├── model/              # Database models (Sequelize)
├── repository/         # Data access layer
├── service/           # Business logic layer
├── routes/            # API routes
├── utils/             # Utility functions
├── public/            # Static files (Frontend)
├── migrate.js         # Database migration script
└── index.js          # Entry point
```

## API Endpoints

### Users
- `POST /api/patients` - Đăng ký bệnh nhân
- `POST /api/doctors` - Đăng ký bác sĩ
- `POST /api/patients/login` - Đăng nhập
- `GET /api/patients/:id` - Lấy thông tin người dùng
- `GET /api/doctors` - Lấy danh sách bác sĩ

### Appointments
- `POST /api/appointments` - Tạo lịch khám
- `GET /api/appointments` - Lấy danh sách lịch khám
- `PUT /api/appointments/:id` - Cập nhật lịch khám
- `DELETE /api/appointments/:id` - Xóa lịch khám

### Examinations
- `POST /api/examinations` - Tạo đơn khám
- `GET /api/examinations` - Lấy danh sách đơn khám
- `PUT /api/examinations/:id` - Cập nhật đơn khám

### Payments
- `POST /api/payments` - Tạo thanh toán
- `GET /api/payments` - Lấy danh sách thanh toán
- `PUT /api/payments/:id` - Cập nhật thanh toán

## Thứ tự sync database
1. thongtincanhan
2. bacsi
3. benhnhan
4. lichkham
5. donkham
6. thanhtoan

## Công nghệ sử dụng
- Node.js
- Express.js
- Sequelize ORM
- MySQL
