import React, { useState } from "react";
import { Card, Row, Col, Button, Modal, Form, Input, Upload } from "antd";
import { EnvironmentOutlined, UploadOutlined } from "@ant-design/icons";
import { profileData } from "./profileData";
import "./ProfileHeader.css";
import "./ModalStyles.css"; // New CSS file for modal
import { UserContext } from "../../../App";


const ProfileHeader = () => {
  const user = React.useContext(UserContext);
  
  const [profile, setProfile] = useState(profileData);

  // State for modal visibility and form fields
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
    form.setFieldsValue({
      name: user.data.name,
      organization: profile.organization,
      location: profile.location, // Pre-fill location
      profilePicture: profile.profilePicture,
    }); // Pre-fill form
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = (values) => {
    console.log("Updated values:", values);

    // Check if a new profile picture was uploaded
    const updatedProfilePicture = values.profilePicture?.fileList?.[0]?.thumbUrl || profile.profilePicture;

    setProfile({
      ...profile,
      name: user.data.name,
      organization: values.organization,
      location: values.location, // Update location
      profilePicture: updatedProfilePicture,
    });
    setIsModalVisible(false);
  };

  return (
    <>
      <Card
        className="profile-header-card"
        cover={<img alt="banner" src={profile.banner} className="profile-banner-img" />}
        bordered={false}
      >
        {/* Profile Picture */}
        <div className="profile-picture-wrapper">
          <img src={profile.profilePicture} alt="profile" className="profile-picture" />

          {/* Profile Info */}
          <Row gutter={[1000, 8]} align="middle" justify="space-between">
            <Col span={25}>
              <div className="profile-basic-details">
                <h1>{user.data.name}</h1>
                <p>
                  {user.data.accountType} @ {profile.organization}
                </p>
                <p>
                  <EnvironmentOutlined /> {profile.location}
                </p>
              </div>
            </Col>

            <Col span={25} className="profile-actions">
              <Button
                type="primary"
                shape="round"
                className="edit-btn"
                onClick={showModal}
              >
                Edit
              </Button>
            </Col>
          </Row>
        </div>
      </Card>

      {/* Modal for Editing Profile */}
      <Modal className="custom-modal "
        title={<h2 className="modal-title">Edit Profile</h2>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form 
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            name: profile.name,
            organization: profile.organization,
            location: profile.location,
            profilePicture: profile.profilePicture,
          }}
        >
          <Form.Item
            label={<span className="modal-label">Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your name" className="modal-input" />
          </Form.Item>

          <Form.Item
            label={<span className="modal-label">Organization</span>}
            name="organization"
            rules={[{ required: true, message: "Please enter your organization" }]}
          >
            <Input placeholder="Enter your organization" className="modal-input" />
          </Form.Item>

          <Form.Item
            label={<span className="modal-label">Location</span>}
            name="location"
            rules={[{ required: true, message: "Please enter your location" }]}
          >
            <Input placeholder="Enter your location" className="modal-input" />
          </Form.Item>

          <Form.Item
            label={<span className="modal-label">Profile Picture</span>}
            name="profilePicture"
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />} className="modal-upload-btn">Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="modal-save-btn">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProfileHeader;
