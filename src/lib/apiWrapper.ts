import axios from 'axios';
import { UserType, TokenType, TaskType } from '../types/index';

const baseURL = 'https://kekambus-tasklist.onrender.com';
const userEndpoint = '/users';
const tokenEndpoint = '/token';
const taskEndpoint = '/tasks';

const apiClientNoAuth = ()=> axios.create({
    baseURL: baseURL,
});
const apiClientBasicAuth = (username: string, password: string) => axios.create({
    baseURL: baseURL,
    headers: {
        'Authorization': 'Basic ' + btoa(username + ':' + password)
    }   
});
const apiClientTokenAuth =(token: string)=> axios.create({
    baseURL: baseURL,
    headers: {
        'Authorization': 'Bearer ' + token
    }
});
type APIResponse<T> = {
    data?: T;
    error?: string;
}
async function register(newUserData:UserFormDataType): Promise<APIResponse<UserType>> {
    let data;
    let error;
    try{
        const response = await apiClientNoAuth().post(userEndpoint, newUserData);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}
async function login(username: string, password: string): Promise<APIResponse<TokenType>> {
    let data;
    let error;
    try{
        const response = await apiClientBasicAuth(username, password).get(tokenEndpoint);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}
async function getMe(token: string): Promise<APIResponse<UserType>> {
    let data;
    let error;
    try{
        const response = await apiClientTokenAuth(token).get(userEndpoint + '/me');
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}   
async function getAllTasks(): Promise<APIResponse<TaskType[]>> {
    let data;
    let error;
    try{
        const response = await apiClientNoAuth().get(taskEndpoint);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.message
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}

async function createTask(token: string, newTaskData:TaskFormDataType): Promise<APIResponse<TaskType>> {
    let data;
    let error;
    try{
        const response = await apiClientTokenAuth(token).post(taskEndpoint, newTaskData);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}
async function updateTask(token: string, taskId: string, updatedTaskData:TaskFormDataType): Promise<APIResponse<TaskType>> {
    let data;
    let error;
    try{
        const response = await apiClientTokenAuth(token).put(taskEndpoint + '/' + taskId, updatedTaskData);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}
async function deleteTask(token: string, taskId: string): Promise<APIResponse<TaskType>> {
    let data;
    let error;
    try{
        const response = await apiClientTokenAuth(token).delete(taskEndpoint + '/' + taskId);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}
async function updateUserData(token: string, updatedUserData:UserFormDataType): Promise<APIResponse<UserType>> {
    let data;
    let error;
    const convertUserData = {
        "first_name": updatedUserData.firstName,
        "last_name": updatedUserData.lastName,
        "email": updatedUserData.email,
        "username": updatedUserData.username,
        "password": updatedUserData.password,
    }
    try{
        const response = await apiClientTokenAuth(token).put(userEndpoint, convertUserData);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}

async function deleteUserData(token: string): Promise<APIResponse<string>> {
    let data;
    let error;
    try{
        const response = await apiClientTokenAuth(token).delete(userEndpoint);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return { data, error }
}
export {
    register,
    login,
    getMe,
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    deleteUserData,
    updateUserData
}