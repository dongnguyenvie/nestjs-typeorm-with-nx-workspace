export class PublishEvent {
  static eventNm = 'pubsub.publish';
  constructor(public trigger: string, public payload?: any) {}
}
