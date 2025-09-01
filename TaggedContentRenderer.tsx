'use client';

import Link from 'next/link';

interface TaggedContentRendererProps {
  content: string;
  taggedUsers: { userId: string; displayName: string; }[];
}

export default function TaggedContentRenderer({ content, taggedUsers }: TaggedContentRendererProps) {
  if (!taggedUsers || taggedUsers.length === 0) {
    return <p>{content}</p>;
  }

  const parts = content.split(/(@\w+)/g);

  return (
    <p>
      {parts.map((part, index) => {
        if (part.startsWith('@')) {
          const username = part.substring(1);
          const taggedUser = taggedUsers.find(u => u.displayName === username);
          if (taggedUser) {
            return <Link key={index} href={`/profile/${taggedUser.userId}`} className="tagged-user-link">{part}</Link>;
          }
        }
        return part;
      })}
    </p>
  );
}
