import { React, useState } from "react";
import img from "../../../assets/avatars/2.png";
import "./kanban.css";

const KanbanCard = (props) => {
    const [user, setUser] = useState({});
    const date = new Date(props.task.deadline);
    const deadline = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });



    // Function to dynamically determine the tag class based on status
    const getTagClass = (status, deadline) => {
    const currentDate = new Date(); // Get today's date
    const taskDeadline = new Date(deadline); // Convert deadline to Date object

    // Check if the task is overdue and not completed
    if (status !== "completed" && taskDeadline < currentDate) {
        return "kanban_task_tag_missing";
    }

    // Return other classes based on status
    switch (status) {
        case "created":
            return "kanban_task_tag_created";
        case "progress":
            return "kanban_task_tag_progress";
        case "completed":
            return "kanban_task_tag_completed";
        default:
            return ""; // Fallback if status is undefined
    }
};


    return (
        <div className="kanban_task_list">
            <div className="kanban_task_title">
                <span>{props.task.title}</span>
            </div>
            <div className="kanban_task_description">
                <span>{props.task.info}</span>
            </div>

            <div className="kanban_task_tags">
                {/* Apply the dynamically determined class */}
                <div
                        className={`kanban_task_tag_ind ${
                            props.task.status === "completed"
                            ? getTagClass(props.task.status)
                            : new Date(props.task.deadline) < new Date()
                            ? "kanban_task_tag_missing"
                            : getTagClass(props.task.status)
                        }`}
                        >
                        <span>
                            {new Date(props.task.deadline) < new Date() && props.task.status !== "completed"
                            ? "missing"
                            : props.task.status}
                        </span>
                        </div>

                <div className="kanban_task_deadline kanban_task_tag_ind">
                    <span>{deadline}</span>
                </div>
            </div>

            <div className="kanban_task_info">
                <div className="kanban_task_assigned">
                    <img src={img} alt="" />
                    <p className="name">{props.task.name.name}</p>
                </div>
            </div>
        </div>
    );
};

export default KanbanCard;
