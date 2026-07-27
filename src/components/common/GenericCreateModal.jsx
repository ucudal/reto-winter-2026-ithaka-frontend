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

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
      const value = formData[field.name];
      const isEmpty = Array.isArray(value)
        ? value.length === 0
        : value === undefined || value === null || value === "";

      if (
        field.required &&
        isEmpty
      ) {
        newErrors[field.name] =
          `${field.label} es requerido`;
      }


      if (
        field.validate &&
        !isEmpty
      ) {
        const error = field.validate(
          value
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
            value={formData[field.name] ?? (field.multiple ? [] : "")}
            onChange={handleChange}
            required={field.required}
            error={Boolean(errors[field.name])}
            helperText={errors[field.name]}
            SelectProps={{
              multiple: Boolean(field.multiple),
              renderValue: field.multiple
                ? (selected) =>
                    field.options
                      ?.filter((option) => selected.includes(option.value))
                      .map((option) => option.label)
                      .join(", ")
                : undefined,
            }}
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
        case "editor":
          return (
            <>
              <TextField
                label={field.label}
                value=""
                sx={{ display: "none" }}
              />

              <ReactQuill
                theme="snow"
                value={formData[field.name] ?? ""}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field.name]: value,
                  }))
                }
                modules={{
                  toolbar: [
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            </>
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

      <form onSubmit={handleSubmit} noValidate>


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
