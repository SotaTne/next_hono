import { ITodoInfra } from "@server/src/domain/interface/db/todo.infra.interface";
import { DBAbstract } from "./db.abstract";
import { PrismaClient, Todo } from "@prisma/client";
import { TodoEntity } from "@server/src/domain/entity/todo.entity";
import { HTTPException } from "hono/http-exception";
import { injectable } from "tsyringe";

@injectable()
export class TodoInfra extends DBAbstract implements ITodoInfra {
  prisma: PrismaClient | null = null;

  async getUserTodos(userId: string): Promise<TodoEntity[]> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error",
        });
      }
      return (
        await this.prisma.todo.findMany({
          where: {
            userId,
          },
        })
      ).map((todo) => this.toEntity(todo));
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error",
      });
    }
  }
  async getAllowedAllTodos(userId?: string | null): Promise<TodoEntity[]> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error",
        });
      }
      const todos = await this.prisma.todo.findMany(
        {
          where: {
            OR: [
              {
                isPrivate: false,
              },
              {
                isPrivate: true,
                userId,
              },
            ],
          }
        }
      );
      if (!todos) {
        return [];
      }
      return todos.map((todo) => this.toEntity(todo));
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error",
      });
    }
  }
  async getTodoById(todoId: string): Promise<TodoEntity | null> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error",
        });
      }
      const todo = await this.prisma.todo.findFirst({
        where: {
          id: todoId,
        },
      });
      if (!todo) {
        return null;
      }
      return this.toEntity(todo);
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error",
      });
    }
  }
  async createTodo({
    userId,
    title,
    creator,
    isPrivate,
  }: {
    userId?: string | null;
    title: string;
    creator: string;
    isPrivate?: boolean | null;
  }): Promise<TodoEntity> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error",
        });
      }
      return this.toEntity(
        await this.prisma.todo.create({
          data: {
            userId: userId ?? null,
            title,
            creator,
            isPrivate: isPrivate ?? false,
          },
        }),
      );
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error",
      });
    }
  }
  async updateTodo({
    todoId,
    title,
    completed,
    isPrivate,
    userId,
  }: {
    todoId: string;
    title?: string | undefined;
    completed?: boolean | undefined;
    isPrivate?: boolean | undefined;
    userId?: string | undefined;
  }): Promise<TodoEntity> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error",
        });
      }
      return this.toEntity(
        await this.prisma.todo.update({
          where: {
            id: todoId,
            OR: [
              {
                isPrivate: false,
              },
              {
                isPrivate: true,
                userId,
              },
            ],
          },
          data: {
            title,
            completed,
            isPrivate,
          },
        }),
      );
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error",
      });
    }
  }
  async deleteTodo({
    todoId,
    userId,
  }: {
    todoId: string;
    userId?: string | undefined;
  }): Promise<void> {
    try {
      if (!this.prisma) {
        throw new HTTPException(500, {
          message: "Internal Server Error",
        });
      }
      await this.prisma.todo.delete({
        where: {
          id: todoId,
          OR: [
            {
              isPrivate: false,
            },
            {
              isPrivate: true,
              userId,
            },
          ],
        },
      });
    } catch (e) {
      console.error(e);
      throw new HTTPException(500, {
        message: "Internal Server Error",
      });
    }
  }

  private toEntity(todo: Todo): TodoEntity {
    return new TodoEntity({
      id: todo.id,
      userId: todo.userId,
      title: todo.title,
      isPrivate: todo.isPrivate,
      completed: todo.completed,
      creator: todo.creator,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  }
}
