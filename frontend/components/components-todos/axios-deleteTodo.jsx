
import { axiosTodos } from './axios-getTodo'


export const onDelete = (id) => {
  return async (dispatch) => {
    try {
      const saved = JSON.parse(localStorage.getItem("todos") || "[]");

      const updated = saved.filter(todo => todo.id !== id);

      localStorage.setItem("todos", JSON.stringify(updated));

      dispatch(axiosTodos());

    } catch (error) {
      console.error("Ошибка при удалении:", error);
    }
  };
};