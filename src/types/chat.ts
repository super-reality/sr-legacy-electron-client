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
  groupName: string;
  groupPhoto?: string;
  _id: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  users: string[];
  channels: [];
}

export interface Category {
  _id: string;
  groupId: string;
  categoryName: string;
  channels: string[];
}

export interface CategorySettings {
  categoryName?: string;
  categoryPhoto?: string;
  channels?: string[];
}

export interface Channel {
  channelName: string;
  channelPhoto?: string;
  categoryId: string;
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

export interface ChannelSettings {
  channelName?: string;
  channelPhoto?: string;
  users?: ChatUser[];
  categoryId?: string;
}

export interface Message {
  _id: string;
  channelId: string;
  text: string;
  userId: string;
  createdAt: string;
  user: ChatUser;
}

// export interface ChatLoginData {}
