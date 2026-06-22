function gerarId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const entradaVazia = {
  id: gerarId(),
  pacienteId: "69d41d22a12ea5b2fba9b4ca",
  texto: "",
  analiseIA: {
    emocaoPredominante: "neutral",
    frases: [
      {
        trecho: "",
        emocao: "neutral",
        intensidade: 0,
      },
    ],
  },
  createdAt: "",
};

export function nDiasAtras(dataRef, n) {
  const dataNDiasAtras = new Date(dataRef);
  dataNDiasAtras.setDate(dataRef.getDate() - n);
  return dataNDiasAtras;
}

export function getIntensidadeCor(entradaDiaHeatmap) {
  const cor = (hue, v) => {
    if (v <= 0) return null;
    const t = (v / 10) ** 1.5;
    return `hsl(${hue}, ${t * 85}%, ${92 - t * 22}%)`;
  };
  const colorMap = {
    intesidadeCorAlegria: cor(48, entradaDiaHeatmap.alegria),
    intesidadeCorTristeza: cor(210, entradaDiaHeatmap.tristeza),
    intesidadeCorRaiva: cor(4, entradaDiaHeatmap.raiva),
    intesidadeCorMedo: cor(280, entradaDiaHeatmap.medo),
    intesidadeCorSurpresa: cor(30, entradaDiaHeatmap.surpresa),
    intesidadeCorNojo: cor(140, entradaDiaHeatmap.nojo),
  };
  return colorMap;
}

export function limparUmDiarioHeatmap(entradaDiario) {
  if (!entradaDiario.analiseIA) return null;
  const frasesAnalise = entradaDiario.analiseIA.frases ?? [];
  let dataEntrada = new Date(entradaDiario.createdAt);
  dataEntrada = dataEntrada.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const frasesAlegria = frasesAnalise.filter((frase) => frase.emocao === "joy");
  const frasesRaiva = frasesAnalise.filter((frase) => frase.emocao === "anger");
  const frasesMedo = frasesAnalise.filter((frase) => frase.emocao === "fear");
  const frasesNojo = frasesAnalise.filter(
    (frase) => frase.emocao === "disgust",
  );
  const frasesTristeza = frasesAnalise.filter(
    (frase) => frase.emocao === "sadness",
  );
  const frasesSurpresa = frasesAnalise.filter(
    (frase) => frase.emocao === "surprise",
  );
  const frasesNeutro = frasesAnalise.filter(
    (frase) => frase.emocao === "neutral",
  );

  const intensidadeAlegria =
    frasesAlegria.length > 0
      ? Math.max(...frasesAlegria.map((f) => f.intensidade))
      : 0;
  const intensidadeRaiva =
    frasesRaiva.length > 0
      ? Math.max(...frasesRaiva.map((f) => f.intensidade))
      : 0;
  const intensidadeMedo =
    frasesMedo.length > 0
      ? Math.max(...frasesMedo.map((f) => f.intensidade))
      : 0;
  const intensidadeNojo =
    frasesNojo.length > 0
      ? Math.max(...frasesNojo.map((f) => f.intensidade))
      : 0;
  const intensidadeTristeza =
    frasesTristeza.length > 0
      ? Math.max(...frasesTristeza.map((f) => f.intensidade))
      : 0;
  const intensidadeSurpresa =
    frasesSurpresa.length > 0
      ? Math.max(...frasesSurpresa.map((f) => f.intensidade))
      : 0;
  const intensidadeNeutro =
    frasesNeutro.length > 0
      ? Math.max(...frasesNeutro.map((f) => f.intensidade))
      : 0;

  return {
    dataEntrada: dataEntrada,
    alegria: intensidadeAlegria,
    raiva: intensidadeRaiva,
    medo: intensidadeMedo,
    nojo: intensidadeNojo,
    tristeza: intensidadeTristeza,
    surpresa: intensidadeSurpresa,
    neutro: intensidadeNeutro
  };
}

function mesmoDia(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function incluiDia(array, data) {
  return array.some((d) => mesmoDia(d, data));
}

function datasNoIntervalo(inicio, fim) {
  const datas = [];
  const atual = new Date(inicio);
  atual.setHours(0, 0, 0, 0);

  const dataFim = new Date(fim);
  dataFim.setHours(0, 0, 0, 0);

  while (atual <= dataFim) {
    datas.push(new Date(atual));
    atual.setDate(atual.getDate() + 1);
  }

  return datas;
}

export function filtrarIntervalo({ dataInicial, dataFinal, entradasDiario }) {
  const inicio = new Date(dataInicial);
  inicio.setHours(0, 0, 0, 0);

  const fim = new Date(dataFinal);
  fim.setHours(23, 59, 59, 999);

  const entradasFiltradasIncompletas = entradasDiario.filter(
    (entradaDiario) => {
      const data = new Date(entradaDiario.createdAt);
      return data >= inicio && data <= fim;
    },
  );

  const datasIntervalo = datasNoIntervalo(dataInicial, dataFinal);
  const datasEntradas = entradasFiltradasIncompletas.map(
    (entrada) => new Date(entrada.createdAt),
  );

  const entradasFiltradasCompletas = datasIntervalo.map((data) => {
    const entrada = entradasFiltradasIncompletas.filter((entrada) =>
      mesmoDia(new Date(entrada.createdAt), data),
    );
    if (entrada.length === 0) {
      return {
        ...entradaVazia,
        id: gerarId(),
        createdAt: data.toISOString(),
      };
    }
    return entrada[0];
  });

  return entradasFiltradasCompletas;
}

export function aplicarIntervalo(dataInicio,dataFim,dadosEntradaDiario, setEntradasNoIntervalo) {
    const entradasFiltradasIntervalo = filtrarIntervalo({
      dataInicial: dataInicio,
      dataFinal: dataFim,
      entradasDiario: dadosEntradaDiario,
    });

    setEntradasNoIntervalo(entradasFiltradasIntervalo.map(limparUmDiarioHeatmap).filter(Boolean));
  }
