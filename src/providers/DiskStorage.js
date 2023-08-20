const fs = require("fs")
const path = require("path")
const uploadConfig = require("../configs/upload")

// função para salvar o arquivo de imagens 

class DiskStorage {
  async saveFile(file) {
    // o rename serve para renomear ou mover um arquivo
    // essa função muda o arquivo de lugar. da pasta temporária, para a pasta definitiva
      await fs.promises.rename(
        // imagem chega do backend para a pasta temporária
          path.resolve(uploadConfig.TMP_FOLDER, file),
          // depois , da pasta temporária a imagem é enviada para a pasta definitiva
          path.resolve(uploadConfig.UPLOADS_FOLDER, file)
          );
          
          return file;
        }
        // função para deletar o arquivo de imagens 
  async deleteFile(file) {
    //busca o arquivo na pasta definitiva
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    // trabalhar com tratamento de exceções para caso o arquivo buscado não exista mais
    try {
      // o stat retorna o estado do arquivo. Se ele está aberto, 
      // se está corrompido, se ele está disponível, etc
        await fs.promises.stat(filePath);
    } catch {
        return;
    }
    
    // o unlink serve para deletar efetivamente o arquivo
    await fs.promises.unlink(filePath);
}
}

  


module.exports = DiskStorage

