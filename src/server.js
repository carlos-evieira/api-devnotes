require("express-async-errors")
const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")
const uploadConfig = require("./configs/upload")

const cors = require("cors")
const express = require ("express")
const routes = require("./routes")

migrationsRun() // executando as migrations


const app = express()
app.use(cors())
app.use(express.json()) //habilita a leitura de arquivos JSON pelo Node

app.use("/files", express.static( uploadConfig.UPLOADS_FOLDER))

app.use(routes)


app.use((error, req, res, next) =>{
  
  // detecta se um erro foi gerado do lado do cliente
  if(error instanceof AppError){
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

console.log(error)

//se não for um erro do lado do cliente então devolvemos uma mensagem com erro do lado do servidor
  return res.status(500).json({
    status: "error",
    message: "Internal server error"
  })

})

const PORT = 3333
app.listen(PORT, ()=> console.log(`Server is running on Port ${PORT}`))