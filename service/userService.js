const userRepository = require("../repository/userRepository");
const { sequelize } = require("../databaseConnection");

class UserService {
    async registerUser(thongTinCaNhan) {
        const { role } = thongTinCaNhan;
        let newUser;

        if (role === "bacSi") {
            const { ten, CCCD, ngaySinh, gioiTinh, sdt, namKinhNghiem, caTruc } = thongTinCaNhan;
            newUser = await userRepository.createUser(
                {
                    CCCD,
                    ten,
                    ngaySinh,
                    gioiTinh,
                    sdt,
                    bacSi: {
                        namKinhNghiem,
                        caTruc,
                    },
                },
                [{ as: "bacSi" }]
            );
        } else if (role === "benhNhan") {
            const { ten, CCCD, ngaySinh, gioiTinh, sdt, diaChi } = thongTinCaNhan;
            newUser = await userRepository.createUser(
                {
                    CCCD,
                    ten,
                    ngaySinh,
                    gioiTinh,
                    sdt,
                    benhNhan: {
                        diaChi,
                    },
                },
                [{ as: "benhNhan" }]
            );
        }

        return await userRepository.findUserById(newUser.id);
    }

    async loginUser(CCCD) {
        const user = await userRepository.findUserByCCCD(CCCD);
        if (!user) {
            throw new Error("Không tìm thấy người dùng. Đăng ký hoặc kiểm tra lại thông tin đăng nhập!");
        }
        return user;
    }

    async getUserById(id) {
        const user = await userRepository.findUserById(id);
        if (!user) {
            throw new Error("Người dùng không tồn tại");
        }
        return user;
    }

    async getAllPatients() {
        try {
            return await userRepository.getAllPatients();
        } catch (error) {
            throw new Error("Service error: " + error.message);
        }
    }

    async getPatientById(id) {
        try {
            return await userRepository.getPatientById(id);
        } catch (error) {
            throw new Error("Service error: " + error.message);
        }
    }

    async createPatient(patientData) {
        try {
            return await userRepository.createPatient(patientData);
        } catch (error) {
            throw new Error("Service error: " + error.message);
        }
    }

    async updatePatient(id, patientData) {
        try {
            return await userRepository.updatePatient(id, patientData);
        } catch (error) {
            throw new Error("Service error: " + error.message);
        }
    }

    async deletePatient(id) {
        try {
            return await userRepository.deletePatient(id);
        } catch (error) {
            throw new Error("Service error: " + error.message);
        }
    }

    async getAllDoctors() {
        try {
            return await userRepository.getAllDoctors();
        } catch (error) {
            throw new Error("Service error: " + error.message);
        }
    }

    async getDoctorById(id) {
        try {
            return await userRepository.getDoctorById(id);
        } catch (error) {
            throw new Error("Service error: " + error.message);
        }
    }
}

module.exports = new UserService();
