class UserController{
    async createUser(req, res){
        const {body: user} = req;
        try{
            const createdUser = await userService.createUser({ user });
            res.status(201).json({
                message: 'User Created',
                user: createdUser
            });
        } catch (err) {
            console.log(err);
        }
    }
}