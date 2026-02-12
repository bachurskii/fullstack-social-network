import Contact from "../models/ContactModels.js";

type ListContactsOption = {
  skip: number;
  limit: number;
  favorite?: boolean;
};

type CreateContactsData = {
  name: string;
  email: string;
  phone: string;
  favorite?: boolean;
  owner?: string;
};

type UpdateContactsData = Partial<Omit<CreateContactsData, "owner">>;

export async function listContacts(
  ownerId: string,
  options: ListContactsOption,
) {
  const { skip, limit, favorite } = options;
  const filter: { owner: string; favorite?: boolean } = { owner: ownerId };
  if (favorite !== undefined) {
    filter.favorite = favorite;
  }
  const list = await Contact.find(filter).skip(skip).limit(limit);
  return list;
}

export async function getContactById(contactId: string, ownerId: string) {
  const contact = await Contact.findOne({ _id: contactId, owner: ownerId });
  return contact;
}

export async function removeContact(contactId: string, ownerId: string) {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    owner: ownerId,
  });
  return contact;
}

export async function addContact(data: CreateContactsData) {
  console.log("addContact received:", data, typeof data);

  const contact = await Contact.create(data);
  return contact;
}

export async function updateContactService(
  contactId: string,
  ownerId: string,
  data: UpdateContactsData,
) {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: ownerId },
    data,
    {
      new: true,
    },
  );
  return contact;
}

export async function updateContactStatus(
  contactId: string,
  ownerId: string,
  favorite: boolean,
) {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, owner: ownerId },

    { favorite },
    {
      new: true,
    },
  );
  return contact;
}
