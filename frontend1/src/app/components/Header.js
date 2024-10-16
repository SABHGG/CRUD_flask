import Link from "next/link";
import { Button } from "@nextui-org/button";
export default function Header() {
  return (
    <header className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">CRUD con Flask: SABHGG</h1>
      <p className="text-lg">
        Crea, lee, actualiza y elimina datos de un servidor Flask
      </p>
      <div className="flex gap-4">
        <Link href="/create ">
            <Button>Crear Registro</Button>
        </Link>
      </div>
    </header>
  );
}
