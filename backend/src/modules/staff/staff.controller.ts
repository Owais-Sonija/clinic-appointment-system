import { Request, Response } from 'express';
import staffService from './staff.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class StaffController {
    createProfile = asyncHandler(async (req: Request, res: Response) => {
        const { userId, ...staffData } = req.body;
        const staff = await staffService.createStaffProfile(userId, staffData);
        res.status(201).json(new ApiResponse(201, staff, "Staff profile created"));
    });

    getAllStaff = asyncHandler(async (req: Request, res: Response) => {
        const staffList = await staffService.getAllStaff();
        res.status(200).json(new ApiResponse(200, staffList, "Staff directory fetched"));
    });

    getStaffById = asyncHandler(async (req: Request, res: Response) => {
        const staff = await staffService.getStaffById((req.params.id as string));
        res.status(200).json(new ApiResponse(200, staff, "Staff profile fetched"));
    });

    updateStaff = asyncHandler(async (req: Request, res: Response) => {
        const staff = await staffService.updateStaff((req.params.id as string), req.body);
        res.status(200).json(new ApiResponse(200, staff, "Staff details updated"));
    });

    markAttendance = asyncHandler(async (req: Request, res: Response) => {
        const { status } = req.body;
        const staff = await staffService.markAttendance((req.params.id as string), status);
        res.status(200).json(new ApiResponse(200, staff, "Attendance marked successfully"));
    });
}

export default new StaffController();
