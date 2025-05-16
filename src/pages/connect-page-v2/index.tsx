import { useEffect, useState } from 'react';
import socket from '../../lib/socket';

const ConnectPageV2 = () => {
  const user = localStorage.getItem('user');
  const userId = JSON.parse(user || '{}')?.user_id;
  useEffect(() => {
    if (!userId) return;
    socket.on('connect', () => {
      console.log('✅ Connected to socket (on connect event):', socket.id);
      socket.emit('joinRoom', { userId });
    });

    socket.on('fb-sync', (data) => {
      console.log('📥 FB Sync Event:', data);
      alert(data.message);
    });

    return () => {
      socket.off('connect');
      socket.off('fb-sync');
    };
  }, [userId]);

  return (
    <div
      onClick={() => {
        socket.emit('joinRoom', {
          userId,
          data: {
            message: 'Hello from client',
          },
        });
      }}
    >
      hello
    </div>
  );
};

export default ConnectPageV2;
