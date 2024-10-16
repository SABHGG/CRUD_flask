"use client";
import { useForm } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { toast } from "sonner";
import { Button } from "@nextui-org/button";

export default function Create() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/baul`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      toast.promise(promise, {
        loading: "Loading...",
        success: async (res) => {
          const result = await res.json();
          return result.message;
        },
        error: "Error en crear el registro",
      });
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-sm mx-auto dark flex flex-col gap-3"
      >
        <Input
          isRequired
          label="Nombre"
          {...register("usuario", { required: true })}
        />
        <Input
          isRequired
          label="Plataforma"
          {...register("plataforma", { required: true })}
        />
        <Input label="Contraseña" name="clave" {...register("clave", {})} />
        <Button type="submit">Guardar</Button>
      </form>
    </>
  );
}
