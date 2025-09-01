export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>ID de Adopción: {params.id}</h1>
      <p>Mostrando los detalles para la adopción con el ID: {params.id}.</p>
    </div>
  );
}