const handleExceptions = require("../utils/handleExceptions");
const { ThongTinCaNhan } = require("../model/index");
const { BenhNhan } = require("../model/index");
const { BacSi } = require("../model/index");

const userRegister = async (req, res) => {
	try {
		console.log(req.body.thongTinCaNhan);
		const { role } = req.body.thongTinCaNhan;
		let newUser;

		if (role == "bacSi") {
			const { ten, CCCD, ngaySinh, gioiTinh, sdt, namKinhNghiem, caTruc } =
				req.body.thongTinCaNhan;
			newUser = await ThongTinCaNhan.create(
				{
					CCCD: CCCD,
					ten: ten,
					ngaySinh: ngaySinh,
					gioiTinh: gioiTinh,
					sdt: sdt,
					bacSi: {
						namKinhNghiem: namKinhNghiem,
						caTruc: caTruc,
					},
				},
				{
					include: [{ model: BacSi, as: "bacSi" }],
				}
			);
		} else if (role == "benhNhan") {
			const { ten, CCCD, ngaySinh, gioiTinh, sdt, diaChi } = req.body.thongTinCaNhan;
			newUser = await ThongTinCaNhan.create(
				{
					CCCD: CCCD,
					ten: ten,
					ngaySinh: ngaySinh,
					gioiTinh: gioiTinh,
					sdt: sdt,
					benhNhan: {
						diaChi: diaChi,
					},
				},
				{
					include: [{ model: BenhNhan, as: "benhNhan" }],
				}
			);
		}

		const userWithDetails = await ThongTinCaNhan.findOne({
			where: { id: newUser.id },
			include: [
				{ model: BenhNhan, as: "benhNhan" },
				{ model: BacSi, as: "bacSi" },
			],
		});

		res.json({
			thongTinCaNhan: { ...userWithDetails.dataValues },
			message: "Đăng ký thành công!",
		});
	} catch (e) {
		if (e.name == "SequelizeUniqueConstraintError") {
			handleExceptions(500, "Số CCCD đã tồn tại!", res);
			return;
		}
		handleExceptions(500, e.message, res);
	}
};

const userLogin = async (req, res) => {
	try {
		const { CCCD } = req.body.thongTinCaNhan;
		const user = await ThongTinCaNhan.findOne({
			where: { CCCD: CCCD },
			include: [
				{ model: BenhNhan, as: "benhNhan" },
				{ model: BacSi, as: "bacSi" },
			],
		});
		if (!user) {
			handleExceptions(
				500,
				"Không tìm thấy người dùng. Đăng ký hoặc kiểm tra lại thông tin đăng nhập!",
				res
			);
			return;
		}
		res.json({
			user: { ...user.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getUser = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await ThongTinCaNhan.findOne({
			where: { id },
			include: [
				{ model: BenhNhan, as: "benhNhan" },
				{ model: BacSi, as: "bacSi" },
			],
		});
		if (!user) {
			handleExceptions(500, "Người dùng không tồn tại", res);
			return;
		}
		res.json({
			thongTinCaNhan: { ...user.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getDoctors = async (req, res) => {
	try {
		const doctors = await ThongTinCaNhan.findAll({
			include: [
				{
					model: BacSi,
					as: "bacSi",
					required: true, // only include if bacSi exists
				},
			],
		});

		res.json({
			doctors: doctors,
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
}

const userLogout = async (req, res) => {};

module.exports = {
	userRegister: userRegister,
	userLogin: userLogin,
	userLogout: userLogout,
	getUser: getUser,
	getDoctors: getDoctors,
};
