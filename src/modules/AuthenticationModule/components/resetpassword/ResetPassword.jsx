import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../../assets/images/logo.svg";
import { axiosInstance } from "../../../../axiosConfig/axiosInstance";

export default function ResetPassword() {
  const [checkShowPassword, setCheckShowPassword] = useState(false);
  const [checkShowConfirmPassword, setCheckShowConfirmPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/Users/Reset",
        resgiterFormData
      );
      console.log(response);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const showPassword = () => {
    setCheckShowPassword(!checkShowPassword);
    
  };
  const showConfirmPassword = () => {
    setCheckShowConfirmPassword(!checkShowConfirmPassword);
  };
  return (
    <>
      <div className="auth-bg ">
        <div className="container-fluid bg-overlay">
          <div className="row min-vh-100 h-100 justify-content-center align-items-center">
            <div className="col-md-9 bg-white p-5 border rounded border-2 form-body">
              <div className="text-center">
                <img src={logo} alt="" className="w-25" />
              </div>
              <div className="form-content p-3">
                <h3>Reset Password</h3>
                <p className="text-muted">
                  Please Enter Your Otp or Check Your Inbox
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa fa-envelope"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start border-secondary"
                      placeholder="Enter Your E-mail"
                      {...register("email", {
                        required: "Email is Required",
                        pattern: {
                          value:
                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                          message: "Email is Invalid",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <div className="text-danger mb-4">
                      {errors.email.message}
                    </div>
                  )}
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa fa-key"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start border-secondary"
                      placeholder="OTP"
                      {...register("seed", {
                        required: "OTP IS Required",
                      })}
                    />
                  </div>
                  {errors.seed && (
                    <div className="text-danger mb-4">
                      {errors.seed.message}
                    </div>
                  )}
                  <div className="input-group mb-3">
                    <span className="input-group-text " id="basic-addon1">
                      <i className="fa fa-key"></i>
                    </span>
                    <input
                      type={checkShowPassword ? "text" : "password"}
                      className="form-control border-start border-secondary"
                      placeholder="Password"
                      {...register("password", {
                        required: "Password is Required",
                        minLength: {
                          value: 6,
                          message: "Password Must Be 6 Character",
                        },
                      })}
                    />
                    <span className="input-group-text" id="basic-addon1">
                      {checkShowPassword ? (
                        <i
                          className="fa-solid fa-eye"
                          onClick={showPassword}
                        ></i>
                      ) : (
                        <i
                          className="fa-solid fa-eye-slash"
                          onClick={showPassword}
                        ></i>
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <div className="text-danger mb-4">
                      {errors.password.message}
                    </div>
                  )}
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa fa-key"></i>
                    </span>
                    <input
                      type={checkShowConfirmPassword ? "text" : "password"}
                      className="form-control border-start border-secondary"
                      placeholder="Confirm Password"
                      {...register("confirmPassword", {
                        required: "Confirm Password is Required",
                        minLength: {
                          value: 6,
                          message: "Password Must Be 6 Character",
                        },
                        validate: (value) =>
                          watch("password") == value || "Password do not match",
                      })}
                    />
                    <span className="input-group-text" id="basic-addon1">
                      {checkShowConfirmPassword ? (
                        <i
                          className="fa-solid fa-eye"
                          onClick={showConfirmPassword}
                        ></i>
                      ) : (
                        <i
                          className="fa-solid fa-eye-slash"
                          onClick={showConfirmPassword}
                        ></i>
                      )}
                    </span>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-danger mb-4">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                  <div className="links d-flex justify-content-between my-4">
                    <Link
                      to="/register"
                      className="text-success text-decoration-none "
                    >
                      Register Now?
                    </Link>
                    <Link
                      to="/forgetpass"
                      className="text-success text-decoration-none "
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <button className="btn btn-success  w-100">Login</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
