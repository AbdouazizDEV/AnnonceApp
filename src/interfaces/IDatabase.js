class IDatabase {
    async create(collection, data) { throw new Error('Method not implemented'); }
    async findById(collection, id) { throw new Error('Method not implemented'); }
    async findAll(collection) { throw new Error('Method not implemented'); }
    async update(collection, id, data) { throw new Error('Method not implemented'); }
    async delete(collection, id) { throw new Error('Method not implemented'); }
}
export default IDatabase;