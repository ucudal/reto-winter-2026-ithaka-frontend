import GenericCreateModal from './GenericCreateModal'

/**
 * Modal generico de edicion/actualizacion, reutilizable para cualquier tabla.
 * Envuelve GenericCreateModal (misma logica de campos, validacion y render)
 * pero precarga los valores de un registro existente y asegura que el id
 * se mande de vuelta junto con los datos editados.
 *
 * Props:
 * - fields: mismo formato que GenericCreateModal (array de { name, label, type, required, ... })
 * - record: el registro existente a editar (objeto con al menos { id, ...campos })
 * - onSubmit(data): se llama con los campos editados + el id del registro original
 */
export default function GenericEditModal({
  open,
  onClose,
  title,
  fields,
  record,
  onSubmit,
  loading = false,
}) {
  const handleSubmit = (formData) => {
    onSubmit({ ...formData, id: record?.id });
  };

  return (
    <GenericCreateModal
      open={open}
      onClose={onClose}
      title={title}
      fields={fields}
      initialValues={record ?? {}}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
