import { axiosTodosSuccess, axiosTodosError, axiosTodosSRequest } from '../../actions';
import { todos as serverTodos } from '../todos_server';

export const axiosTodos = () => {
  return async (dispatch) => {
    dispatch(axiosTodosSRequest());

    try {

      const saved = JSON.parse(localStorage.getItem("todos"));

      let data;

      if (saved && Array.isArray(saved)) {

        data = saved;
      } else {

        data = serverTodos;


        localStorage.setItem("todos", JSON.stringify(serverTodos));
      }

      dispatch(axiosTodosSuccess(data));
      
    } catch (error) {
      dispatch(axiosTodosError(error.message));
    }
  };
};
