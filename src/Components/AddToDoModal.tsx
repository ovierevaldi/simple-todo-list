import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { ToDoListProp } from "../App";

type AddToDoModalProp = {
    isOpen: boolean,
    requestCloseModal: () => void,
    requestOpenNotif: () => void,
    inputtedTodoList:(data: ToDoListProp, mode: 'Add' | 'Edit', selectedIndex? : number) => void,
    mode: 'Add' | 'Edit',
    defaultValue?: {data: ToDoListProp, selectedIndex: number}
};

const AddToDoModal = ({isOpen, requestCloseModal, requestOpenNotif, inputtedTodoList, mode, defaultValue} : AddToDoModalProp) => {
  const [query, setQuery] = useState('');

  const onModalSubmit = () => {
    requestCloseModal();
    requestOpenNotif();
    inputtedTodoList({name: query, status: 'Ongoing'}, mode, mode === 'Edit' ? defaultValue?.selectedIndex : 0);
  };

  const onCloseBtnClicked = () => {
    setQuery('')
    requestCloseModal();
  }

  return (
    isOpen ? 
    <div className="absolute w-xl rounded-lg bg-white">
        <form className="grid h-[500px] place-items-center">
          <p className="text-black text-2xl">{mode === 'Add' ? 'Add List' : `Edit List ${defaultValue?.data.name}`}</p>
          <div className="flex gap-x-4 items-center">
            <label className="text-black">Name</label>
            <input 
              placeholder="input here" 
              className="bg-black text-white h-10 rounded-lg px-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}  
            />
          </div>
          <button onClick={onModalSubmit} className="bg-black text-white p-2 rounded-lg">Submit</button>
        </form>
        <button className="absolute top-0 right-0 cursor-pointer" onClick={onCloseBtnClicked}>
          <IoMdCloseCircle className="text-black text-4xl" />
        </button>
    </div>:
    <></>
  )
}

export default AddToDoModal