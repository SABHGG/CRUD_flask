"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import Link from "next/link";
import EditIcon from "@/app/components/icons/EditIcon";
import DeleteIcon from "@/app/components/icons/DeleteIcon";
import { Button } from "@nextui-org/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
        const res = await request.json();
        setData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Table isStriped aria-label="Example static collection table" className="dark">
        <TableHeader>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn>CLAVE</TableColumn>
          <TableColumn>CLAVE</TableColumn>
          <TableColumn>EDITAR</TableColumn>
          <TableColumn>ELIMINAR</TableColumn>
        </TableHeader>
        <TableBody>
          {data.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.usuario}</TableCell>
              <TableCell>{post.plataforma}</TableCell>
              <TableCell>{post.clave}</TableCell>
              <TableCell>
                <Link href={`/edit/${post.id}`}>
                  <EditIcon />
                </Link>
              </TableCell>
              <TableCell>
                <Button
                  isIconOnly
                  onClick={() => {
                    toast("Desea Eliminar este item", {
                      cancel: {
                        label: "Cancelar",
                        onClick: () => {},
                      },
                      action: {
                        label: "Eliminar",
                        onClick: async () => {
                          toast.promise(
                            fetch(`${process.env.NEXT_PUBLIC_API_URL}/baul/${post.id}`, {
                              method: "DELETE",
                            }),
                            {
                              loading: "Eliminando...",
                              success: async (res) => {
                                const result = await res.json();
                                setData(data.filter((item) => item.id !== post.id));
                                return result.message;
                              },
                              error: "Error eliminando el item",

                            }
                          );
                        },
                      },
                    });
                  }}
                >
                  <DeleteIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
