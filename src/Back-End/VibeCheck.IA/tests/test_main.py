from http.client import responses

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

API_KEY = "0574db8500247078260d739a2bbfaaaa716c26591dbe30b9f3ecdc38326c6d02"
HEADERS = {"X-API-Key": API_KEY}

def test_texto_vazio():
    """Deve retornar 400 quanto o texto vier vazio"""
    response = client.post("/analisar",json={
        "id_entrada": "1",
        "id_paciente": "1",
        "texto": ""
    }, headers=HEADERS)
    assert response.status_code == 400

def teste_sem_api_key():
    """Deve retornar 401 quando a chave não for enviada"""
    response = client.post("/analisar", json={
        "id_entrada": "1",
        "id_paciente": "1",
        "texto": "hoje me senti bem"
    })
    assert response.status_code == 401

def test_api_key_invalida():
    """Deve retornar 403 quando a chave for inválida"""
    response = client.post("/analisar", json={
        "id_entrada": "1",
        "id_paciente": "1",
        "texto": "hoje me senti bem"
    }, headers={"X-API-Key": "chave_errada"})
    assert response.status_code == 403

def test_retorno_tem_campos_esperados():
    """Deve retornar os campos entry_id, patient_id e frases."""
    response = client.post("/analisar", json={
        "id_entrada": "123",
        "id_paciente": "456",
        "texto": "hoje eu acordei feliz e me senti bem"
    }, headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert "entry_id" in data
    assert "patient_id" in data
    assert "frases" in data


def test_ids_retornados_corretamente():
    """Os IDs retornados devem ser iguais aos enviados."""
    response = client.post("/analisar", json={
        "id_entrada": "333",
        "id_paciente": "3",
        "texto": "hoje eu acordei feliz"
    }, headers=HEADERS)
    data = response.json()
    assert data["entry_id"] == "333"
    assert data["patient_id"] == "3"


def test_frases_tem_estrutura_correta():
    """Cada frase deve ter os campos esperados."""
    response = client.post("/analisar", json={
        "id_entrada": "1",
        "id_paciente": "1",
        "texto": "hoje eu acordei feliz"
    }, headers=HEADERS)
    data = response.json()
    for frase in data["frases"]:
        assert "frase" in frase
        assert "emocao_dominante" in frase
        assert "intensidade" in frase
        assert "todas_emocoes" in frase
