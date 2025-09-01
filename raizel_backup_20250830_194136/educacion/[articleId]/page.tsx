export default function Page({ articleIds }: { articleIds: { articleId: string } }) {
  return (
    <div>
      <h1>articleId: {"{articleIds.articleId}"}</h1>
      <p>This is a dynamic route for articleId with value {"{articleIds.articleId}"}.</p>
    </div>
  );
}