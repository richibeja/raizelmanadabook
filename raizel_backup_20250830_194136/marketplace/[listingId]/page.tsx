export default function Page({ listingIds }: { listingIds: { listingId: string } }) {
  return (
    <div>
      <h1>listingId: {"{listingIds.listingId}"}</h1>
      <p>This is a dynamic route for listingId with value {"{listingIds.listingId}"}.</p>
    </div>
  );
}