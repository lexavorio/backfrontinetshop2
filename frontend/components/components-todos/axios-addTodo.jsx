import { useState } from "react";
import { useDispatch } from "react-redux";
import { axiosTodos } from './axios-getTodo'


export const useAddTodoList = () => {
  const [isCreating, setIsCreating] = useState(false);
  const dispatch = useDispatch();

  const onAdd = async (title) => {
    setIsCreating(true);

    try {
      const saved = JSON.parse(localStorage.getItem("todos") || "[]");

      const newTodo = {
        id: Date.now(),
        title,
        completed: false,
      };

      const updated = [...saved, newTodo];

      localStorage.setItem("todos", JSON.stringify(updated));

      dispatch(axiosTodos());

    } catch (error) {
      console.error("Ошибка при добавлении:", error);

    } finally {
      setIsCreating(false);
    }
  };

  return { isCreating, onAdd };
};