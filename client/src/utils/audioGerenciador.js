const fonteAudios = "/assets/audios/"

const sons = {
  click: new Audio(fonteAudios + "click.mp3"),
  //hover: new Audio("/assets/audios/hover.mp3"),
  //erro: new Audio("/assets/audios/error.mp3")
  ambiente: new Audio(fonteAudios + "ambiente.mp3")
}

sons.ambiente.loop = true
sons.ambiente.volume = 0.2

export function tocarSom(nome){
  const som = sons[nome]

  if (!som) return

  som.currentTime = 0
  som.play()
}