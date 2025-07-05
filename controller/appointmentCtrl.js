const handleExceptions = require("../utils/handleExceptions");
const appointmentService = require("../service/appointmentService");

const createAppointment = async (req, res) => {
	try {
		const findOrder = await appointmentService.createAppointment(req.body.lichKham);

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
		const schedules = await appointmentService.getPatientSchedule(req.params.benhNhanId);

		res.json({
			schedules,
			message: 'Thanh cong!'
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
}

const deleteAppointment = async (req, res) => {
	try {
		const { id } = req.body.lichKham;
		await appointmentService.cancelAppointment(id);

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

		const schedule = await appointmentService.getDoctorSchedule(bacSiId, ngayBatDau, ngayKetThuc);

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
		const appointment = await appointmentService.markAsBusy(req.body.lichKham);

		res.json({
			lichKham: { ...appointment.dataValues },
			message: "Thành công!"
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getAppointmentDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const appointment = await appointmentService.getAppointmentById(id);

		res.json({
			lichKham: appointment,
			message: "Thành công!"
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const completeAppointment = async (req, res) => {
	try {
		const { id } = req.body.lichKham;
		await appointmentService.completeAppointment(id);

		res.json({
			message: "Hoàn thành lịch khám thành công!"
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

module.exports = {
	createAppointment,
	getPatientSchedule,
	deleteAppointment,
	getDoctorSchedule,
	markAsBusy,
	getAppointmentDetails,
	completeAppointment,
};
