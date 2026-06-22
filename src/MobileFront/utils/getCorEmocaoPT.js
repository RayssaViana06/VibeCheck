export default function getCorEmocaoPT(emocao){

    let corEmocao = "#9e9e9e"
    let emocaoEmPT = ""

    switch (emocao){
        case "joy":
            corEmocao = "#fdd835"
            emocaoEmPT = "alegria"
            break;
        case "anger":
            corEmocao = "#e57373"
            emocaoEmPT = "raiva"
            break
        case "sadness":
            corEmocao = "#5c9bd6"
            emocaoEmPT = "tristeza"
            break
        case "fear":
            corEmocao = "#9c4dcc"
            emocaoEmPT = "medo"
            break
        case "surprise":
            corEmocao = "#ffa726"
            emocaoEmPT = "surpresa"
            break
        case "disgust":
            corEmocao = "#43a047"
            emocaoEmPT = "nojo"
            break
        case "neutral":
            corEmocao = "#9e9e9e"
            emocaoEmPT = "neutro"
            break
        default:
            corEmocao = "#9e9e9e"
            emocaoEmPT = emocao ?? ""
    }

    return {corEmocao,emocaoEmPT};

}