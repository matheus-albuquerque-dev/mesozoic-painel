const API_URL = import.meta.env.VITE_API_URL

export const recintosService ={
  //busca so o necessario para previews
  getPreviews: async () => {
    try{
      const response = await fetch(`${API_URL}/recintos/preview`)
      if (!response.ok) throw new Error("Requisição preview falhou.")
      return await response.json()
    } catch (erro){
      console.error(erro)
      return []
    }
  },

  //busca detalhes do recinto selecionado
  getDetalhes: async (id) =>{
    try{
      const response = await fetch(`${API_URL}/recintos/${id}`)
      if (!response.ok) throw new Error("Requisição de detalhes falhou.")
      return await response.json()
    } catch (erro){
      console.error(erro)
      return null
    }
  },

  deleteRecinto: async (id) =>{
    const res = await fetch(`${API_URL}/recintos/${id}`, {method: "DELETE", })
    if (!res.ok){ // response fora de [200-299]
      const errorData = await res.json()
      throw new Error(errorData.error || "Erro ao tentar excluir recinto.")
    }
    return true//confirma o delete
  }
}