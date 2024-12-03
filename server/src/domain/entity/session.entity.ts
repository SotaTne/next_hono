type SessionEntityProps = {
  providerId: string;
  providerUserId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class SessionEntity {
  private props: SessionEntityProps;

  constructor(props: SessionEntityProps) {
    this.props = props;
  }

  static create(props: Omit<SessionEntityProps, "createdAt" | "updatedAt">) {
    return new SessionEntity({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
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

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
