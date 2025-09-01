import React from 'react';

interface PostProps {
    author: string;
    content: string;
}

export default function PostCard({ author, content }: PostProps) {
    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '15px',
            backgroundColor: '#f9f9f9'
        }}>
            <strong>{author}</strong>
            <p>{content}</p>
            <div style={{ marginTop: '10px' }}>
                <button style={{ marginRight: '10px' }}>?? Me gusta</button>
                <button>?? Comentar</button>
            </div>
        </div>
    );
}
