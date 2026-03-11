const express = require("express")
const cors = require("cors")
const fs = require("fs")

const app = express() //inicizalizando servidor express
const PORT = 3000 //porta utilizada
app.use(cors()) //ativa cors
app.use(express.json()) //servidor entender json

app.get("/dinos", (req, res) => {
  fs.readFile("dinos.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao ler arquivo" })
    }

    res.json(JSON.parse(data)) //parse transforma texto em objetos para o js entender, res envia
  })
})

app.post("/dinos", (req, res) => {
  const novoDino = req.body //dados enviados pelo usuário

  fs.readFile("dinos.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ erro: "Erro ao ler arquivo" })
    }

    const dinos = JSON.parse(data) // parse para manipular

    dinos.push(novoDino) //adição das informações nos objetos

    fs.writeFile("dinos.json", JSON.stringify(dinos, null, 2), (err) => { //retransforma objetos em texto e reescreve arquivo
      if (err) {
        return res.status(500).json({ erro: "Erro ao salvar arquivo" })
      }

      res.status(201).json({ mensagem: "Dinossauro adicionado!" })
    })
  })
})

app.delete("/dinos/:id", (req, res) => {
  const id = req.params.id //captura id

  fs.readFile("dinos.json", "utf8", (err, data) => { //abre arquivo
    if (err) {
      return res.status(500).json({ erro: "Erro ao ler arquivo" })
    }

    const dinos = JSON.parse(data) //"objetifica"

    const existe = dinos.some(d => d.id === id) //procura objeto com mesmo id

    if (!existe) {
      return res.status(404).json({ erro: "Dinossauro não encontrado" })
    }

    const dinosRestantes = dinos.filter(d => d.id !== id) //todos menos o do id

    fs.writeFile("dinos.json", JSON.stringify(dinosRestantes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao salvar arquivo" })
      }

      res.json({ mensagem: "Dinossauro removido com sucesso" })
    })
  })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})