const handleExceptions = require("../utils/handleExceptions");
const examinationService = require("../service/examinationService");

const createExamination = async (req, res) => {
	try {
		const findExamination = await examinationService.createExamination(req.body.donKham);

		res.json({
			donKham: { ...findExamination.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const updateExamination = async (req, res) => {
	try {
		const updatedExamination = await examinationService.updateExamination(req.body.donKham);

		res.json({
			donKham: { ...updatedExamination.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getExaminationsByPatient = async (req, res) => {
	try {
		const { benhNhanId } = req.params;
		const examinations = await examinationService.getExaminationsByPatient(benhNhanId);

		res.json({
			donKhams: examinations,
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getExaminationsByDoctor = async (req, res) => {
	try {
		const { bacSiId } = req.params;
		const examinations = await examinationService.getExaminationsByDoctor(bacSiId);

		res.json({
			donKhams: examinations,
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const getExaminationDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const examination = await examinationService.getExaminationById(id);

		res.json({
			donKham: examination,
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

module.exports = {
	createExamination,
	updateExamination,
	getExaminationsByPatient,
	getExaminationsByDoctor,
	getExaminationDetails,
};
