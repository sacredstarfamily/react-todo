export type UserType = {
    id?:number |undefined,
    firstName?:string | undefined,
    lastName?:string | undefined,
    username?:string | undefined,
    email?:string|undefined,
    dateCreated?:string|undefined
}
export type UserFormDataType = {
    first_name:string|undefined,
    last_name:string|undefined,
    email:string|undefined,
    username:string|undefined,
    password?:string|undefined,
    confirmPassword?:string|undefined
}
export type TaskFormDataType = {
    title: string,
    description: string
}
export type TaskType = {
    author: UserType,
    completed: boolean,
    created_at: string,
    description: string,
    due_date:string | null,
    id: number,
    title: string
}
export type CategoryType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

export type TokenType = {
    token:string,
    tokenExpiration:string
}