type UserSessionEntityProps = {
  providerId: string;
  providerUserId: string;
  userId: string;
};

export class UserSessionEntity {
  private props: UserSessionEntityProps;

  constructor(props: UserSessionEntityProps) {
    this.props = props;
  }

  get providerId() {
    return this.props.providerId;
  }

  get providerUserId() {
    return this.props.providerUserId;
  }

  get userId() {
    return this.props.userId;
  }
}
