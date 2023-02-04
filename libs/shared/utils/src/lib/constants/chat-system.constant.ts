export const EVENT_ROOM_SERVER = {
  joinRoom: 'room:join',
  leaveRoom: 'room:leave',
  call: 'room:call',
  peerToPeer: 'room:peer-to-peer:message',
  syncUserState: 'room:sync-user-state',
  message: 'message',
};

export const EVENT_ROOM_CLIENT = {
  joinRoom: 'room:transporter:register',
  leaveRoom: 'room:transporter:leave',
  callingComing: 'room:transporter:call',
  callScreen: 'room:transporter:callScreen',
  settings: 'room:settings',
  peerToPeer: 'room:transporter:peer-to-peer:message',
  syncUserState: 'room:transporter:sync-user-state',
  message: 'room:transporter:message',
};

export const EVENT_ROOM_PERSONAL_CLIENT = {
  accessable: 'room:transporter:personal:accessable',
  allUsers: 'room:personal:all-users',
};

export const EVENT_MESSAGE_SERVER = {
  message: 'message',
};
export const EVENT_MESSAGE_CLIENT = {
  roomMessage: 'transporter:message',
};

export const PREFIX_SOCKET = 'socketids:';

export const USER_ACCESSABLE = {
  waiting: 0,
  accepted: 1,
  full: 2,
  rejected: 3,
  duplicateUser: 4,
};
