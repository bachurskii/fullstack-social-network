import Contact from "../models/ContactModels.js";
export async function listContacts(ownerId, options) {
    const { skip, limit, favorite } = options;
    const filter = { owner: ownerId };
    if (favorite !== undefined) {
        filter.favorite = favorite;
    }
    const list = await Contact.find(filter).skip(skip).limit(limit);
    return list;
}
export async function getContactById(contactId, ownerId) {
    const contact = await Contact.findOne({ _id: contactId, owner: ownerId });
    return contact;
}
export async function removeContact(contactId, ownerId) {
    const contact = await Contact.findOneAndDelete({
        _id: contactId,
        owner: ownerId,
    });
    return contact;
}
export async function addContact(data) {
    console.log("addContact received:", data, typeof data);
    const contact = await Contact.create(data);
    return contact;
}
export async function updateContactService(contactId, ownerId, data) {
    const contact = await Contact.findOneAndUpdate({ _id: contactId, owner: ownerId }, data, {
        new: true,
    });
    return contact;
}
export async function updateContactStatus(contactId, ownerId, favorite) {
    const contact = await Contact.findOneAndUpdate({ _id: contactId, owner: ownerId }, { favorite }, {
        new: true,
    });
    return contact;
}
