export interface ChatUser {
  _id: string;
  username: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
export interface Group {
  collectiveName: string;
  collectivePhoto?: string;
  _id: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  users: ChatUser[];
  channels: [];
}

export interface Message {
  _id: string;
  text: string;
  userId: string;
  createdAt: string;
  user: ChatUser;
}

export interface Channel {
  channelName: string;
  createdAt: string;
  messages: Message[];
  users: string[];
  __v: number;
  _id: string;
}

export interface ChannelsResult {
  data: Channel[];
  limit: number;
  skip: number;
  total: number;
}
// export interface ChatLoginData {}
