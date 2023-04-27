const { client } = require('/..config/database');
const { v4: uuid} = require('uuid');
const bcrypt = require('bcrypt');

class userService {
    constructor(){
        this.table = 'users',
        this.field = 'id, username, password, email'
    }

    async createUser({ user }){
        const { username, password, email, fullName} = user
        try {
            const id = uuid();
            const encriptedPassword = await bcrypt.hash(password, 10);
            const lowerCaseEmail = email.toLowerCase();
            const UserCreated = await client.query(
                `INSERT INFO ${this.table}(${this.fields}) VALUES (
                    '${id}',
                    '${username}',
                    '${encriptedPassword}',
                    '${lowerCaseEmail}'
                )`
            )
            return UserCreated.rowCount;
        }catch (err) {
            console.log(err);
        }
    }
}