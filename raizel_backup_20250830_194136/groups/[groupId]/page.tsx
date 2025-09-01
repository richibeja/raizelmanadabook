export default function Page({ groupIds }: { groupIds: { groupId: string } }) {
  return (
    <div>
      <h1>groupId: {"{groupIds.groupId}"}</h1>
      <p>This is a dynamic route for groupId with value {"{groupIds.groupId}"}.</p>
    </div>
  );
}