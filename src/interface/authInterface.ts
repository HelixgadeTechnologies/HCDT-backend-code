export interface IAuth {
    id: number
    name: string
    password: string
    email: string
    createAt: string
    updateAt: string
}

export interface ILogin {
    email: string;
    password: string;
  }