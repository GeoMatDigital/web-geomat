export interface MessageModel {
  id: number;
  type: MessageType;
  title: string;
  text: string;
  valid_from: Date;
  valid_to: Date | null;
  unread: boolean;
}

export enum MessageType {
  Changelog = 'CL',
  Series = 'SE',
  Notice = 'SE',
}
