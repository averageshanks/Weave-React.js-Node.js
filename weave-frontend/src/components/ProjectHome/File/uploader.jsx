import React, { useState } from "react";
import "./uploader.css";
import { Button } from "antd";
import { UserContext } from "../../../App";
export default function Uploader({ close, project }) {
  const [file, setFile] = useState("");
  const [loader, setLoader] = useState(false);
  const user = React.useContext(UserContext);
  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  async function fileUpload(e) {
    e.preventDefault();
    setLoader(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `/api/fileupload/${project.projectId}/${user.data.userId}/${null}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      response.json().then((e) => {
        console.log(e);
        setLoader(false);
        close();
      });
    }
  }
  return (
    <div className="container">
      <div className="uploader-card">
        <h3>Upload Files</h3>
        <div className="drop_box">
          <header>
            <h4>Select File here</h4>
          </header>
          <p>Files Supported: PDF, TEXT, DOC , DOCX</p>
          <form>
            <input
              type="file"
              accept=".doc,.docx,.pdf"
              id="fileID"
              onChange={handleChange}
            />
            <Button
              color="default"
              variant="solid"
              onClick={fileUpload}
              loading={loader}
            >
              Upload
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
