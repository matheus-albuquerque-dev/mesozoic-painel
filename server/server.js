const express = require('express')
const PORT = 3001
const { Pool } = require('pg')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

//reutlização da conexão
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
})

app.get('/dinos', async (_, res) =>{
  try{
    const {rows} = await pool.query('SELECT * FROM especies ORDER BY id DESC')
    res.status(200).json(rows)
  } catch (err){
    res.status(500).json({error: "Erro interno."})
  }
})

app.post('/dinos', async (req, res) =>{
  const {nome, periodo, dieta, tamanho, descricao, imagem} = req.body
  try{

    const query = 'INSERT INTO especies (nome, periodo, dieta, tamanho, descricao, imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
    const values = [nome, periodo, dieta, tamanho, descricao, imagem]
    const {rows} = await pool.query(query, values)

    res.status(201).json(rows[0])

  } catch (err){
    res.status(500).json({error: "Erro interno."})
  }
})

app.patch('/dinos/:id', async (req, res) =>{
  const {id} = req.params
  const fields = req.body

  try{

    if (Object.keys(fields).length === 0){
      return res.status(400).json({error: "Preencha algum campo para atualizar."})
    }

    const setClauses = []
    const values = []

    let index = 1

    for (const key in fields){
      setClauses.push(`${key} = $${index}`)
      values.push(fields[key])
      index++
    }

    values.push(id)//põe id no final

    const query = `
      UPDATE especies
      SET ${setClauses.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `;
    //WHERE id {index} -> "onde o id for o igual ao último value('fisgado pelo index'), ou seja, o próprio id"
    const {rows} = await pool.query(query, values)

    if (rows.length === 0){
      return res.status(404).send('Espécie não encontrada.')
    }

    res.status(200).json(rows[0])

  } catch (err){
    res.status(500).json({error: "Erro interno."})
  }
})

app.delete('/dinos/:id', async (req, res) =>{
  const {id} = req.params
  try{

    const {rows} = await pool.query('DELETE FROM especies WHERE id = $1 RETURNING *', [id])

    if (rows.length === 0){ //id não encontrado
      return res.status(404).send('Espécie não encontrada.')
    }

    res.status(200).json(rows[0])

  } catch (err){
    res.status(500).json({error: "Erro interno."})
  }
})

app.listen(PORT, () => {console.log(`Servidor rodando, Dinopedia ON.`)})