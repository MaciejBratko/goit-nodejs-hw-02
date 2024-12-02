const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Contact = mongoose.model("Contact", contactSchema);

const listContacts = async (userId) => {
  return Contact.find({ owner: userId });
};

const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, owner: userId });
};

const removeContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, owner: userId });
};

const addContact = async (body, userId) => {
  return Contact.create({ ...body, owner: userId });
};

const updateContact = async (contactId, body, userId) => {
  return Contact.findOneAndUpdate({ _id: contactId, owner: userId }, body, {
    new: true,
  });
};

const updateStatusContact = async (contactId, body, userId) => {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { favorite: body.favorite },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
