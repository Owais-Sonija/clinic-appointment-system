const staffService = require('./staff.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class StaffController {
    createStaff = asyncHandler(async (req, res) => {
        const { userId, ...staffData } = req.body;
        const staff = await staffService.createStaff(userId, staffData);
        res.status(201).json(new ApiResponse(201, staff, "Staff record created"));
    });

    getAllStaff = asyncHandler(async (req, res) => {
        const staff = await staffService.getAllStaff();
        res.status(200).json(new ApiResponse(200, staff, "Staff list retrieved"));
    });

    getStaffById = asyncHandler(async (req, res) => {
        const staff = await staffService.getStaffById(req.params.id);
        res.status(200).json(new ApiResponse(200, staff, "Staff retrieved"));
    });

    logAttendance = asyncHandler(async (req, res) => {
        const staff = await staffService.logAttendance(req.params.id, req.body);
        res.status(200).json(new ApiResponse(200, staff, "Attendance logged"));
    });

    updateStatus = asyncHandler(async (req, res) => {
        const staff = await staffService.updateStatus(req.params.id, req.body.status);
        res.status(200).json(new ApiResponse(200, staff, `Staff status updated to ${req.body.status}`));
    });

    deleteStaff = asyncHandler(async (req, res) => {
        await staffService.deleteStaff(req.params.id);
        res.status(200).json(new ApiResponse(200, null, "Staff deactivated successfully"));
    });
}

module.exports = new StaffController();
