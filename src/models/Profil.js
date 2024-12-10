export { User, Annonce, Categorie, Profil };

class Profil extends BaseModel {
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

module.exports = {
    User,
    Annonce,
    Categorie,
    Profil
};