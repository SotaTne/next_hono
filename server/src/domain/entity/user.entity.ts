type UserEntityProps = {
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  id: string;
  email: string;
};

export class UserEntity {
  private props: UserEntityProps;

  constructor(props: UserEntityProps) {
    this.props = props;
  }

  static create(props: Omit<UserEntityProps, "createdAt" | "updatedAt">) {
    return new UserEntity({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get name() {
    return this.props.name;
  }

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }
}
