import React, {useEffect, useState} from 'react';
import { UserType, CategoryType, UserFormDataType } from '../types/index';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import {useNavigate} from 'react-router-dom';
import { updateUserData, deleteUserData } from '../lib/apiWrapper';


type ProfileProps = {
    currentUser: UserType|null,
    flashMessage: (newMessage:string|undefined, newCategory:CategoryType|undefined) => void,
    isLoggedIn: boolean,
}
export default function Profile({currentUser, flashMessage}: ProfileProps){
    const [showModal, setShowModal] = useState(false);
    const [newUserData, setNewUserData] = useState<UserType|null>({username: currentUser? currentUser.username : '', email: currentUser?.email, firstName: currentUser?.firstName, lastName: currentUser?.lastName, id: currentUser?.id, dateCreated: currentUser?.dateCreated});
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const navigate = useNavigate();
    useEffect(() => {
        setNewUserData({username: currentUser?.username, email: currentUser?.email, firstName: currentUser?.firstName, lastName: currentUser?.lastName, id: currentUser?.id, dateCreated: currentUser?.dateCreated})
    }, [currentUser])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewUserData({...newUserData, [event.target.name]:event.target.value })
    }
    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const updatedUserData:UserFormDataType = {
            username: newUserData?.username,
            email: newUserData?.email,
            first_name: newUserData?.firstName,
            last_name: newUserData?.lastName
            
        }
        const response = await updateUserData(token!, updatedUserData);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            flashMessage(`${response.data?.firstName} has been updated`, 'success');
            navigate('/')
        }
    }
    const handleDeleteClick = async () => {
        const token = localStorage.getItem('token');
        const response = await deleteUserData(token!);
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
        <h1>Profile</h1>
        <Form onSubmit={handleFormSubmit}>
            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control type='text'name='username' value={newUserData?.username} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' name='email'value={newUserData?.email} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control type='text' name='firstName' value={newUserData?.firstName} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control type='text' name='lastName' value={newUserData?.lastName} onChange={handleInputChange} />
            </Form.Group>
            <Button variant='primary' type='submit'>Update</Button>
            <Button variant='danger' onClick={openModal}>Delete</Button>
        </Form>
        </Card.Body>
        </Card>
        <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {newUserData?.firstName}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {newUserData?.lastName}? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                    <Button variant='danger' onClick={handleDeleteClick}>Delete Post</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}