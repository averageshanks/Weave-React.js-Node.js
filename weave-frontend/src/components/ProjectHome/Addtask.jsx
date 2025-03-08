import { Button } from "antd";
import { useState } from "react";

export default function AddTask({ handleAddTask, project }) {
  const [loader, setLoader] = useState(false);
  async function handleCreate(event) {
    setLoader(true);
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const circulartoPlain = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(circulartoPlain);
    handleAddTask(formDataJsonString, setLoader);
  }
  return (
    <div className="login-registration-form">
      <div className="loginSection">
        <div className="login-card signup">
          <div className="top-section">
            <div>
              <h2>Task</h2>
            </div>
            <div className="grey">Add task to your project</div>
          </div>
          <div className="login-form">
            <form action="" onSubmit={handleCreate}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id=""
                placeholder="Title for your task"
              />
              <label htmlFor="info">Description</label>
              <input
                type="text"
                name="info"
                id="info"
                placeholder="Information on your task"
              />
              <label htmlFor="deadline">Deadline</label>
              <input type="date" name="deadline" id="deadline" />
              <div className="select-task">
                <label for="cars">Assign this task:</label>
                <select name="userid" id="name">
                  <option value="" selected>
                    None
                  </option>
                  {project.members.map((member) => (
                    <option value={member.userId}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div className="submitbutton">
                <Button
                  color="default"
                  variant="solid"
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loader}
                >
                  Create
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
