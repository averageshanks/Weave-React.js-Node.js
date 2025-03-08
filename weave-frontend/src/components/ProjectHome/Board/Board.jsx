import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanCard from "./kanban_card";

const ItemType = {
  TASK: "task",
};

export default function Board({ taskInfo }) {
  const [tasks, setTasks] = useState(taskInfo);

  useEffect(() => {
    setTasks(taskInfo);
  }, [taskInfo]);

  function handleEvent(id, status) {
    // Prevent setting status to "missing"
    if (status === "missing") return;

    fetch(`/api/updatetask/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: status,
      }),
    });

    setTasks((prev) =>
      prev.map((task) =>
        task.taskId === id ? { ...task, status: status } : task
      )
    );
  }

  function updateTaskStatus(id, newStatus) {
    handleEvent(id, newStatus);
  }

  const Column = ({ status, children, isDroppable = true }) => {
    const [, drop] = useDrop({
      accept: ItemType.TASK,
      drop: (item) => isDroppable && updateTaskStatus(item.id, status),
      canDrop: (item) => isDroppable && item.status !== "missing", // Prevent dropping from "Missing"
    });

    return (
      <div
        className="kanban_grid"
        ref={isDroppable ? drop : null} // Attach the drop ref only if droppable
      >
        <div className={`kanban_grid_header ${status}`}>
          <span>
            {status === "created"
              ? "To Do"
              : status === "progress"
              ? "Doing"
              : status === "completed"
              ? "Done"
              : status === "missing"
              ? "Missing"
              : status}
          </span>
        </div>
        <div className="kanban_grid_tasks">{children}</div>
      </div>
    );
  };

  const DraggableTask = ({ task }) => {
    const [, drag] = useDrag({
      type: ItemType.TASK,
      item: { id: task.taskId, status: task.status },
      canDrag: task.status !== "missing", // Prevent dragging tasks from "Missing"
    });

    return (
      <div ref={task.status !== "missing" ? drag : null}>
        <KanbanCard task={task} />
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board_main">
        <div className="kanban_main">
          <Column status="created" title="To Do">
            {tasks
              .filter(
                (task) =>
                  task.status === "created" &&
                  new Date(task.deadline) > new Date()
              )
              .map((task) => (
                <DraggableTask key={task.taskId} task={task} />
              ))}
          </Column>
          <Column status="progress">
            {tasks
              .filter(
                (task) =>
                  task.status === "progress" &&
                  new Date(task.deadline) > new Date()
              )
              .map((task) => (
                <DraggableTask key={task.taskId} task={task} />
              ))}
          </Column>
          <Column status="completed">
            {tasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <DraggableTask key={task.taskId} task={task} />
              ))}
          </Column>
          <Column status="missing" isDroppable={false}>
            {tasks
              .filter(
                (task) =>
                  task.status !== "completed" &&
                  new Date(task.deadline) < new Date()
              )
              .map((task) => (
                <DraggableTask key={task.taskId} task={task} />
              ))}
          </Column>
        </div>
      </div>
    </DndProvider>
  );
}
