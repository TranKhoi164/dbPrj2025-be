const handleExceptions = require("../utils/handleExceptions");
const { lichKham } = require("../model");
const { ThongTinCaNhan } = require('../model')
// const BenhNhan = require('../model/benhNhan')
// const BacSi = require('../model/bacSi')
const createAppointment = async (req, res) => {
	try {
		const { ngay, gio, benhNhanId, bacSiId } = req.body.lichKham;

		const benhNhan = await ThongTinCaNhan.findByPk(benhNhanId);
		const bacSi = await ThongTinCaNhan.findByPk(bacSiId);

		if (!benhNhan || !bacSi) {
			return handleExceptions(500, 'Không tìm thấy bệnh nhân hoặc bác sĩ!', res);
		}

		const newOrder = await lichKham.create({
			ngay,
      gop,
			benhNhanId,
			bacSiId
		});
		const findOrder = await lichKham.findOne({
			where: { id: newOrder.id },
			include: [
				{ model: ThongTinCaNhan, as: "benhNhan" },
				{ model: ThongTinCaNhan, as: "bacSi" },
			],
		})
		res.json({
			lichKham: { ...findOrder.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const deleteAppointment = async (req, res) => {
	try {
		const { id } = req.body.lichKham;

		await lichKham.destroy({
			where: { id: id },
		});
		res.json({
			message: "Thành công",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

module.exports = {
	createAppointment: createAppointment,
	deleteAppointment: deleteAppointment,
};
