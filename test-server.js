// Simple test server to verify API endpoints work
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = 3000

// Enable CORS
app.use(cors())
app.use(express.json())

// Serve static files
app.use(express.static(path.join(__dirname, 'public')))

// Test routes with mock data
app.get('/api/patients', (req, res) => {
  res.json({
    benhNhans: [
      {
        id: 1,
        thongTinCaNhan: {
          hoTen: "Nguyễn Văn A",
          ngaySinh: "1990-01-01",
          gioiTinh: "Nam",
          soDienThoai: "0123456789"
        },
        diaChi: "123 Đường ABC, Hà Nội"
      },
      {
        id: 2,
        thongTinCaNhan: {
          hoTen: "Trần Thị B",
          ngaySinh: "1985-05-15",
          gioiTinh: "Nữ",
          soDienThoai: "0987654321"
        },
        diaChi: "456 Đường XYZ, TP.HCM"
      }
    ],
    message: "Thành công!"
  })
})

app.get('/api/doctors', (req, res) => {
  res.json({
    bacSis: [
      {
        id: 1,
        thongTinCaNhan: {
          hoTen: "BS. Nguyễn Văn C",
          gioiTinh: "Nam",
          soDienThoai: "0111222333"
        },
        chuyenKhoa: "Tim mạch"
      },
      {
        id: 2,
        thongTinCaNhan: {
          hoTen: "BS. Lê Thị D",
          gioiTinh: "Nữ",
          soDienThoai: "0444555666"
        },
        chuyenKhoa: "Nhi khoa"
      }
    ],
    message: "Thành công!"
  })
})

app.get('/api/appointments', (req, res) => {
  res.json({
    lichKhams: [
      {
        id: 1,
        benhNhan: {
          thongTinCaNhan: {
            hoTen: "Nguyễn Văn A"
          }
        },
        bacSi: {
          thongTinCaNhan: {
            hoTen: "BS. Nguyễn Văn C"
          }
        },
        ngayKham: "2025-01-15",
        gioKham: "09:00",
        trangThai: "pending"
      }
    ],
    message: "Thành công!"
  })
})

app.get('/api/payments', (req, res) => {
  res.json({
    thanhToans: [
      {
        id: 1,
        benhNhan: {
          thongTinCaNhan: {
            hoTen: "Nguyễn Văn A"
          }
        },
        chiPhi: 500000,
        phuongThucThanhToan: "Tiền mặt",
        theBhyt: "GD-123456789",
        hoanThanh: true
      }
    ],
    message: "Thành công!"
  })
})

app.get('/api/examinations', (req, res) => {
  res.json({
    donKhams: [
      {
        id: 1,
        lichKham: {
          benhNhan: {
            thongTinCaNhan: {
              hoTen: "Nguyễn Văn A"
            }
          },
          bacSi: {
            thongTinCaNhan: {
              hoTen: "BS. Nguyễn Văn C"
            }
          }
        },
        chanDoan: "Cảm cúm thông thường",
        donThuoc: "Paracetamol 500mg x 2 viên/ngày",
        createdAt: "2025-01-15T10:30:00Z"
      }
    ],
    message: "Thành công!"
  })
})

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📱 Frontend available at: http://localhost:${PORT}`)
  console.log(`🔗 API endpoints working at: http://localhost:${PORT}/api/`)
})
