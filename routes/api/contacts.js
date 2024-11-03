const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const validateBody = require("../../middlewares/validation");
const { contactSchema, updateContactSchema } = require("../../schemas/contact");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", validateBody(contactSchema), async (req, res, next) => {
  try {
    const contact = await addContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    if (result) {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:contactId",
  validateBody(updateContactSchema),
  async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const updatedContact = await updateContact(contactId, req.body);

      if (updatedContact) {
        res.status(200).json(updatedContact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
