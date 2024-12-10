class Categorie extends BaseModel {
    constructor(data = {}) {
        super(data);
        this.designation = data.designation || '';
    }

    validate() {
        if (!this.designation) {
            throw new Error('Designation requise');
        }
    }
}