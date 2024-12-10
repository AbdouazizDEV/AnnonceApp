import MySQLDatabase from '../config/mysql.js';
import FirebaseDatabase from '../config/firebase.js';

class DatabaseFactory {
    static getDatabase(type) {
        switch (type.toLowerCase()) {
            case 'mysql':
                return new MySQLDatabase();
            case 'firebase':
                return new FirebaseDatabase();
            default:
                throw new Error('Database type not supported');
        }
    }
}

export default DatabaseFactory;