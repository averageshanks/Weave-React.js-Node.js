import {
  Task,
  Event,
  RadioButtonUnchecked,
  CheckCircleOutline,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import image from "../../../assets/avatars/6.png";
import { useEffect, useState } from "react";
export default function TaskCard(props) {
  const [user, setUser] = useState({});
  const date = new Date(props.task.deadline);
  const deadline = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  function handleClick() {
    if (props.task.status == "created")
      props.handleMe(props.task.taskId, "progress");
    else props.handleMe(props.task.taskId, "completed");
  }
  return (
    <motion.div
      animate={{ scale: 1 }}
      initial={{ scale: 0.5 }}
      transition={{ type: "spring", duration: 2 }}
      className="card--main"
    >
      <div className="card--info">
        <div className="card--info--upper">
          {/* {props.task.status === "completed" ? (
            <Task className="task" />
          ) : (
            <Event className="event" />
          )} */}
          <label className="card--info--title">{props.task.title}</label>
          {/* {props.task.status != "completed" ? (
            <button onClick={handleClick}>
              <RadioButtonUnchecked />
            </button>
          ) : (
            <button className="checked">
              <CheckCircleOutline />
            </button>
          )} */}
          <label className="card--info--description">{props.task.info}</label>
        </div>
          <div className="card--info--lower">
              <div className="bottom">
                  <img src={image} alt="" />
                  <p>{props.task.name.name}</p>
              </div>
                <p className="date">{deadline}</p>

          </div>
      </div>
    </motion.div>
  );
}
