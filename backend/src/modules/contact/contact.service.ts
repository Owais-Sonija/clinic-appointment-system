import Contact, { IContact } from './contact.model';

class ContactService {
    async createContact(data: Partial<IContact>) {
        return await Contact.create(data);
    }

    async getAllContacts() {
        return await Contact.find().sort({ createdAt: -1 });
    }

    async updateStatus(id: string, status: string) {
        return await Contact.findByIdAndUpdate(id, { status }, { new: true });
    }
}

export default new ContactService();
