import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { nanoid } from "nanoid";
import "./Register.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function Register() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    userFullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    age: "",
    gender: "",
    dob: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Tạo admissionId ngẫu nhiên
      const admissionId = `GUEST-${nanoid(8)}`;
      setGeneratedId(admissionId);

      const payload = {
        ...formData,
        userType: "student", // Mặc định là student
        admissionId,
        age: Number(formData.age),
        mobileNumber: formData.mobileNumber.replace(/\D/g, ""),
        isAdmin: false,
      };

      const response = await axios.post(API_URL + "api/auth/register", payload);

      if (response.data) {
        setSuccess(true);
        setTimeout(() => history.push("/signin"), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Đăng ký Tài khoản Khách</h2>

        {success && (
          <div className="success-message">
            <p>🎉 Đăng ký thành công!</p>
            <p>
              Mã số của bạn: <strong>{generatedId}</strong>
            </p>
            <p>Vui lòng ghi nhớ mã này để đăng nhập</p>
            <p>Chuyển hướng sau 5 giây...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="userFullName"
              value={formData.userFullName}
              onChange={handleChange}
              required
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="user@example.com"
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
              placeholder="••••••"
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              placeholder="0987 654 321"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tuổi</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                placeholder="20"
              />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Đường ABC, Quận XYZ"
              rows="3"
              required
            />
          </div>

          <button type="submit" className="register-button">
            Đăng ký Ngay
          </button>
        </form>

        <div className="login-link">
          Đã có tài khoản? <Link to="/signin">Đăng nhập tại đây</Link>
        </div>
      </div>
    </div>
  );
}