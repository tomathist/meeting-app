import { useMemo } from 'react';
import { myRooms, participatingRooms, roomMembersWithStatus, incomingLikes } from '@/data/mockData';
import { Room } from '@/types';

export interface RoomWithRole {
  room: Room;
  isHost: boolean;
}

export function useMyRooms() {
  // All rooms I'm part of (hosting or participating)
  const allRooms = useMemo<RoomWithRole[]>(() => [
    ...myRooms.map(room => ({ room, isHost: true })),
    ...participatingRooms.map(room => ({ room, isHost: false })),
  ], []);

  // Active rooms where I'm the host (for Discover tabs)
  const activeHostRooms = useMemo(() => 
    myRooms.filter(r => r.status === 'active' && r.hostId === 'user-1'),
  []);

  // Get room by ID
  const getRoomById = (roomId: string) => 
    allRooms.find(r => r.room.id === roomId);

  // Get members with status for a room
  const getRoomMembersWithStatus = (roomId: string) => {
    const room = allRooms.find(r => r.room.id === roomId)?.room;
    if (!room) return [];
    return roomMembersWithStatus[roomId] || room.members.map(m => ({ ...m, hasAccepted: true }));
  };

  // Get incoming likes for a room
  const getIncomingLikes = (roomId: string) =>
    incomingLikes.filter(like => like.targetRoomId === roomId);

  return {
    allRooms,
    activeHostRooms,
    getRoomById,
    getRoomMembersWithStatus,
    getIncomingLikes,
  };
}
