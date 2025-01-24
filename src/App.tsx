import { GoTrash } from 'react-icons/go'
import './App.css'
import { useEffect, useState } from 'react'
import AddToDoModal from './Components/AddToDoModal'
import Notif from './Components/Notif'
import { FaArrowDown } from 'react-icons/fa'

export type ToDoListProp = {
  name: string,
  status: ToDoListStatus
}
const ToDoListData: ToDoListProp[] = [
 
]

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [addNewToDoList, setAddNewToDoList] = useState<{status: boolean, data: ToDoListProp}>({
    data: {
      name: '',
      status: 'Ongoing'
    },
    status: false
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openNotif = () => {
    setIsNotifOpen(true);
  };

  const closeNotof = () => {
    setIsNotifOpen(false);
  };

  const AddToDoListData = (value: ToDoListProp) => {
    setAddNewToDoList({
      data: value,
      status: true
    })
  }

  return (
    <div className='grid h-screen place-items-center'>
      <p className='text-5xl text-center'>To Do List</p>
        <ToDoListBoard addNewToDoList={addNewToDoList}/>
      <button 
        className='bg-red-400 text-3xl py-4 px-12 rounded hover:bg-red-600 cursor-pointer'
        onClick={openModal}
      >
        Add
      </button>
      <AddToDoModal isOpen={isModalOpen} requestCloseModal={closeModal} requestOpenNotif={openNotif} inputtedTodoList={AddToDoListData}/>

      <Notif text='Success' requestCloseNotif={closeNotof} isOpen={isNotifOpen}/>
    </div>
  )
};

type ToDoListBoardProp = {
  addNewToDoList: {status: boolean, data: ToDoListProp}
}
const ToDoListBoard = ({ addNewToDoList } : ToDoListBoardProp) => {
  const [list, setList] = useState<ToDoListProp[]>([]);

  const changeToDoListListStatus = (index: number) => {

    setList((prev) => {
      return prev.map((todoList, i) => i === index ? {...todoList, status: todoList.status === 'Done' ? 'Ongoing' : 'Done'} : todoList);
    });
  };

  const removeToDoList = (index: number) => {
    setList(list.filter((_, i) => index !== i))
  }

  useEffect(() => {
    setList(ToDoListData);
  }, []);

  useEffect(() => {
    if(addNewToDoList.status === true){
      setList([...list, { name: addNewToDoList.data.name, status: addNewToDoList.data.status }])
    }
  }, [addNewToDoList])

  return(
    <ul className='flex flex-col gap-8'>
        {
          list.length ? 
          list.map((toDoList, index) => 
            <ToDoListListComponent
              key={index}
              name={toDoList.name} 
              status={toDoList.status} 
              onToggleStatus={() => changeToDoListListStatus(index)}
              requestDeleteToDoList={() => removeToDoList(index)}
            />
          ) :
          <div className='flex flex-col items-center'>
            <p>Try adding new list</p>
            <FaArrowDown />
          </div>
        }
    </ul>
  )
}
type ToDoListStatus = 'Done' | 'Ongoing';

type ToDoListListComponentProp = {
  name: string,
  status: ToDoListStatus,
  onToggleStatus: () => void,
  requestDeleteToDoList: () => void
}
const ToDoListListComponent = ({name, status, onToggleStatus, requestDeleteToDoList} : ToDoListListComponentProp) => {
  const handleOnClick = () => {
    onToggleStatus();
  };

  const onDeleteClicked = () => {
    requestDeleteToDoList();
  }

  return (
    <div className='flex justify-between items-center min-w-sm'>
      <input type='checkbox' onChange={handleOnClick} checked={status === 'Done' ? true : false}/>
      <li className={`${status === 'Done' ? 'line-through' : ''} text-4xl`}>{name}</li>
      <button onClick={onDeleteClicked}>
        <GoTrash className='text-white text-2xl' width={200} height={200}/>
      </button>
    </div>
  )
}

export default App
