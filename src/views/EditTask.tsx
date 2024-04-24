import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteTask, updateTask, getTaskById } from '../lib/apiWrapper';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { CategoryType, TaskFormDataType, UserType } from '../types';


type EditTaskProps = {
    flashMessage: (message:string, category:CategoryType) => void
    currentUser: UserType|null
}

export default function EditTask({ flashMessage, currentUser }: EditTaskProps) {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [taskToEditData, setTaskToEditData] = useState<TaskFormDataType>({title: '', description: ''})
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    
    useEffect( () => {
        async function getTask(){
            const response = await getTaskById(taskId!)
            if (response.data){
                const task = response.data
                const currentUser = JSON.parse(localStorage.getItem('currentUser')|| '{}')
                if (currentUser?.id !== task.author.id){
                    flashMessage('You do not have permission to edit this post', 'danger');
                    navigate('/')
                } else {
                    setTaskToEditData({title:task.title, description: task.description})
                }
            } else if(response.error){
                flashMessage(response.error, 'danger');
                navigate('/')
            } else {
                flashMessage("Something went wrong", 'warning')
                navigate('/')
            }
        }

        getTask()
    }, [taskId, currentUser, flashMessage, navigate] )

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskToEditData({...taskToEditData, [event.target.name]:event.target.value })
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const response = await updateTask(token!, taskId!, taskToEditData);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            flashMessage(`${response.data?.title} has been updated`, 'success');
            navigate('/')
        }
    }

    const handleDeleteClick = async () => {
        const token = localStorage.getItem('token');
        const response = await deleteTask(token!, taskId!);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            flashMessage(`${response.data}`, 'primary')
            navigate('/')
        }
    }

    return (
        <>
            <Card className='my-3'>
                <Card.Body>
                    <h3 className="text-center">Edit Post</h3>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Label>Task Title</Form.Label>
                        <Form.Control name='title' placeholder='Edit Task Title' value={taskToEditData.title} onChange={handleInputChange} />
                        <Form.Label>Task Description</Form.Label>
                        <Form.Control as='textarea' name='description' placeholder='Edit Task Descrition' value={taskToEditData.description} onChange={handleInputChange} />
                        <Button className='mt-3 w-50' variant='info' type='submit'>Edit Task</Button>
                        <Button className='mt-3 w-50' variant='danger' onClick={openModal}>Delete Task</Button>
                    </Form>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {taskToEditData.title}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {taskToEditData.title}? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                    <Button variant='danger' onClick={handleDeleteClick}>Delete Post</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}