const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const AnnonceModel = mongoose.model('Annonce', annonceSchema);

class MongoAnnonceRepository extends IAnnonceRepository {
    async create(data) {
        const annonce = new AnnonceModel(data);
        return await annonce.save();
    }

    async findAll() {
        return await AnnonceModel.find();
    }

    async findById(id) {
        return await AnnonceModel.findById(id);
    }

    async update(id, data) {
        return await AnnonceModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await AnnonceModel.findByIdAndDelete(id);
    }
}
