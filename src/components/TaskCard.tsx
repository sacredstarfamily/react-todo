import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import { TaskType, UserType } from '../types/index';
import {useEffect} from 'react';
type TaskCardProps = {
    task: TaskType,
    currentUser: UserType|null
}

export default function TaskCard({ task, currentUser}: TaskCardProps) {
    useEffect(() => {
        console.log(task);
    }, [task]);
    return (
        <Card className='my-3 bg-custom' text='black'>
            <Card.Header>{ task.author.username }</Card.Header>
            <Card.Body>
                <Card.Title>{ task.title }</Card.Title>
                <Card.Subtitle>{ task.created_at }</Card.Subtitle>
                <Card.Text>{ task.description }</Card.Text>
                {task.author.id === currentUser?.id && <Link to={`/edit/${task.id}`}><Button variant='primary'>Edit Task</Button></Link>}
            </Card.Body>
        </Card>
    )
}