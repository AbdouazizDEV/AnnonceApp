// BaseModel.js
class BaseModel {
    constructor(data = {}) {
        this.id = data.id || null;
    }
 
    validate() {
        throw new Error('Validate method must be implemented');
    }
 }
 
 export default BaseModel;