import { Role } from "./Role";

export interface IUser {
  id?: string;
  username?: string;
  name?: string;
  role?: string;
  email?: string;
  password?: string;
};

export class User {
  id?: string;
  username?: string;
  name?: string;
  role?: string;
  email?: string;
  password?: string;
  constructor({ id, username, name, role, email, password }: IUser = {}) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.email = email;
    this.role = role || "speler";
    this.password = password;
  }

  get isAdministrator() {
    return this.role === "admin";
  }

  get isSpeler() {
    return this.role === "speler" || this.isAdministrator;
  }

  get isKassa() {
    return this.role === "kassa";
  }

  isAuthorised(authorizationRequired: boolean | string | number) {
    switch (authorizationRequired) {
      case true:
        return true;
      case "admin":
      case Role.ADMINISTRATOR:
        return this.isAdministrator;
      case "speler":
      case Role.SPELER:
        return this.isSpeler;
      case "kassa":
      case Role.KASSA:
        return this.isKassa;
    }
  }

  toJSON() {
    const retval: { [key: string]: string | undefined } = {
      username: this.username,
      name: this.name,
      role: this.role,
      email: this.email,
    };
    if (this.id) {
      retval.id = this.id;
    }
    if (this.password) {
      retval.password = this.password;
    }
    return retval;
  }
}
