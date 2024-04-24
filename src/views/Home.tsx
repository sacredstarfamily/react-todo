import { useEffect, useState } from 'react';
import { UserType, TaskType, TaskFormDataType, TaskDataFormType } from '../types/index';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { getAllTasks, createTask} from '../lib/apiWrapper';

type Homeprops = {
    isLoggedIn: boolean;
    currentUser: UserType | null;
    flashMessage: (newMessage:string|undefined, newCategory:CategoryType|undefined) => void;
}

export default function Home({isLoggedIn, currentUser, flashMessage}:  Homeprops) {
    const [showForm, setShowForm] = useState(false);
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [fetchTasks, setFetchTasks] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(()=>{
        async function fetchTasksData(){
            const response = await getAllTasks();
            if (response.data){
                console.log(response.data)
                setTasks(response.data);
            } else {
                console.log(response.error);
            }
        }
        fetchTasksData();
    }, [fetchTasks]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

        const sortFunctions:Sorting = {
            idAsc: (a:TaskType, b:TaskType) => a.id - b.id,
            idDesc: (a:TaskType, b:TaskType) => b.id - a.id,
            titleAsc: (a:TaskType, b:TaskType) => a.title > b.title ? 1 : -1,
            titleDesc: (a:TaskType, b:TaskType) => b.title > a.title ? 1 : -1
        }
        const func = sortFunctions[e.target.value as keyof Sorting];
        const newSortedArr = [...tasks].sort(func);
        setTasks(newSortedArr);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }
    const addNewTask = async (newTaskData:TaskDataFormType) => {
        const token = localStorage.getItem('token');
        const response = await createTask(token, newTaskData);
        if(response.error){
         flashMessage(response.error, 'danger')
        } else {
         console.log(response);
         flashMessage(`${response.data!.title} has been added`, 'success');
         setShowForm(false);
         setFetchTasks(!fetchTasks);
        }
     }
  return (
    <>
      <h1>Task List</h1>
      <Row>
      <Col xs={12} md={6}>
                <Form.Control value={searchTerm} placeholder='Search Posts' onChange={handleInputChange} />
            </Col>
           
            <Col>
                <Form.Select onChange={handleSelectChange}>
                    <option>Choose Sorting Option</option>
                    <option value="idAsc">Sort By ID ASC</option>
                    <option value="idDesc">Sort By ID DESC</option>
                    <option value="titleAsc">Sort By Title ASC</option>
                    <option value="titleDesc">Sort By Title DESC</option>
                </Form.Select>
            </Col>
            
        <Col>
       
          {isLoggedIn && <Button onClick={()=>{setShowForm(!showForm)}}>Create Task</Button>}
          {showForm && <TaskForm addNewTask={addNewTask}  />}
            
        </Col>
      </Row>
       <Row>
        {tasks.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map( p => <TaskCard key={p.id} task={p} currentUser={currentUser} /> )}
       </Row>
    </>
  );
}
