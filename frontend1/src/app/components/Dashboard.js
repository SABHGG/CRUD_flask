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
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = await fetch("http://127.0.0.1:5000");
        const res = await request.json();
        setData(res);
      } catch {
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
                            fetch(`http://127.0.0.1:5000/baul/${post.id}`, {
                              method: "DELETE",
                            }),
                            {
                              loading: "Eliminando...",
                              success: async (res) => {
                                const result = await res.json();
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
