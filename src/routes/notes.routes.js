const { Router } = require("express")
const NotesController = require("../controllers/NotesController")
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")


const notesRoutes = Router()

const notesController  = new NotesController()

//middleware de autenticação aplicado para todas a rotas abaixo dele
notesRoutes.use(ensureAuthenticated)

notesRoutes.get("/",notesController.index)
notesRoutes.get("/:id",notesController.show)
notesRoutes.post("/",notesController.create)
notesRoutes.delete("/:id",notesController.delete)


module.exports = notesRoutes