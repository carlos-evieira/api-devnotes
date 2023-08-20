const { hash, compare } = require ("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")

class UserController {
  async create(req, res){
    const {name, email, password} = req.body

    const database = await sqliteConnection()
    const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

    if(checkUserExists){
      throw new AppError("Este email já está em uso.")
    }

    //Criar uma criptografia na senha do usuário
    const hashedPassword = await hash(password, 8)

    // inserir o usuário no banco
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    )

    return res.status(201).json()
   
  }

  async update(req, res){
    // pegar o nome e email pelo body e o id pelo params
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id
    const database = await sqliteConnection();
    
    // pegando o usuário pelo id do parâmetro recebido
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);
    
    // Se o usuário não existir
    if (!user) {
      
      throw new AppError("Usuário não encontrado!");
    }

    // selecionando apenas o usuário em que o email seja igual ao do banco de dados
    const userWithUpdatedEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    // Caso o usuário queira atualizar o email para outro que já 
    //exista no banco e que seja e outro usuário

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError("Este e-email já está em uso.");
    }

    

     // nullish operator , se o name = vazio, então utiliza o valor de user.name que já estava
    user.name = name ?? user.name;
    user.email = email ?? user.email;
  

      //Se o usuário passou password e não passou oldpassword
      if(password && !old_password){
        throw new AppError("Você precisa informar a senha antiga para definir a nova senha")
      }
      
      //Se o usuário passou password e o oldpassword
    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }
      user.password = await hash(password, 8);
    }

    await database.run(
      `
        UPDATE users SET
          name = ?,
          email = ?,
          password = ?,
          updated_at = DATETIME('now')
        WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return res.status(200).json();
  }
}

module.exports = UserController