export default function Page({ eventIds }: { eventIds: { eventId: string } }) {
  return (
    <div>
      <h1>eventId: {"{eventIds.eventId}"}</h1>
      <p>This is a dynamic route for eventId with value {"{eventIds.eventId}"}.</p>
    </div>
  );
}