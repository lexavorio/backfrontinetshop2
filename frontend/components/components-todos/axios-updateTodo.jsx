
import { axiosTodos } from './axios-getTodo'


export const onUpdate = (id, newTitle) => {
  return async (dispatch) => {
    try {
      const saved = JSON.parse(localStorage.getItem("todos") || "[]");

      const updated = saved.map(todo =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      );

      localStorage.setItem("todos", JSON.stringify(updated));

      dispatch(axiosTodos());

    } catch (error) {
      console.error("Ошибка при обновлении:", error);
    }
  };
};