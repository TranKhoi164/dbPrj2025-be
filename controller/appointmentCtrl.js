const handleExceptions = require("../utils/handleExceptions");
const { lichKham, DonKham, ThanhToan } = require("../model");
const { ThongTinCaNhan } = require('../model');
const { Op } = require('sequelize');
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
      gio,
			benhNhanId,
			bacSiId,
      trangThai: 'cho'
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

const getPatientSchedule = async (req, res) => {
	try {
		const schedules = await lichKham.findAll({
			where: { benhNhanId: req.params.benhNhanId },
			include: [
				{ model: ThongTinCaNhan, as: "benhNhan" },
				{ model: ThongTinCaNhan, as: "bacSi" },
			],
		})
		res.json({
			schedules,
			message: 'Thanh cong!'
		})
	} catch (e) {
		handleExceptions(500, e.message, res)
	}
}

const deleteAppointment = async (req, res) => {
	try {
		const { id } = req.body.lichKham;

		await lichKham.update(
      { trangThai: 'huy' },
      { where: { id: id } }
    );
		res.json({
			message: "Thành công",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getDoctorSchedule = async (req, res) => {
  try {
    const { bacSiId } = req.params;
    const { ngayBatDau, ngayKetThuc } = req.query;

    const whereClause = { bacSiId };

    if (ngayBatDau && ngayKetThuc) {
      whereClause.ngay = {
        [Op.between]: [new Date(ngayBatDau), new Date(ngayKetThuc)]
      };
    } else if (ngayBatDau) {
      whereClause.ngay = {
        [Op.gte]: new Date(ngayBatDau)
      };
    } else {
      // Default to showing appointments from today onwards
      whereClause.ngay = {
        [Op.gte]: new Date()
      };
    }

    const schedule = await lichKham.findAll({
      where: whereClause,
      include: [
        { model: ThongTinCaNhan, as: "benhNhan" },
        { model: ThongTinCaNhan, as: "bacSi" },
      ],
      order: [['ngay', 'ASC'], ['gio', 'ASC']]
    });

    res.json({
      schedule,
      message: "Thành công"
    });
  } catch (e) {
    handleExceptions(500, e.message, res);
  }
};

const markAsBusy = async (req, res) => {
  try {
    const { ngay, gio, bacSiId } = req.body.lichKham;

    // Check if there's already an appointment at this time
    const existingAppointment = await lichKham.findOne({
      where: {
        ngay,
        gio,
        bacSiId,
        trangThai: {
          [Op.ne]: 'huy' // Not cancelled
        }
      }
    });

    if (existingAppointment) {
      return handleExceptions(400, 'Đã có lịch khám vào thời gian này!', res);
    }

    // Create a "busy" appointment
    const busyAppointment = await lichKham.create({
      ngay,
      gio,
      bacSiId,
      trangThai: 'ban'
    });

    res.json({
      lichKham: busyAppointment,
      message: "Đã đánh dấu thời gian bận thành công!"
    });
  } catch (e) {
    handleExceptions(500, e.message, res);
  }
};

const getAppointmentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await lichKham.findOne({
      where: { id },
      include: [
        { model: ThongTinCaNhan, as: "benhNhan" },
        { model: ThongTinCaNhan, as: "bacSi" },
        { model: DonKham, as: "donKham" },
        { model: ThanhToan, as: "thanhToan" }
      ]
    });

    if (!appointment) {
      return handleExceptions(404, 'Không tìm thấy lịch khám!', res);
    }

    res.json({
      appointment,
      message: "Thành công"
    });
  } catch (e) {
    handleExceptions(500, e.message, res);
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { id } = req.body.lichKham;

    // Check if the appointment exists
    const appointment = await lichKham.findOne({
      where: { id },
      include: [
        { model: ThanhToan, as: "thanhToan" }
      ]
    });

    if (!appointment) {
      return handleExceptions(404, 'Không tìm thấy lịch khám!', res);
    }

    // Check if payment is completed
    if (!appointment.thanhToan || !appointment.thanhToan.hoanThanh) {
      return handleExceptions(400, 'Bệnh nhân chưa thanh toán!', res);
    }

    // Update appointment status to completed
    await lichKham.update(
      { trangThai: 'hoanThanh' },
      { where: { id } }
    );

    res.json({
      message: "Đã hoàn thành lịch khám!"
    });
  } catch (e) {
    handleExceptions(500, e.message, res);
  }
};

module.exports = {
	createAppointment,
	deleteAppointment,
  getDoctorSchedule,
  markAsBusy,
  getAppointmentDetails,
  completeAppointment,
	getPatientSchedule
};
