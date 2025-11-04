const UserModel = require('./user.model')

class UserService {
  async create(data) {
    return await UserModel.create(data)
  }

  async getAll() {
    return await UserModel.find()
  }
}

module.exports = new UserService();
