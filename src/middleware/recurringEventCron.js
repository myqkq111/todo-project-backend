import Todo from "../models/Todo.js";
import cron from 'node-cron';

const updateRecurringTodos = async () => {
    try {
      const todos = await Todo.find({ recurringEvent: true });
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
      for (const todo of todos) {
        if (todo.dueDate < today) {
          
          const newRegDate = new Date(todo.dueDate.getTime());
          newRegDate.setDate(newRegDate.getDate() + 1);
          
          const recurringPeriod = parseInt(todo.recurringPeriod, 10);
         
          const newDueDate = new Date(newRegDate.getTime());
          newDueDate.setDate(newDueDate.getDate() + recurringPeriod);
  
          await Todo.findByIdAndUpdate(todo._id, {
            regDate: newRegDate,
            dueDate: newDueDate,
          });
        }
      }
    } catch (err) {
      console.error('Error updating recurring todos:', err);
    }
  };

  const recurringEventCron = () => {
    cron.schedule('0 0 * * *', updateRecurringTodos); //매일 정각에 실행
  };

  export default recurringEventCron;