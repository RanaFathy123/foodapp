import React from "react";
import logo from "../../../../assets/images/logo.svg";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../../axiosConfig/axiosInstance";
export default function ForgetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/Users/Reset/Request",
        data
      );
      console.log(response);
      toast.success(response.data.message);

      navigate("/resetpass");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <div className="auth-bg ">
        <div className="container-fluid bg-overlay">
          <div className="row min-vh-100 h-100 justify-content-center align-items-center">
            <div className="col-md-9 bg-white p-5 border rounded border-2 form-body">
              <div className="text-center">
                <img src={logo} alt="" className="w-25 m-3" />
              </div>
              <div className="form-content p-3">
                <h3>Forgot Your Password?</h3>
                <p className="text-muted mb-4">
                  No worries! Please enter your email and we will send a
                  password reset link
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="input-group mb-5">
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
                      <p className="text-danger ">
                        {errors.email.message}
                      </p>
                    )}
                  <button className="btn btn-success  w-100">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
