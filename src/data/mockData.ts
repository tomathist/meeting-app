import { User, RoomMember, Room, RoomSize, Match, ChatThread, ChatMessage } from '@/types';

export const currentUser: User = {
  id: 'user-1',
  name: '김민지',
  birthDate: '1999-03-15',
  gender: 'female',
  area: '서울 강남',
  school: '서울대학교',
  department: '경영학과',
  bio: '음악과 맛집 탐방을 좋아해요 🎵🍽️',
  schoolEmail: 'minji@snu.ac.kr',
  phoneNumber: '010-1234-5678',
  phoneVerified: true,
  schoolVerified: true,
  createdAt: '2024-01-01',
};

export const mockUsers: User[] = [
  currentUser,
  {
    id: 'user-2',
    name: '이수진',
    birthDate: '1999-07-22',
    gender: 'female',
    area: '서울 강남',
    school: '연세대학교',
    department: '심리학과',
    bio: '영화랑 카페 좋아해요 ☕🎬',
    schoolEmail: 'sujin@yonsei.ac.kr',
    phoneNumber: '010-2345-6789',
    phoneVerified: true,
    schoolVerified: true,
    createdAt: '2024-01-02',
  },
  {
    id: 'user-3',
    name: '박지현',
    birthDate: '2000-01-10',
    gender: 'female',
    area: '서울 홍대',
    school: '고려대학교',
    department: '미디어학과',
    bio: '여행과 사진 찍는 걸 좋아해요 📸✈️',
    schoolEmail: 'jihyun@korea.ac.kr',
    phoneNumber: '010-3456-7890',
    phoneVerified: true,
    schoolVerified: true,
    createdAt: '2024-01-03',
  },
  {
    id: 'user-4',
    name: '정우성',
    birthDate: '1998-05-20',
    gender: 'male',
    area: '서울 강남',
    school: '서울대학교',
    department: '컴퓨터공학과',
    bio: '운동과 게임 좋아합니다 💪🎮',
    schoolEmail: 'woosung@snu.ac.kr',
    phoneNumber: '010-4567-8901',
    phoneVerified: true,
    schoolVerified: true,
    createdAt: '2024-01-04',
  },
  {
    id: 'user-5',
    name: '강동원',
    birthDate: '1998-09-12',
    gender: 'male',
    area: '서울 강남',
    school: '연세대학교',
    department: '경제학과',
    bio: '맛집 탐방하는 거 좋아해요 🍕',
    schoolEmail: 'dongwon@yonsei.ac.kr',
    phoneNumber: '010-5678-9012',
    phoneVerified: true,
    schoolVerified: true,
    createdAt: '2024-01-05',
  },
  {
    id: 'user-6',
    name: '이준혁',
    birthDate: '1999-11-30',
    gender: 'male',
    area: '서울 홍대',
    school: '홍익대학교',
    department: '시각디자인과',
    bio: '그림 그리고 음악 듣는 걸 좋아해요 🎨🎧',
    schoolEmail: 'junhyuk@hongik.ac.kr',
    phoneNumber: '010-6789-0123',
    phoneVerified: true,
    schoolVerified: true,
    createdAt: '2024-01-06',
  },
];

// Friend list with acceptance status
export interface FriendWithStatus extends User {
  hasAccepted?: boolean;
}

export const friendsList: FriendWithStatus[] = mockUsers
  .filter(u => u.id !== 'user-1')
  .map((user, index) => ({
    ...user,
    hasAccepted: index % 2 === 0,
  }));

// Room member with acceptance status
export interface RoomMemberWithStatus extends RoomMember {
  hasAccepted: boolean;
}

export const myRooms: Room[] = [
  {
    id: 'room-1',
    hostId: 'user-1',
    name: '금요일 강남 미팅',
    introduction: '유쾌하고 재밌는 친구들이에요! 같이 맛있는 거 먹으면서 수다 떨어요 🎉',
    area: '서울 강남',
    preferredAreas: ['서울 강남', '서울 홍대'],
    size: '2:2',
    preferredSizes: ['2:2', '3:3', '4:4'],
    status: 'active',
    members: [
      { userId: 'user-1', user: mockUsers[0], role: 'host', joinedAt: '2024-01-10' },
      { userId: 'user-2', user: mockUsers[1], role: 'participant', joinedAt: '2024-01-10' },
    ],
    createdAt: '2024-01-10',
    expiresAt: '2024-01-13',
  },
  {
    id: 'room-6',
    hostId: 'user-1',
    name: '홍대 주말 미팅',
    introduction: '예술 좋아하는 사람들 모여라~ 같이 전시회 보고 밥 먹어요! 🎨',
    area: '서울 홍대',
    preferredAreas: ['서울 홍대', '서울 신촌'],
    size: '3:3',
    preferredSizes: ['2:2', '3:3'],
    status: 'active',
    members: [
      { userId: 'user-1', user: mockUsers[0], role: 'host', joinedAt: '2024-01-11' },
      { userId: 'user-2', user: mockUsers[1], role: 'participant', joinedAt: '2024-01-11' },
      { userId: 'user-3', user: mockUsers[2], role: 'participant', joinedAt: '2024-01-11' },
    ],
    createdAt: '2024-01-11',
    expiresAt: '2024-01-14',
  },
];

// Members with acceptance status for each room
export const roomMembersWithStatus: Record<string, RoomMemberWithStatus[]> = {
  'room-1': [
    { userId: 'user-1', user: mockUsers[0], role: 'host', joinedAt: '2024-01-10', hasAccepted: true },
    { userId: 'user-2', user: mockUsers[1], role: 'participant', joinedAt: '2024-01-10', hasAccepted: true },
  ],
  'room-6': [
    { userId: 'user-1', user: mockUsers[0], role: 'host', joinedAt: '2024-01-11', hasAccepted: true },
    { userId: 'user-2', user: mockUsers[1], role: 'participant', joinedAt: '2024-01-11', hasAccepted: true },
    { userId: 'user-3', user: mockUsers[2], role: 'participant', joinedAt: '2024-01-11', hasAccepted: false },
  ],
};

export const participatingRooms: Room[] = [
  {
    id: 'room-5',
    hostId: 'user-3',
    area: '서울 홍대',
    size: '3:3',
    status: 'pending',
    members: [
      { userId: 'user-3', user: mockUsers[2], role: 'host', joinedAt: '2024-01-11' },
      { userId: 'user-1', user: mockUsers[0], role: 'participant', joinedAt: '2024-01-11' },
    ],
    createdAt: '2024-01-11',
    expiresAt: '2024-01-14',
  },
];

// Rooms where others have accepted our room (incoming likes)
export interface IncomingLike {
  id: string;
  targetRoomId: string;
  sourceRoom: Room;
  createdAt: string;
}

export const incomingLikes: IncomingLike[] = [
  {
    id: 'like-1',
    targetRoomId: 'room-1',
    sourceRoom: {
      id: 'room-accepted-1',
      hostId: 'user-4',
      introduction: '운동 좋아하는 활발한 친구들! 같이 놀아요 🎳',
      area: '서울 강남',
      preferredAreas: ['서울 강남'],
      size: '2:2',
      preferredSizes: ['2:2'],
      status: 'active',
      members: [
        { userId: 'user-4', user: mockUsers[3], role: 'host', joinedAt: '2024-01-10' },
        { userId: 'user-5', user: mockUsers[4], role: 'participant', joinedAt: '2024-01-10' },
      ],
      createdAt: '2024-01-10',
      expiresAt: '2024-01-13',
    },
    createdAt: '2024-01-11',
  },
  {
    id: 'like-2',
    targetRoomId: 'room-6',
    sourceRoom: {
      id: 'room-accepted-2',
      hostId: 'user-6',
      introduction: '감성 충만한 친구들! 카페 투어 같이해요 ☕',
      area: '서울 홍대',
      preferredAreas: ['서울 홍대', '서울 신촌'],
      size: '3:3',
      preferredSizes: ['2:2', '3:3'],
      status: 'active',
      members: [
        { userId: 'user-6', user: mockUsers[5], role: 'host', joinedAt: '2024-01-09' },
        { userId: 'user-4', user: mockUsers[3], role: 'participant', joinedAt: '2024-01-09' },
        { userId: 'user-5', user: mockUsers[4], role: 'participant', joinedAt: '2024-01-09' },
      ],
      createdAt: '2024-01-09',
      expiresAt: '2024-01-12',
    },
    createdAt: '2024-01-12',
  },
];

export const recommendedRooms: Room[] = [
  {
    id: 'room-2',
    hostId: 'user-4',
    introduction: '운동 좋아하는 활발한 친구들! 볼링이나 당구 치면서 놀아요 🎳',
    area: '서울 강남',
    preferredAreas: ['서울 강남'],
    size: '2:2',
    preferredSizes: ['2:2'],
    status: 'active',
    members: [
      { userId: 'user-4', user: mockUsers[3], role: 'host', joinedAt: '2024-01-10' },
      { userId: 'user-5', user: mockUsers[4], role: 'participant', joinedAt: '2024-01-10' },
    ],
    createdAt: '2024-01-10',
    expiresAt: '2024-01-13',
  },
  {
    id: 'room-3',
    hostId: 'user-5',
    introduction: '맛집 투어 좋아하는 식도락가들입니다 🍕 같이 맛있는 거 먹어요!',
    area: '서울 강남',
    preferredAreas: ['서울 강남', '서울 성수'],
    size: '2:2',
    preferredSizes: ['2:2', '3:3'],
    status: 'active',
    members: [
      { userId: 'user-5', user: mockUsers[4], role: 'host', joinedAt: '2024-01-09' },
      { userId: 'user-6', user: mockUsers[5], role: 'participant', joinedAt: '2024-01-09' },
    ],
    createdAt: '2024-01-09',
    expiresAt: '2024-01-12',
  },
  {
    id: 'room-4',
    hostId: 'user-6',
    introduction: '디자인이랑 예술 좋아하는 감성 충만 친구들! 전시회나 카페 투어 가요 ☕',
    area: '서울 강남',
    preferredAreas: ['서울 강남', '서울 홍대'],
    size: '2:2',
    preferredSizes: ['2:2'],
    status: 'active',
    members: [
      { userId: 'user-6', user: mockUsers[5], role: 'host', joinedAt: '2024-01-08' },
      { userId: 'user-4', user: mockUsers[3], role: 'participant', joinedAt: '2024-01-08' },
    ],
    createdAt: '2024-01-08',
    expiresAt: '2024-01-11',
  },
];

export const pendingInvitations: import('@/types').Invitation[] = [
  {
    id: 'inv-1',
    roomId: 'room-new',
    room: {
      id: 'room-new',
      hostId: 'user-2',
      area: '서울 신촌',
      size: '2:2',
      status: 'pending',
      members: [
        { userId: 'user-2', user: mockUsers[1], role: 'host', joinedAt: '2024-01-12' },
      ],
      createdAt: '2024-01-12',
      expiresAt: '2024-01-15',
    },
    inviterId: 'user-2',
    inviteeId: 'user-1',
    status: 'pending',
    createdAt: '2024-01-12',
  },
];

// Mock matches for chat
export const mockMatches: Match[] = [
  {
    id: 'match-1',
    room1Id: 'room-1',
    room2Id: 'room-accepted-1',
    room1: myRooms[0],
    room2: incomingLikes[0].sourceRoom,
    status: 'active',
    createdAt: '2024-01-12',
  },
];

// Mock chat messages
export const mockChatMessages: Record<string, ChatMessage[]> = {
  'match-1': [
    {
      id: 'msg-1',
      matchId: 'match-1',
      senderId: 'user-4',
      senderName: '정우성',
      content: '안녕하세요! 매칭 감사합니다 ㅎㅎ',
      createdAt: '2024-01-12T10:00:00',
    },
    {
      id: 'msg-2',
      matchId: 'match-1',
      senderId: 'user-1',
      senderName: '김민지',
      content: '안녕하세요~ 반가워요! 언제 시간 되세요?',
      createdAt: '2024-01-12T10:05:00',
    },
    {
      id: 'msg-3',
      matchId: 'match-1',
      senderId: 'user-4',
      senderName: '정우성',
      content: '저희는 이번 주 금요일 저녁 괜찮은데 어떠세요?',
      createdAt: '2024-01-12T10:10:00',
    },
  ],
};

export const mockChatThreads: ChatThread[] = mockMatches.map(match => ({
  id: match.id,
  matchId: match.id,
  match,
  messages: mockChatMessages[match.id] || [],
  participants: [...match.room1.members, ...match.room2.members],
  lastMessage: mockChatMessages[match.id]?.[mockChatMessages[match.id].length - 1],
  createdAt: match.createdAt,
  lastMessageAt: mockChatMessages[match.id]?.[mockChatMessages[match.id].length - 1]?.createdAt,
}));
