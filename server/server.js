const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express() //inicizalizando servidor express
const PORT = 3000 //porta utilizada
app.use(cors()) //ativa cors
app.use(express.json()) //servidor entender json

//Códigos de Status HTTP:
//status(201) - "Created"
//status(404) - "Not Found"
//status(500) - "Internal Server Error"

app.get("/dinos", (_, res) => {
  fs.readFile("dinos.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({erro: "Erro ao ler arquivo"})
    }

    res.json(JSON.parse(data)) //parse transforma texto em objetos para o js entender, res envia
  })
})

app.post("/dinos", (req, res) => {
  const novoDino = req.body //dados enviados pelo usuário

  fs.readFile("dinos.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({erro: "Erro ao ler arquivo"})
    }
    
    const dinos = JSON.parse(data)//parse para manipular

    novoDino.id = dinos.length > 0 ? Math.max(...dinos.map(d => d.id)) + 1 : 1;

    dinos.push(novoDino)

    fs.writeFile("dinos.json", JSON.stringify(dinos, null, 2), (err) => {//retransforma objetos em texto e reescreve arquivo
      if (err) {
        return res.status(500).json({erro: "Erro ao salvar arquivo"})
      }

      res.status(201).json(novoDino)
    })
  })
})

app.delete("/dinos/:nome", (req, res) => {
  const nome = req.params.nome//captura nome

  fs.readFile("dinos.json", "utf8", (err, data) => {//abre arquivo
    if (err) {
      return res.status(500).json({erro: "Erro ao ler arquivo"})
    }

    const dinos = JSON.parse(data) //"objetifica"

    const existe = dinos.some(d => d.nome === nome) //procura objeto com mesmo nome

    if (!existe) {
      return res.status(404).json({erro: "Dinossauro não encontrado"})
    }

    const dinosRestantes = dinos.filter(d => d.nome !== nome) //todos menos o do nome

    fs.writeFile("dinos.json", JSON.stringify(dinosRestantes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({erro: "Erro ao salvar arquivo"})
      }

      res.json({mensagem: "Dinossauro removido com sucesso"})
    })
  })
})

app.listen(PORT, () => {
  console.log(`Servidor ativo: http://localhost:${PORT}`)
})