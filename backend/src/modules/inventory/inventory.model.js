const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Medicine', 'Equipment', 'Consumable'
    stockQuantity: { type: Number, required: true, default: 0 },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number },
    supplier: { type: String },
    expiryDate: { type: Date },
    reorderLevel: { type: Number, default: 10 },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);
