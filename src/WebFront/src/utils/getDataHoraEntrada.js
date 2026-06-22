export default function (entrada) {

  const dataHoraEntrada = new Date(entrada.createdAt);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  let dataEntrada = "";
  const horaEntrada = dataHoraEntrada.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (hoje.toDateString() === dataHoraEntrada.toDateString()) {
    dataEntrada = "hoje";
  } else if (ontem.toDateString() === dataHoraEntrada.toDateString()) {
    dataEntrada = "ontem";
  } else {
    dataEntrada = dataHoraEntrada.toLocaleDateString("pt-BR");
  }

  return({horaEntrada, dataEntrada});
}
