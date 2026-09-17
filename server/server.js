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

app.get('/especies', async (_, res) =>{
  try{
    const {rows} = await pool.query('SELECT * FROM especies ORDER BY id DESC')
    res.status(200).json(rows)
  } catch (err){
    res.status(500).json({error: "Erro interno na busca de espécie."})
  }
})

app.post('/especies', async (req, res) =>{
  const {nome, periodo, dieta, tamanho, descricao, imagem} = req.body
  try{

    const query = 'INSERT INTO especies (nome, periodo, dieta, tamanho, descricao, imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
    const values = [nome, periodo, dieta, tamanho, descricao, imagem]
    const {rows} = await pool.query(query, values)

    res.status(201).json(rows[0])

  } catch (err){
    if (err.code === '23505'){//23505->violação de unicidade, nome já existe
      return res.status(400).json({ error: "Esta espécie já foi catalogada." })
    }
    res.status(500).json({error: "Erro interno ao salvar nova espécie."})
  }
})

//PATCH DINOPEDIA====================================================================================================
app.patch('/especies/:id', async (req, res) =>{
  const {id} = req.params
  const fields = req.body

  try {
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

    values.push(id)

    const query = `UPDATE especies SET ${setClauses.join(', ')} WHERE id = $${index} RETURNING *`
    
    const { rows } = await pool.query(query, values)

    if (rows.length === 0){
      return res.status(404).json({error: "Espécie não encontrada."})
    }

    res.status(200).json(rows[0])

  } catch (err){
    if (err.code === '23505'){//23505->violação de unicidade, nome já existe
      return res.status(400).json({ error: "Outra espécie já possui este nome." })
    }
    res.status(500).json({error: "Erro interno ao atualizar espécie."})
  }
})

//PATCH GENES======================================================================================================
app.patch('/especies/:id', async (req, res) =>{
  const {id} = req.params
  const fields = req.body

  //evita req maliciosa direta para a API
  if (fields.gene !== undefined){
    const geneParaValidar = fields.gene.toUpperCase().trim()
    const regexGene = /^[ATCG]*$/

    if (!regexGene.test(geneParaValidar)){
      return res.status(400).json({ 
        error: "Sequência genética inválida. Use apenas A, T, C e G." 
      })
    }
  }

  try{
    if (!fields || Object.keys(fields).length === 0){
      return res.status(400).json({error: "Preencha algum campo para atualizar."})
    }

    const setClauses = []
    const values = []
    let index = 1

    for (const key in fields){
      if (Object.prototype.hasOwnProperty.call(fields, key)){
        let valor = fields[key]

        if (key === 'gene' && (valor === null || valor === undefined)){
          valor = ""
        }

        setClauses.push(`${key} = $${index}`)
        values.push(valor)
        index++
      }
    }

    values.push(id)

    const query = `
      UPDATE especies
      SET ${setClauses.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `

    const {rows} = await pool.query(query, values)

    if (rows.length === 0){
      return res.status(404).json({error: "Espécie não encontrada."})
    }

    res.status(200).json(rows[0])

  } catch (err){
    res.status(500).json({error: err.message})
  }
})

app.delete('/especies/:id', async (req, res) =>{
  const {id} = req.params

  try{
    const {rows} = await pool.query('DELETE FROM especies WHERE id = $1 RETURNING id', [id])

    if (rows.length === 0){
      return res.status(404).json({error: 'Espécie não encontrada.'})
    }

    return res.status(200).json({message: 'Espécie excluída com sucesso.'})

  }catch (err){
    console.error('Erro ao deletar espécie:', err)
    return res.status(500).json({error: 'Erro interno na exclusão de espécie.'})
  }
})

//CAMERAS==========================================================================================================
app.get('/recintos/cameras', async (req, res) =>{
  try{
    const query = `
      SELECT 
        r.id AS recinto_id,
        r.nome AS recinto_nome,
        json_agg(
          json_build_object(
            'id', c.id, 
            'nome', c.nome, 
            'img_cam', c.img_cam
          )
        ) AS cameras
      FROM recintos r
      INNER JOIN cameras c ON r.id = c.recinto_id
      GROUP BY r.id;
    `

    const result = await pool.query(query)
    res.json(result.rows)
  }catch (err){
    console.error(err)
    res.status(500).json({error: "Erro ao buscar câmeras dos recintos."})
  }
})

app.post('/recintos/cameras', async (req, res) =>{
  const {nome, img_cam, recinto_id} = req.body

  try{
    if (!nome || !img_cam || !recinto_id){
      return res.status(400).json({error: "Falta nome, imagem ou ID do recindo para cadastrar a câmera."})
    }

    const query = `
      INSERT INTO cameras (nome, img_cam, recinto_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `

    const {rows} = await pool.query(query, [nome, img_cam, recinto_id])

    res.status(201).json(rows[0])
  } catch (err){
    console.error("Erro no cadastro de camera:", err)
    res.status(500).json({error: "Erro interno no cadastro de câmera."})
  }
})

//pra add cam num recinto que nao tenha
app.get('/recintos/sem-cameras', async (req, res) =>{
  try {
    const query = `
      SELECT r.id, r.nome 
      FROM recintos r 
      LEFT JOIN cameras c ON r.id = c.recinto_id 
      WHERE c.id IS NULL
      ORDER BY r.nome ASC;
    `
    const {rows} = await pool.query(query)
    res.status(200).json(rows)
  } catch (err){
    console.error("Erro ao buscar recintos sem câmeras:", err)
    res.status(500).json({error: "Erro interno ao buscar recintos vazios."})
  }
})

app.put('/recintos/cameras/:id', async (req, res) =>{
  try{
    const {id} = req.params
    const {nome, img_cam} = req.body
    const query = `
      UPDATE cameras 
      SET nome = $1, img_cam = $2 
      WHERE id = $3 
      RETURNING *;
    `
    const {rows} = await pool.query(query, [nome, img_cam, id])
    res.status(200).json(rows[0])
  } catch (err){
    console.error("Erro ao editar câmera:", err);
    res.status(500).json({error: "Erro interno ao editar câmera."})
  }
})

app.delete('/recintos/cameras/:id', async (req, res) =>{
  try{
    const {id} = req.params
    await pool.query('DELETE FROM cameras WHERE id = $1', [id])
    res.status(200).json({message: "Câmera excluída com sucesso."})
  } catch (err){
    console.error("Erro ao excluir câmera:", err);
    res.status(500).json({error: "Erro interno ao excluir câmera."})
  }
})

//RECINTOS==========================================================================================================
//retorna so colunas para preview de cada linha
app.get("/recintos/preview", async (req, res) =>{
  try{
    const query = `
      SELECT 
        rec.id,
        rec.nome,
        rec.img_miniatura,
        rec.em_manutencao,
        COALESCE(
          json_agg(esp.nome) FILTER (WHERE esp.nome IS NOT NULL), 
          '[]'
        ) AS especies
      FROM recintos rec
      LEFT JOIN recinto_especies recesp ON rec.id = recesp.recinto_id
      LEFT JOIN especies esp ON recesp.especie_id = esp.id
      GROUP BY rec.id;
    `

    const result = await pool.query(query)
    res.json(result.rows)
  } catch (err){
    console.error(err)
    res.status(500).json({error: "Erro ao buscar preview dos recintos."})
  }
})

//retorna os detalhes de um recinto especifico
//TODO: TENTAR OUTRO METODO
app.get('/recintos/:id', async (req, res) =>{
  try{
    const {id} = req.params
    const query = `
      SELECT 
        rec.*,
        COALESCE(
          json_agg(esp.nome) FILTER (WHERE esp.nome IS NOT NULL), 
          '[]'
        ) AS especies
      FROM recintos rec
      LEFT JOIN recinto_especies recesp ON rec.id = recesp.recinto_id
      LEFT JOIN especies esp ON recesp.especie_id = esp.id
      WHERE rec.id = $1
      GROUP BY rec.id;
    `

    const result = await pool.query(query, [id])
    if (result.rows.length === 0){
      return res.status(404).json({message: "Recinto não encontrado."})
    }

    res.json(result.rows[0])
  } catch (err){
    console.error(err)
    res.status(500).json({error: "Erro ao buscar detalhes deste recinto."})
  }
})

//rota pra deleter recinto por id
app.delete('/recintos/:id', async (req, res) =>{
  const {id} = req.params

  try{
    const {rows} = await pool.query('DELETE FROM recintos WHERE id = $1 RETURNING *', [id])

    if (rows.length === 0){
      return res.status(404).json({ error: 'Recinto não encontrado.' })
    }

    return res.status(200).json({message: 'Recinto excluído com sucesso.'})

  }catch (err){
    console.error('Erro ao deletar recinto:', err)
    return res.status(500).json({error: 'Erro interno durante exclusão de recinto.'})
  }
})

app.listen(PORT)