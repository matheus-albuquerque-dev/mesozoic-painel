import {useState, useEffect} from "react"
import "./styles/CardCamera.css"

const aleatorizarCameras = (array) =>{
    const copia = [...array]
    for (let atual = copia.length - 1; atual > 0; atual--){//do fim ao segundo
        const escolhido = Math.floor(Math.random() * (atual + 1));//numero (e escolha) aleatorio entre 0 e atual
        [copia[atual], copia[escolhido]] = [copia[escolhido], copia[atual]]//troca ambos sem perder ''informacao'' (camera), depois continua ''aleatorizando''
    }
    return copia
}

export default function CardCamera({recinto, abrirModalCam}){
    const [camerasExibidas, setCamerasExibidas] = useState([])

    //timer de 5s para previews
    useEffect(() =>{
        const listaCameras = Array.isArray(recinto?.cameras) ? recinto.cameras : [];
        const totalCameras = listaCameras.length;

        if (totalCameras <= 3){//estatico para 3 ou menos cameras associadas
        setCamerasExibidas(recinto.cameras)
        return
        }

        setCamerasExibidas(aleatorizarCameras(recinto.cameras).slice(0, 3))
        const intervalo = setInterval(() => {
        setCamerasExibidas(aleatorizarCameras(recinto.cameras).slice(0, 3))
        }, 4000)

        return () => clearInterval(intervalo)//limpeza do cronometro se fechar
    }, [recinto.cameras])

    return(
        <div className="cardCam">

            <p className="nomeCamRec">{recinto.recinto_nome}</p>
            <div className="previewCam">
                {camerasExibidas.map((cam) =>(
                <div key={cam.id} className="miniCamCard">
                    <img src={cam.img_cam} alt={cam.nome}/>
                    <span className="nomeCam">{cam.nome}</span>
                </div>
                ))}
            </div>

            <button className="btnVerCam" onClick={() => abrirModalCam(recinto)}>
                VER MAIS
            </button>
        </div>
    )
}