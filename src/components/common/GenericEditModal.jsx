import GenericCreateModal from './GenericCreateModal'

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
