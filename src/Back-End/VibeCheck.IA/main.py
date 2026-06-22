import re
import os
import requests
import emoji
import re
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from deep_translator import GoogleTranslator
from dotenv import load_dotenv
import spacy

load_dotenv()

nlp = spacy.load("pt_core_news_sm")

HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_TOKEN")
INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY")

API_URL_PUNCTUATION = "https://router.huggingface.co/hf-inference/models/oliverguhr/fullstop-punctuation-multilang-large"
API_URL_EMOTION = "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base"

api_key_header = APIKeyHeader(name = "X-API-Key")

headers = {
    "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
}

app = FastAPI()


class EntradaDiario(BaseModel):
    id_entrada: str
    id_paciente: str
    texto: str

async def validar_api_key(api_key: str = Security(api_key_header)):
    if INTERNAL_API_KEY != api_key:
        raise HTTPException(status_code=403, detail=f"Chave da API não correspondente")

def normalizar_texto(texto):
    texto_sem_emoji = emoji.demojize(texto, language="en")
    texto_limpo = re.sub(r'[^a-zA-ZÀ-ÿ0-9\s!?.,();:\-_]', '', texto_sem_emoji)
    return texto_limpo

def traduzir_texto(texto):
    return GoogleTranslator(source='auto', target='en').translate(text=texto)

def segmentar_texto(texto):
    response = requests.post(API_URL_PUNCTUATION, headers=headers, json={"inputs": texto})
    return response.json()

def reconstruir_texto(segmentos):
    texto = ""
    for segmento in segmentos:
        word = segmento["word"].strip()
        punct = segmento["entity_group"]
        if word:
            texto += word
            if punct != "0":
                texto += punct
            texto += " "
    return texto.strip()

def classificar_emocoes(frase):
    response = requests.post(API_URL_EMOTION, headers=headers, json={"inputs": frase}, timeout=15)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=f"Erro na API do HuggingFace: {response.text}")

    resultado = response.json()
    emocoes = resultado[0] if isinstance(resultado[0], list) else resultado

    return {
        "emocao_dominante": emocoes[0]["label"],
        "intensidade": round(emocoes[0]["score"], 3),
        "todas_emocoes": {item["label"]: round(item["score"], 3) for item in emocoes}
    }

def analisar_entrada(texto):
    texto_normalizado = normalizar_texto(texto)
    segmentos = segmentar_texto(texto_normalizado)
    texto_pontuado = reconstruir_texto(segmentos)

    doc = nlp(texto_pontuado)
    frases_pt = []
    for sentenca in doc.sents:
        frase = sentenca.text.strip()
        if len(frase) > 5:
            frases_pt.append(frase)

    resultados = []
    for frase_pt in frases_pt:

        #Removendo erros de pontuação
        frase_pt = re.sub(r'\.(\s*\.)+','.',frase_pt)

        frase_en = traduzir_texto(frase_pt)
        classificacao = classificar_emocoes(frase_en)
        resultados.append({
            "frase": frase_pt,
            "emocao_dominante": classificacao["emocao_dominante"],
            "intensidade": classificacao["intensidade"],
            "todas_emocoes": classificacao["todas_emocoes"]
        })

    return resultados


#Configuração da API
@app.post("/analisar")
def analisar_diario(data: EntradaDiario, _ : str = Depends(validar_api_key)):
    texto = data.texto.strip()

    if not texto:
        raise HTTPException(status_code=400, detail="texto vazio ou invalido")

    texto = texto[:5000]
    frases_analisadas = analisar_entrada(texto)

    if not frases_analisadas:
        raise HTTPException(status_code=400, detail="nenhuma frase encontrada")

    return {
        "entry_id": data.id_entrada,
        "patient_id": data.id_paciente,
        "frases": frases_analisadas
    }