function extrairPacienteId(link) {
  return (
    link.pacienteId ??
    link.patientId ??
    link.patient_id ??
    link.userId ??
    link.id ??
    null
  );
}
