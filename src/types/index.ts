export type UserType = {
    id:number,
    firstName:string,
    lastName:string,
    username:string,
    email:string,
    dateCreated:string
}
export type UserFormDataType = {
    first_name:string,
    last_name:string,
    email:string,
    username:string,
    password:string,
    confirmPassword:string
}
export type TaskDataFormType = {
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