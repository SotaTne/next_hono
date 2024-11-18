import { GeneratedAlways } from "kysely";

export interface Database {
  user: UserTable;
  session: SessionTable;
  oauth_account: OAuthAccountTable;
  todo: TodoTable;
}

export interface UserTable {
  id: string;
  name: string;
}

export interface OAuthAccountTable {
  provider_id: string;
  provider_user_id: string;
  user_id: string;
}

export interface SessionTable {
  id: string;
  expires_at: Date;
  user_id: string;
}

export interface TodoTable {
  id: GeneratedAlways<string>;
  title: string;
  completed: boolean;
  public: boolean;
  user_id?: string;
}
