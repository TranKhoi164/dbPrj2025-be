const handleExceptions = require("../utils/handleExceptions");
const userService = require("../service/userService");

const userRegister = async (req, res) => {
	try {
		console.log(req.body.thongTinCaNhan);
		const userWithDetails = await userService.registerUser(req.body.thongTinCaNhan);

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
		const user = await userService.loginUser(CCCD);

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
		const user = await userService.getUserById(id);

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
		const doctors = await userService.getAllDoctors();

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
