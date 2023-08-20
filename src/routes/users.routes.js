const { Router } = require("express")
const multer = require("multer")
const uploadConfig = require("../configs/upload")

const UserController = require("../controllers/UsersController")
const UserAvatarController = require("../controllers/UserAvatarController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

const usersRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const usersController  = new UserController()
const userAvatarController  = new UserAvatarController()


usersRoutes.post("/", usersController.create)
usersRoutes.put("/",ensureAuthenticated, usersController.update)
//patch -> atualiza um campo específico , neste caso o avatar do usuário
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)



module.exports = usersRoutes