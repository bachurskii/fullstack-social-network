import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactFavorite,
} from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
  patchFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import auth from "../helpers/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, getAllContacts);

contactsRouter.get("/:id", auth, getOneContact);

contactsRouter.delete("/:id", auth, deleteContact);

contactsRouter.post(
  "/",
  auth,
  validateBody(createContactSchema),
  createContact,
);

contactsRouter.put(
  "/:id",
  auth,
  validateBody(updateContactSchema),
  updateContact,
);

contactsRouter.patch(
  "/:contactId/favorite",
  auth,
  validateBody(patchFavoriteSchema),
  updateContactFavorite,
);

export default contactsRouter;
