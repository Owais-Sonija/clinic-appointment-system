import { Request, Response } from 'express';
import contactService from './contact.service';
import ApiResponse from '../../utils/ApiResponse';
import asyncHandler from '../../utils/asyncHandler';

class ContactController {
    submitForm = asyncHandler(async (req: Request, res: Response) => {
        const contact = await contactService.createContact(req.body);
        res.status(201).json(new ApiResponse(201, contact, "Message sent successfully"));
    });

    getMessages = asyncHandler(async (req: Request, res: Response) => {
        const messages = await contactService.getAllContacts();
        res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
    });

    updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const contact = await contactService.updateStatus(req.params.id as string, req.body.status);
        res.status(200).json(new ApiResponse(200, contact, "Message status updated"));
    });
}

export default new ContactController();
