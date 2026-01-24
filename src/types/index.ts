export type UserRole = 'host' | 'participant';

export type RoomStatus = 'draft' | 'pending' | 'active' | 'matched' | 'paused' | 'closed';

export type RoomSize = '2:2' | '3:3' | '4:4';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export interface User {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  area: string;
  school: string;
  department?: string;
  bio?: string;
  schoolEmail: string;
  phoneNumber: string;
  phoneVerified: boolean;
  schoolVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface RoomMember {
  userId: string;
  user: User;
  role: UserRole;
  joinedAt: string;
}

export interface Room {
  id: string;
  hostId: string;
  name?: string;
  introduction?: string;
  area: string;
  preferredAreas?: string[];
  size: RoomSize;
  preferredSizes?: RoomSize[];
  status: RoomStatus;
  members: RoomMember[];
  createdAt: string;
  expiresAt: string;
  matchId?: string;
}

export interface Match {
  id: string;
  room1Id: string;
  room2Id: string;
  room1: Room;
  room2: Room;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  chatThreadId?: string;
}

export interface Vote {
  id: string;
  votingRoomId: string;
  targetRoomId: string;
  decision: 'yes' | 'no';
  votedAt: string;
}

export interface Invitation {
  id: string;
  roomId: string;
  room: Room;
  inviterId: string;
  inviteeId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  matchId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  matchId: string;
  match?: Match;
  messages?: ChatMessage[];
  participants: RoomMember[];
  lastMessage?: ChatMessage;
  createdAt: string;
  lastMessageAt?: string;
}
