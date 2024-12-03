/**
 * model Todo {
  id        String  @id @default(uuid())
  title     String
  completed Boolean @default(false)
  user      User?   @relation(fields: [userId], references: [id])
  userId    String?
  private   Boolean @default(false)
  crater    String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
 */

type TodoEntityProps = {
  id: string;
  title: string;
  completed: boolean;
  userId: string | null;
  isPrivate: boolean;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
};

export class TodoEntity {
  private props: TodoEntityProps;

  constructor(props: TodoEntityProps) {
    this.props = props;
  }

  static create(props: Omit<TodoEntityProps, "createdAt" | "updatedAt">) {
    return new TodoEntity({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get completed() {
    return this.props.completed;
  }

  get userId() {
    return this.props.userId;
  }

  get isPrivate() {
    return this.props.isPrivate;
  }

  get creator() {
    return this.props.creator;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
