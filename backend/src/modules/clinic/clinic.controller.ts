import { Request, Response } from 'express';
import clinicService from './clinic.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class ClinicController {
    // settings
    getSettings = asyncHandler(async (req: Request, res: Response) => {
        const settings = await clinicService.getClinicSettings();
        res.status(200).json(new ApiResponse(200, settings, "Clinic settings fetched"));
    });

    updateSettings = asyncHandler(async (req: Request, res: Response) => {
        const settings = await clinicService.updateClinicSettings(req.body);
        res.status(200).json(new ApiResponse(200, settings, "Clinic settings updated"));
    });

    // services
    getServices = asyncHandler(async (req: Request, res: Response) => {
        const activeOnly = req.query.activeOnly !== 'false'; // default fetch active only
        const services = await clinicService.getAllServices(activeOnly);
        res.status(200).json(new ApiResponse(200, services, "Services retrieved"));
    });

    getServiceById = asyncHandler(async (req: Request, res: Response) => {
        const service = await clinicService.getServiceById((req.params.id as string));
        res.status(200).json(new ApiResponse(200, service, "Service retrieved"));
    });

    createService = asyncHandler(async (req: Request, res: Response) => {
        const service = await clinicService.createService(req.body);
        res.status(201).json(new ApiResponse(201, service, "Service created"));
    });

    updateService = asyncHandler(async (req: Request, res: Response) => {
        const service = await clinicService.updateService((req.params.id as string), req.body);
        res.status(200).json(new ApiResponse(200, service, "Service updated"));
    });

    deleteService = asyncHandler(async (req: Request, res: Response) => {
        await clinicService.deleteService((req.params.id as string));
        res.status(200).json(new ApiResponse(200, null, "Service deactivated"));
    });

    // contact
    submitContact = asyncHandler(async (req: Request, res: Response) => {
        const msg = await clinicService.submitContactMessage(req.body);
        res.status(201).json(new ApiResponse(201, msg, "Message sent successfully"));
    });

    getContacts = asyncHandler(async (req: Request, res: Response) => {
        const msgs = await clinicService.getContactMessages();
        res.status(200).json(new ApiResponse(200, msgs, "Messages retrieved"));
    });

    markContactRead = asyncHandler(async (req: Request, res: Response) => {
        const msg = await clinicService.markMessageAsRead((req.params.id as string));
        res.status(200).json(new ApiResponse(200, msg, "Message marked as read"));
    });
}

export default new ClinicController();
