-- Database Setup Script for Medical Appointment System
-- Created: 2025-07-05

-- Drop tables if they exist (ignore this if you are creating a new database)
DROP TABLE IF EXISTS thanhtoans;
DROP TABLE IF EXISTS donkhams;
DROP TABLE IF EXISTS lichkhams;
DROP TABLE IF EXISTS bacsis;
DROP TABLE IF EXISTS benhnhans;
DROP TABLE IF EXISTS thongtincanhans;

-- Create thongtincanhans table (personal information)
CREATE TABLE thongtincanhans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    CCCD VARCHAR(12) NOT NULL UNIQUE,
    ten VARCHAR(100) NOT NULL,
    ngaySinh DATE,
    gioiTinh VARCHAR(10),
    sdt VARCHAR(15)
);

-- Create bacsis table (doctors)
CREATE TABLE bacsis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    thongTinCaNhanId INT,
    namKinhNghiem INT,
    caTruc VARCHAR(50),
    FOREIGN KEY (thongTinCaNhanId) REFERENCES thongtincanhans(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create benhnhans table (patients)
CREATE TABLE benhnhans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    thongTinCaNhanId INT,
    diaChi VARCHAR(200),
    FOREIGN KEY (thongTinCaNhanId) REFERENCES thongtincanhans(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create lichkhams table (appointments)
CREATE TABLE lichkhams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    benhNhanId INT,
    bacSiId INT,
    ngay DATE,
    gio VARCHAR(10),
    trangThai ENUM('cho', 'hoanThanh', 'huy', 'ban') DEFAULT 'cho',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (benhNhanId) REFERENCES benhnhans(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (bacSiId) REFERENCES bacsis(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create donkhams table (medical examinations)
CREATE TABLE donkhams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bacSiId INT NOT NULL,
    benhNhanId INT NOT NULL,
    lichKhamId INT,
    benhLy VARCHAR(500),
    mucDoBenh VARCHAR(100),
    dieuTri VARCHAR(500),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bacSiId) REFERENCES bacsis(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (benhNhanId) REFERENCES benhnhans(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (lichKhamId) REFERENCES lichkhams(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create thanhtoans table (payments)
CREATE TABLE thanhtoans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chiPhi FLOAT,
    phuongThucThanhToan VARCHAR(50),
    hoanThanh BOOLEAN DEFAULT FALSE,
    theBhyt VARCHAR(20),
    lichKhamId INT,
    benhNhanId INT,
    FOREIGN KEY (lichKhamId) REFERENCES lichkhams(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (benhNhanId) REFERENCES benhnhans(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert sample data

-- Insert personal information (thongtincanhans)
INSERT INTO thongtincanhans (CCCD, ten, ngaySinh, gioiTinh, sdt) VALUES
('001234567891', 'BS. Nguyễn Văn An', '1980-05-15', 'Nam', '0901234567'),
('001234567892', 'BS. Trần Thị Bình', '1985-08-20', 'Nữ', '0901234568'),
('001234567893', 'BS. Lê Minh Cường', '1978-12-10', 'Nam', '0901234569'),
('001234567894', 'BS. Phạm Thị Dung', '1982-03-25', 'Nữ', '0901234570'),
('001234567895', 'Hoàng Văn Em', '1990-07-08', 'Nam', '0912345678'),
('001234567896', 'Nguyễn Thị Phượng', '1992-11-12', 'Nữ', '0912345679'),
('001234567897', 'Trần Minh Giang', '1988-04-30', 'Nam', '0912345680'),
('001234567898', 'Lê Thị Hạnh', '1995-09-18', 'Nữ', '0912345681'),
('001234567899', 'Phạm Văn Ích', '1987-01-22', 'Nam', '0912345682'),
('001234567900', 'Vũ Thị Khuyên', '1993-06-14', 'Nữ', '0912345683');

-- Insert doctors (bacsis)
INSERT INTO bacsis (thongTinCaNhanId, namKinhNghiem, caTruc) VALUES
(1, 15, 'Sáng'),
(2, 10, 'Chiều'),
(3, 20, 'Tối'),
(4, 12, 'Sáng');

-- Insert patients (benhnhans)
INSERT INTO benhnhans (thongTinCaNhanId, diaChi) VALUES
(5, '123 Đường Lê Lợi, Quận 1, TP.HCM'),
(6, '456 Đường Nguyễn Huệ, Quận 1, TP.HCM'),
(7, '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM'),
(8, '321 Đường Võ Văn Tần, Quận 3, TP.HCM'),
(9, '654 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM'),
(10, '987 Đường Lý Thường Kiệt, Quận 11, TP.HCM');

-- Insert appointments (lichkhams)
INSERT INTO lichkhams (benhNhanId, bacSiId, ngay, gio, trangThai) VALUES
(1, 1, '2025-07-10', '08:00', 'cho'),
(2, 2, '2025-07-10', '14:00', 'cho'),
(3, 3, '2025-07-10', '19:00', 'hoanThanh'),
(4, 4, '2025-07-11', '09:00', 'cho'),
(5, 1, '2025-07-11', '10:00', 'hoanThanh'),
(6, 2, '2025-07-11', '15:00', 'cho'),
(1, 3, '2025-07-12', '20:00', 'ban'),
(2, 4, '2025-07-12', '08:30', 'cho');

-- Insert medical examinations (donkhams)
INSERT INTO donkhams (bacSiId, benhNhanId, lichKhamId, benhLy, mucDoBenh, dieuTri) VALUES
(3, 3, 3, 'Cảm cúm thông thường', 'Nhẹ', 'Thuốc hạ sốt, nghỉ ngơi, uống nhiều nước'),
(1, 5, 5, 'Đau dạ dày', 'Trung bình', 'Thuốc kháng acid, chế độ ăn uống điều độ'),
(2, 2, 2, 'Cao huyết áp', 'Nặng', 'Thuốc hạ huyết áp, theo dõi thường xuyên'),
(4, 4, 4, 'Đau đầu mãn tính', 'Trung bình', 'Thuốc giảm đau, massage, giảm stress');

-- Insert payments (thanhtoans)
INSERT INTO thanhtoans (chiPhi, phuongThucThanhToan, hoanThanh, theBhyt, lichKhamId, benhNhanId) VALUES
(150000, 'Tiền mặt', TRUE, 'HS4320123456789', 3, 3),
(200000, 'Thẻ tín dụng', TRUE, 'HS4320123456790', 5, 5),
(300000, 'Chuyển khoản', FALSE, 'HS4320123456791', 2, 2),
(180000, 'Tiền mặt', FALSE, 'HS4320123456792', 4, 4),
(120000, 'Thẻ ATM', TRUE, 'HS4320123456793', 1, 1),
(250000, 'Chuyển khoản', FALSE, 'HS4320123456794', 6, 6);

-- Show all tables and their data
SELECT 'THÔNG TIN CÁ NHÂN' as 'TABLE_NAME';
SELECT * FROM thongtincanhans;

SELECT 'BÁC SĨ' as 'TABLE_NAME';
SELECT * FROM bacsis;

SELECT 'BỆNH NHÂN' as 'TABLE_NAME';
SELECT * FROM benhnhans;

SELECT 'LỊCH KHÁM' as 'TABLE_NAME';
SELECT * FROM lichkhams;

SELECT 'ĐƠN KHÁM' as 'TABLE_NAME';
SELECT * FROM donkhams;

SELECT 'THANH TOÁN' as 'TABLE_NAME';
SELECT * FROM thanhtoans;

-- Some useful queries for testing
SELECT 'DANH SÁCH BÁC SĨ VỚI THÔNG TIN CÁ NHÂN' as 'QUERY_NAME';
SELECT
    bs.id,
    tt.ten as 'Tên bác sĩ',
    tt.CCCD,
    tt.sdt,
    bs.namKinhNghiem as 'Năm kinh nghiệm',
    bs.caTruc as 'Ca trực'
FROM bacsis bs
JOIN thongtincanhans tt ON bs.thongTinCaNhanId = tt.id;

SELECT 'DANH SÁCH BỆNH NHÂN VỚI THÔNG TIN CÁ NHÂN' as 'QUERY_NAME';
SELECT
    bn.id,
    tt.ten as 'Tên bệnh nhân',
    tt.CCCD,
    tt.sdt,
    bn.diaChi as 'Địa chỉ'
FROM benhnhans bn
JOIN thongtincanhans tt ON bn.thongTinCaNhanId = tt.id;

SELECT 'LỊCH KHÁM CHI TIẾT' as 'QUERY_NAME';
SELECT
    lk.id,
    bn_tt.ten as 'Tên bệnh nhân',
    bs_tt.ten as 'Tên bác sĩ',
    lk.ngay,
    lk.gio,
    lk.trangThai
FROM lichkhams lk
JOIN benhnhans bn ON lk.benhNhanId = bn.id
JOIN thongtincanhans bn_tt ON bn.thongTinCaNhanId = bn_tt.id
JOIN bacsis bs ON lk.bacSiId = bs.id
JOIN thongtincanhans bs_tt ON bs.thongTinCaNhanId = bs_tt.id;
