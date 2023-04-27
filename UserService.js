const { client } = require('/..config/database');
const { v4: uuid} = require('uuid');
const bcrypt = require('bcrypt');
const { isErrored } = require('stream');

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

    async loginUser (req, res) {
        const {user, password} = req.body;
        try{
            if(!user || !password) res.status(401).send ('Invalid Information');

            let userData;

            const userDataByUsername = await userService.getUserByUsername({user});
            if(userDataByUsername.length === 0) {
                const userDataByEmail = await userService.getUserByEmail({user});
                if(userDataByEmail.length === 0) res.status(401).send('Invalid Infromation');
                userData = userDataByEmail;
            } else {
                userData = userDataByUsername;
            };

            const comparedPassword = await bcrypt.compare(password, userData.password);
            if(!comparedPassword) res.status(401).send('Invalid infromation');
            res.status(200).json({ token: token })
        } catch (err) {
            console.log(err)
        }
    }

    async getUserByUsername({ user }){
        try {
            const userData = await client.query(`SELECT * FROM ${this.table} WHERE username=${user}`)
            return userData.rows[0] || [];
        } catch (err) {
            console.log(err)
        }
    }

    async getUserByEmail({ user }) {
        try{
            const lowerCaseEmail = user.toLowerCase()
            const userData = await client.query(`SELECT * FROM ${this.table} WHERE email='${lowerCaseEmail}`)
            return userData.rows[0] || [];
        } catch (err){
            console.log(err)
        }
    }

    async listUserById(req, res){
        const { bearertoken } = req.headers;
        if (!bearertoken) res.status(401).json({message: 'Request without token'})

        const tokenData = await jwtAuthenticationService.JWTVerify(bearertoken)
        if(tokenData === undefined) res.status(401).json(message: 'Invalid token')

        const userId = tokenData.user;

        try {
            const userData = await userService.getUserById({ userId });
            res.status(200).json ({
                message: 'User Listed',
                user: {
                    id: userData.id,
                    username: userData.username,
                    email: userData.email,
                }
            })
        } catch (err) {
            console.log('listUserById error: ', err)
        }
    }
}