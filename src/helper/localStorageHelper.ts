import { ToDoListProp } from "../App";

const localStorageHelper = () => {
    const saveToDoList = (data: ToDoListProp[]) => {
        localStorage.setItem('todo-list', JSON.stringify(data));
    };

    const getToDoList = () => {
        return localStorage.getItem('todo-list');
    };

    return{saveToDoList, getToDoList};
};

export default localStorageHelper;