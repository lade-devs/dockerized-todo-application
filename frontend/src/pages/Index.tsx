import { TodoList } from "@/components/TodoList";
import { ToastContainer } from "react-toastify";

const Index = () => {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <TodoList />
      <ToastContainer pauseOnFocusLoss={false} />
    </main>
  );
};

export default Index;
