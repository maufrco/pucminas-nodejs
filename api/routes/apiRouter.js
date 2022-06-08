const express = require ('express') 
let apiRouter = express.Router() 
const auth = require('../services/auth') 

const knex = require('knex')({ 
    client: 'pg', 
    debug: true, 
    connection: { 
        connectionString : process.env.DB_URL, 
        ssl: { rejectUnauthorized: false }, 
      } 
  }); 

const endpoint = '/' 

// rotinas permitidas para qualquer usuário
apiRouter.get(endpoint + 'produtos', auth.checkToken, (req, res, next) => {
    knex.select('*')
    .from ('produto')
        .then(produtos => res.status(200).json(produtos))
        .catch(err => res.status(500).json({ message: err.message }))
})
apiRouter.get(endpoint + 'produtos/:id',  (req, res) => { 
    const { id } = req.params
    knex.select('*')
    .from ('produto')
        .where({ id })
        .then(produtos => {
            if(produtos.length){
                return res.status(200).json(produtos)
            }else{
                return res.status(404).json({message: `Produto ${id} não cadastrado`})
            }
        })
        .catch(err => res.status(500).json({message: err.message}))
})
// rotinas permitidas apenas para administradores
 apiRouter.post(endpoint + 'produtos', auth.checkToken, auth.isAdmin, (req, res) => { 
    knex('produto')
    .insert(req.body)
    .then(()=>{
      return res.status(200).json({message: 'Produto cadastrado!'})
    })
    .catch(err => res.status(500).json({message: err.message}))
 })
  
 apiRouter.put(endpoint + 'produtos/:id', auth.checkToken, auth.isAdmin, (req, res) => {
    const { id } = req.params
    knex('produto')
    .update(req.body)
    .where({id})
    .then(()=>{
      return res.status(200).json({message: 'Produto alterado com sucesso'})
    })
    .catch(err => res.status(500).json({message: err.message}))
  })
apiRouter.delete(endpoint + 'produtos/:id', auth.checkToken, auth.isAdmin, (req, res) => {
    const { id } = req.params
    knex('produto')
    .where({id: id})
    .del()
    .then((n) => {
      if(n){
        return res.status(200).json({message: `Produto ${id} excluído com sucesso`})
      }else{
        return res.status(200).json({message: `Produto ${id} não cadastrado`})
      }
    })
    .catch(err => res.status(500).json({message: err.message}))
  })

module.exports = apiRouter; 