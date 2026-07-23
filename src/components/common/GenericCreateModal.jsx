import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";


export default function GenericCreateModal({
  open,
  onClose,
  title,
  fields,
  initialValues = {},
  onSubmit,
  loading = false,
}) {

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(initialValues);
      setErrors({});
    }
  }, [open, initialValues]);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {

      if (
        field.required &&
        !formData[field.name]
      ) {
        newErrors[field.name] =
          `${field.label} es requerido`;
      }


      if (
        field.validate &&
        formData[field.name]
      ) {
        const error = field.validate(
          formData[field.name]
        );

        if (error) {
          newErrors[field.name] = error;
        }
      }

    });


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };


  const renderField = (field) => {

    switch(field.type) {
      case "select":
        return (
          <TextField
            select
            fullWidth
            label={field.label}
            name={field.name}
            value={formData[field.name] ?? ""}
            onChange={handleChange}
            required={field.required}
            error={Boolean(errors[field.name])}
            helperText={errors[field.name]}
          >
            {
              field.options?.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))
            }

          </TextField>
        );


      case "textarea":
        return (
          <TextField
            fullWidth
            multiline
            rows={field.rows || 3}
            label={field.label}
            name={field.name}
            value={formData[field.name] ?? ""}
            onChange={handleChange}
            required={field.required}
            error={Boolean(errors[field.name])}
            helperText={errors[field.name]}
          />
        );


      default:

        return (
          <TextField
            fullWidth
            type={field.type || "text"}
            label={field.label}
            name={field.name}
            value={formData[field.name] ?? ""}
            onChange={handleChange}
            required={field.required}
            error={Boolean(errors[field.name])}
            helperText={errors[field.name]}
            InputLabelProps={
              field.type === "date"
                ? { shrink:true }
                : undefined
            }
          />
        );
    }

  };


  return (

    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >

      <form onSubmit={handleSubmit}>


        <DialogTitle>
          {title}
        </DialogTitle>


        <DialogContent dividers>

          <Grid
            container
            spacing={2}
          >

            {
              fields.map((field)=>(
                <Grid
                  item
                  xs={12}
                  sm={field.grid || 12}
                  key={field.name}
                >

                  {renderField(field)}

                </Grid>
              ))
            }


          </Grid>


        </DialogContent>



        <DialogActions>

          <Button
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>


          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {
              loading
                ? "Guardando..."
                : "Guardar"
            }

          </Button>


        </DialogActions>


      </form>


    </Dialog>

  );
}
