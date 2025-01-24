import { GoPencil, GoTrash } from 'react-icons/go'
import './App.css'
import { useEffect, useState } from 'react'
import AddToDoModal from './Components/AddToDoModal'
import Notif from './Components/Notif'
import { FaArrowDown } from 'react-icons/fa'
import localStorageHelper from './helper/localStorageHelper'

export type ToDoListProp = {
  name: string,
  status: ToDoListStatus
}
const ToDoListData: ToDoListProp[] = [];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [addNewToDoList, setAddNewToDoList] = useState<{status: boolean, data: ToDoListProp, mode: 'Add' | 'Edit', updatedIndex?: number}>({
    data: {
      name: '',
      status: 'Ongoing'
    },
    status: false,
    mode: 'Add',
  });
  const [currentMode, setCurrentMode] = useState<'Add' | 'Edit'>('Add');
  const [defaultToDoListModalValue, setDefaultToDoListModalValue] = useState<{data: ToDoListProp, selectedIndex: number}>({
    data: {
      name: '',
      status: 'Ongoing'
    },
    selectedIndex: 0
  })

  const openAddModal = () => {
    setCurrentMode('Add');
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

  const AddToDoListData = (value: ToDoListProp, mode: 'Add' | 'Edit', updatedIndex? : number) => {
    setAddNewToDoList({
      data: value,
      status: true,
      mode: mode,
      updatedIndex: mode === 'Edit' ? updatedIndex : 0
    });
  };

  const handleEditModal = (value: ToDoListProp, selectedIndex: number) => {
    setCurrentMode('Edit');
    setDefaultToDoListModalValue({data: value, selectedIndex: selectedIndex});
    setIsModalOpen(true);
    
  };

  const resetMutationMode = () => {
    setAddNewToDoList({
      data: {
        name: '',
        status: 'Ongoing'
      },
      status: false,
      mode: 'Add',
    })
  }

  return (
    <div className='grid h-screen place-items-center'>
      <p className='text-5xl text-center'>To Do List</p>
        <ToDoListBoard mutateToDoList={addNewToDoList} requestOpenModal={handleEditModal} onCompleteMutate={resetMutationMode}/>
      <button 
        className='bg-red-400 text-3xl py-4 px-12 rounded hover:bg-red-600 cursor-pointer'
        onClick={openAddModal}
      >
        Add
      </button>
      <AddToDoModal isOpen={isModalOpen} requestCloseModal={closeModal} requestOpenNotif={openNotif} inputtedTodoList={AddToDoListData} mode={currentMode} defaultValue={{data: defaultToDoListModalValue.data, selectedIndex: defaultToDoListModalValue.selectedIndex}}/>

      <Notif text='Success' requestCloseNotif={closeNotof} isOpen={isNotifOpen}/>
    </div>
  )
};

type ToDoListBoardProp = {
  mutateToDoList: {status: boolean, data: ToDoListProp, mode: 'Add' | 'Edit', updatedIndex?: number};
  requestOpenModal: (value: ToDoListProp, selectedIndex: number) => void,
  onCompleteMutate: () => void
}
const ToDoListBoard = ({ mutateToDoList, requestOpenModal, onCompleteMutate} : ToDoListBoardProp) => {
  const [list, setList] = useState<ToDoListProp[]>([]);

  const changeToDoListListStatus = (index: number) => {

    setList((prev) => {
      return prev.map((todoList, i) => i === index ? {...todoList, status: todoList.status === 'Done' ? 'Ongoing' : 'Done'} : todoList);
    });
  };

  const removeToDoList = (index: number) => {
    setList(() => {
      const newList = list.filter((_, i) => index !== i);
      localStorageHelper().saveToDoList(newList);
      return newList;
    })
  }

  useEffect(() => {
    const savedData = localStorageHelper().getToDoList();
    if(savedData)
      setList(JSON.parse(savedData));
    else
      setList(ToDoListData);
  }, []);

  useEffect(() => {
    if(mutateToDoList.status === true){
      if(mutateToDoList.mode === 'Add'){
        setList(() => {
          const newList = [...list, { name: mutateToDoList.data.name, status: mutateToDoList.data.status }]
          localStorageHelper().saveToDoList(newList);
          return newList
        });
      }
      else{
        setList(prev => {
          const updtedList =  prev.map((todoList, index) => index === mutateToDoList.updatedIndex ? {...todoList, name: mutateToDoList.data.name} : todoList);
          localStorageHelper().saveToDoList(updtedList);
          return updtedList;
        });
      };

      onCompleteMutate();
    }
  }, [mutateToDoList.status])

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
              requestEditToDoList={() => requestOpenModal(toDoList, index)}
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
  requestDeleteToDoList: () => void,
  requestEditToDoList: () => void,
}
const ToDoListListComponent = ({name, status, onToggleStatus, requestDeleteToDoList, requestEditToDoList} : ToDoListListComponentProp) => {
  const handleOnClick = () => {
    onToggleStatus();
  };

  const onDeleteClicked = () => {
    requestDeleteToDoList();
  };

  const onEditClicked = () => {
    requestEditToDoList();
  }

  return (
    <div className='flex justify-between items-center min-w-sm'>
      <input type='checkbox' onChange={handleOnClick} checked={status === 'Done' ? true : false}/>
      <li className={`${status === 'Done' ? 'line-through' : ''} text-4xl`}>{name}</li>
      <div className='flex gap-x-2'>
        <button onClick={onEditClicked}>
          <GoPencil className='text-white text-2xl' width={200} height={200}/>
        </button>
        <button onClick={onDeleteClicked}>
          <GoTrash className='text-white text-2xl' width={200} height={200}/>
        </button>
      </div>
    </div>
  )
}

export default App
