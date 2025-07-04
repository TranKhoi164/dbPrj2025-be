const handleExceptions = require("../utils/handleExceptions");
const paymentService = require("../service/paymentService");

const createPayment = async (req, res) => {
	try {
		const findPayment = await paymentService.createPayment(req.body.donKham);

		res.json({
			thanhToan: { ...findPayment.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const updatePayment = async (req, res) => {
	try {
		const updatedPayment = await paymentService.updatePayment(req.body.thanhToan);

		res.json({
			thanhToan: { ...updatedPayment.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getPaymentsByPatient = async (req, res) => {
	try {
		const { benhNhanId } = req.params;
		const payments = await paymentService.getPaymentsByPatient(benhNhanId);

		res.json({
			thanhToans: payments,
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getPaymentByAppointment = async (req, res) => {
	try {
		const { lichKhamId } = req.params;
		const payment = await paymentService.getPaymentByAppointment(lichKhamId);

		res.json({
			thanhToan: payment,
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getPaymentDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const payment = await paymentService.getPaymentById(id);

		res.json({
			thanhToan: payment,
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

module.exports = {
	createPayment,
	updatePayment,
	getPaymentsByPatient,
	getPaymentByAppointment,
	getPaymentDetails,
};
