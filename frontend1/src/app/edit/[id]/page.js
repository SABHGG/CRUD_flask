"use client";

import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";


export default function Edit() {
  const { id } = useParams();
  const [data, setData] = useState({ usuario: "", plataforma: "" });
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (id) {
      // Solo hacer el fetch cuando `id` esté disponible
      const fetchData = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/baul/${id}`);
          const result = await res.json();
          setData({ usuario: result.usuario, plataforma: result.plataforma });
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const onSubmit = async (data) => {
    try {
      const promise = fetch(`${process.env.NEXT_PUBLIC_API_URL}/baul/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      toast.promise(promise, {
        loading: "Loading...",
        success: async (res) => {
          const result = await res.json(); // Espera la resolución de la promesa y convierte la respuesta
          return result.message; // Devuelve el mensaje de éxito para el toast
        },
        error: "Error actualizando los datos", // Mensaje de error si la promesa falla
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
          defaultValue={data.usuario}
          {...register("usuario", { required: true })}
        />
        <Input
          isRequired
          label="Plataforma"
          defaultValue={data.plataforma}
          {...register("plataforma", { required: true })}
        />
        <Input
          label="Contraseña"
          name="clave"
          id="clave"
          {...register("clave", {})}
        />
        <Button type="submit">Guardar</Button>
      </form>
    </>
  );
}
