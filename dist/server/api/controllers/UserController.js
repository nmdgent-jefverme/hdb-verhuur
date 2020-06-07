"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("../../models/mongoose");
const utilities_1 = require("../../utilities");
class UserController {
    constructor(config, authService) {
        this.index = async (req, res, next) => {
            try {
                const { limit, skip } = req.query;
                let users = null;
                if (limit && skip) {
                    const options = {
                        page: parseInt(skip, 10) || 1,
                        limit: parseInt(limit, 10) || 10,
                        sort: { created_at: -1 },
                    };
                    users = await mongoose_1.User.paginate({}, options);
                }
                else {
                    users = await mongoose_1.User.find()
                        .sort({ created_at: -1 })
                        .where('_deletedAt', null)
                        .exec();
                }
                return res.status(200).json(users);
            }
            catch (err) {
                next(err);
            }
        };
        this.show = async (req, res, next) => {
            try {
                const { id } = req.params;
                const post = await mongoose_1.User.findById(id).exec();
                return res.status(200).json(post.profile);
            }
            catch (err) {
                next(err);
            }
        };
        this.destroy = async (req, res, next) => {
            const { id } = req.params;
            try {
                let user = null;
                let { mode } = req.query;
                switch (mode) {
                    case 'delete':
                    default:
                        user = await mongoose_1.User.findOneAndRemove({ _id: id });
                        break;
                    case 'softdelete':
                        user = await mongoose_1.User.findByIdAndUpdate({ _id: id }, { _deletedAt: Date.now() });
                        break;
                    case 'softundelete':
                        user = await mongoose_1.User.findByIdAndUpdate({ _id: id }, { _deletedAt: null });
                        break;
                }
                if (!user) {
                    throw new utilities_1.NotFoundError();
                }
                else {
                    return res.status(200).json({
                        message: `Successful ${mode} the User with id: ${id}!`,
                        user,
                        mode,
                    });
                }
            }
            catch (err) {
                next(err);
            }
        };
        this.signupLocal = async (req, res, next) => {
            const { email, password } = req.body;
            let foundUser = await mongoose_1.User.findOne({ email: email });
            if (foundUser) {
                return res.status(403).json({ error: 'Email is already in use' });
            }
            const newCamion = new mongoose_1.Camion({
                rented_to: Date.now(),
                rented_from: Date.now(),
            });
            const camion = await newCamion.save();
            const newUser = new mongoose_1.User({
                email: email,
                role: 'user',
                localProvider: {
                    password: password,
                },
                profile: {
                    firstName: req.body.fName,
                    lastName: req.body.lName,
                    gender: req.body.gender,
                    address: req.body.adres,
                    number: req.body.number,
                    appartement: req.body.appartement,
                    city: req.body.city,
                    postalCode: req.body.postalCode,
                },
                _camionId: newCamion.id,
            });
            const user = await newUser.save();
            const token = this.authService.createToken(user);
            return res.status(200).json({
                email: user.email,
                token: `${token}`,
                strategy: 'local',
                role: user.role,
                id: user.id,
                _camionId: user._camionId,
            });
        };
        this.signInLocal = async (req, res, next) => {
            this.authService.passport.authenticate('local', { session: this.config.auth.jwt.session }, async (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return next(new utilities_1.NotFoundError());
                }
                const token = this.authService.createToken(user);
                return res.status(200).json({
                    email: user.email,
                    token: `${token}`,
                    strategy: 'local',
                    role: user.role,
                    id: user.id,
                    _camionId: user._camionId,
                });
            })(req, res, next);
        };
        this.facebookShow = async (req, res, next) => {
            console.log(req.body);
        };
        this.facebookSignin = async (req, res, next) => {
            this.authService.passport.authenticate('facebook', {
                successRedirect: '/',
                failureRedirect: '/login',
            });
        };
        this.updateRole = async (req, res, next) => {
            const { id } = req.params;
            try {
                const userUpdate = {
                    role: req.body.role,
                };
                const updatedUser = await mongoose_1.User.findOneAndUpdate({ _id: id }, userUpdate, {
                    new: true,
                }).exec();
                if (!updatedUser) {
                    throw new Error('User niet gevonden.');
                }
                return res.status(200).json(updatedUser);
            }
            catch (err) {
                next(err);
            }
        };
        this.updateProfile = async (req, res, next) => {
            const { id } = req.params;
            try {
                const userUpdate = {
                    profile: {
                        firstName: req.body.fName,
                        lastName: req.body.lName,
                        gender: req.body.gender,
                        address: req.body.adres,
                        number: req.body.number,
                        appartement: req.body.appartement,
                        city: req.body.city,
                        postalCode: req.body.postalCode,
                    },
                };
                const updatedUser = await mongoose_1.User.findOneAndUpdate({ _id: id }, userUpdate, {
                    new: true,
                }).exec();
                if (!updatedUser) {
                    throw new Error('User niet gevonden.');
                }
                return res.status(200).json(updatedUser);
            }
            catch (err) {
                next(err);
            }
        };
        this.config = config;
        this.authService = authService;
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map