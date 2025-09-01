export default function Page({ userIds }: { userIds: { userId: string } }) {
  return (
    <div>
      <h1>userId: {"{userIds.userId}"}</h1>
      <p>This is a dynamic route for userId with value {"{userIds.userId}"}.</p>
    </div>
  );
}