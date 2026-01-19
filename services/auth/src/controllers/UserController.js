import { UserModel } from '../models/userModel.js'

export class UserController {
    // Get all users with pagination support
    async getAllUsers(req, res, next) {
        try {
            const { _start = 0, _end = 10, _sort = 'email', _order = 'ASC' } = req.query

            const sortOrder = _order === 'DESC' ? -1 : 1
            const sortField = _sort || 'email'

            const total = await UserModel.countDocuments()
            const users = await UserModel
                .find()
                .select('-password')
                .sort({ [sortField]: sortOrder })
                .skip(parseInt(_start))
                .limit(parseInt(_end) - parseInt(_start))

            const end = Math.min(parseInt(_end) - 1, total - 1)
            res.set('Content-Range', `users ${_start}-${end}/${total}`)

            res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    }

    // Get user by id
    async getUser(req, res, next) {
        try {
            const user = await UserModel.findById(req.params.id).select('-password')
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            res.status(200).json(user)
        } catch (err) {
            next(err)
        }
    }

    // Update user
    async updateUser(req, res, next) {
        try {
            const { password, ...updateData } = req.body

            // If password is provided, hash it
            if (password) {
                const user = await UserModel.findById(req.params.id)
                user.password = password
                await user.save()
            }

            const updatedUser = await UserModel
                .findByIdAndUpdate(req.params.id, updateData, { new: true })
                .select('-password')

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' })
            }

            res.status(200).json(updatedUser)
        } catch (err) {
            next(err)
        }
    }

    // Delete user
    async deleteUser(req, res, next) {
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }
            res.status(204).end()
        } catch (err) {
            next(err)
        }
    }
}
