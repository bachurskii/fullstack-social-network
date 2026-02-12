import { addContact, getContactById, listContacts, removeContact, updateContactService, updateContactStatus, } from "../services/contactsService.js";
export const getAllContacts = async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    let favoriteFilter;
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    if (req.query.favorite === undefined) {
        favoriteFilter = undefined;
    }
    else if (req.query.favorite === "true") {
        favoriteFilter = true;
    }
    else if (req.query.favorite === "false") {
        favoriteFilter = false;
    }
    else {
        return res
            .status(400)
            .json({ message: "Favorite must be a true of false" });
    }
    const ownerId = req.user._id;
    const data = await listContacts(ownerId, {
        skip,
        limit,
        favorite: favoriteFilter,
    });
    res.status(200).json(data);
};
export const getOneContact = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const ownerId = req.user._id;
    const data = await getContactById(req.params.id, ownerId);
    if (data === null) {
        return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(data);
};
export const deleteContact = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const ownerId = req.user._id;
    const data = await removeContact(req.params.id, ownerId);
    if (data === null) {
        return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(data);
};
export const createContact = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const { name, email, phone } = req.body;
    const owner = req.user._id;
    const data = await addContact({ name, email, phone, owner });
    res.status(201).json(data);
};
export const updateContact = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const id = req.params.id;
    if (Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "Body must have at least one field" });
    }
    const ownerId = req.user._id;
    const data = await updateContactService(id, ownerId, req.body);
    if (data === null) {
        return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(data);
};
export const updateContactFavorite = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
    }
    const id = req.params.contactId;
    if (Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "Body must have at least one field" });
    }
    const ownerId = req.user._id;
    const data = await updateContactStatus(id, ownerId, req.body);
    if (data === null) {
        return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(data);
};
