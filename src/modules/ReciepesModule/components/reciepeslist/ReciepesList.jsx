import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import reciepeHeaderImg from "../../../../assets/images/header.png";
import noDataImg from "../../../../assets/images/no-data.png";
import DeleteData from "../../../SharedModule/components/DeleteData/DeleteData";
import Header from "../../../SharedModule/components/Header/Header";
import NoData from "../../../SharedModule/components/NoData/NoData";
import Loading from "../../../SharedModule/components/Loading/Loading";

export default function ReciepesList({ loginData }) {
  const [reciepesList, setReciepesList] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [recipeId, setReciepeId] = useState("");
  const [reciepeName, setReciepeName] = useState("");
  const [reciepeTag, setReciepeTag] = useState("");
  const [reciepeCategory, setReciepeCategory] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [showReciepe, setShowReciepe] = useState(false);

  const [reciepe, setReciepe] = useState({});
  const navigate = useNavigate();

  const goToReciepeData = () => {
    navigate("/dashboard/reciepedata");
  };

  const handleShowDelete = (id) => {
    setShowDelete(true);
    setReciepeId(id);
  };
  const handleShowReciepe = (reciepe) => {
    setReciepe(reciepe);
    setShowReciepe(true);
  };
  const handleCloseReciepe = () => {
    setShowReciepe(false);
  };
  const handleCloseDelete = () => {
    setShowDelete(false);
  };

  const addToFavorite = async (recipe) => {
    try {
      const addResponse = await axios.post(
        "https://upskilling-egypt.com:3006/api/v1/userRecipe",
        { recipeId: recipe.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Recipe Added Successfully");
      handleCloseReciepe();
      navigate("/dashboard/favorites");
    } catch (error) {
      console.log(error);
    }
  };

  const getTags = async () => {
    try {
      const response = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/tag",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setTagsList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/Category/?pageSize=15&pageNumber=1",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCategoriesList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getFavoritesList = async () => {
    try {
      const response = await axios.get(
        "https://upskilling-egypt.com:3006/api/v1/userRecipe",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const getReciepes = async (name, tagId, categoryId, pageSize, pageNumber) => {
    try {
      const response = await axios.get(
        `https://upskilling-egypt.com:3006/api/v1/Recipe/?pageSize=20&pageNumber=${pageNumber}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: {
            name: name,
            tagId: tagId,
            categoryId: categoryId,
          },
        }
      );

      setPageNumbers(
        Array(response.data.totalNumberOfPages)
          .fill()
          .map((_, i) => i + 1)
      );

      if (loginData?.userGroup == "SystemUser") {
        let reciepesData = response.data.data;
        let favorites = await getFavoritesList();
        let favoritesData = favorites.data.data;

        let filtertedReciepes = reciepesData.filter((recipes) => {
          return favoritesData.every((favorite) => {
            return favorite.recipe.name !== recipes.name;
          });
        });

        setReciepesList(filtertedReciepes);
      } else {
        setReciepesList(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteReciepe = async () => {
    try {
      const response = await axios.delete(
        `https://upskilling-egypt.com:3006/api/v1/Recipe/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    getReciepes();
    handleCloseDelete();
    toast.error("recipe Deleted");
  };
  const getReciepeValue = (input) => {
    setReciepeName(input.target.value);
    getReciepes(input.target.value, reciepeTag, reciepeCategory, 20, 1);
  };
  const getReciepeTagValue = (select) => {
    setReciepeTag(select.target.value);
    getReciepes(reciepeName, select.target.value, reciepeCategory, 20, 1);
  };
  const getReciepeCategoryValue = (select) => {
    console.log(select.target.value);
    setReciepeCategory(select.target.value);
    getReciepes(reciepeName, reciepeTag, select.target.value, 20, 1);
  };
  useEffect(() => {
    getReciepes("", "", "", 20, 1);
    getTags();
    getCategories();
    if (loginData?.userGroup == "SystemUser") {
      getFavoritesList();
    }
  }, [loginData]);

  return (
    <>
      <Modal show={showDelete} onHide={handleCloseDelete}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <DeleteData title={"Recipe"} />
          <button
            onClick={deleteReciepe}
            className="btn btn-danger ms-auto d-block "
          >
            Delete
          </button>
        </Modal.Body>
      </Modal>
      <Modal show={showReciepe} onHide={handleCloseReciepe}>
        <Modal.Header closeButton>
          <h4>Recipe Details</h4>
        </Modal.Header>
        <Modal.Body>
          {reciepe?.imagePath ? (
            <img
              className="rounded border border-1  mx-auto d-block"
              style={{ width: "242px", height: "168px" }}
              src={`https://upskilling-egypt.com:3006/${reciepe?.imagePath}`}
              alt="reciepe"
            />
          ) : (
            <img
              src={noDataImg}
              className="rounded border border-1  mx-auto d-block"
              style={{ width: "242px", height: "168px" }}
              alt="no reciepe"
            />
          )}
          <div className="fw-bold mt-2">
            description : {reciepe?.description}
          </div>
          {loginData?.userGroup == "SystemUser" ? (
            <button
              className="btn btn-outline-dark ms-auto d-block"
              onClick={() => addToFavorite(reciepe)}
            >
              Favorite
            </button>
          ) : (
            ""
          )}
        </Modal.Body>
      </Modal>
      <Header
        title={"Recipes Items"}
        description={
          "You can now add your items that any user can order it from the Application and you can edit"
        }
        imgUrl={reciepeHeaderImg}
      />

      <div className="container-fluid mt-3 mb-2 px-4 w-150">
        <div className="d-flex flex-wrap justify-content-between  align-items-center ">
          <div>
            <h4>Recipe Table Details</h4>
            <p>You can check all details</p>
          </div>
          <div>
            {loginData?.userGroup == "SuperAdmin" ? (
              <button
                className="btn btn-success px-5"
                onClick={goToReciepeData}
              >
                Add New Item
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      <div className="container-fluid my-3">
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search By Name"
              onChange={getReciepeValue}
            />
          </div>
          <div className="col-md-3">
            <select
              name=""
              id=""
              className="form-select"
              onChange={getReciepeCategoryValue}
            >
              <option value="">Category</option>
              {categoriesList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              name=""
              id=""
              className="form-select"
              onChange={getReciepeTagValue}
            >
              <option value="">Tag</option>
              {tagsList.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-responsive  px-3 border-none ">
        <table className="table align-middle mb-0 rounded p-5 w-150 table-borderless">
          <thead className="bg-primary text-white bg-info h-150 table-secondary  p-5">
            <tr>
              <th className="p-4 ">Name</th>
              <th className="py-4">Image</th>
              <th className="py-4">Price</th>
              <th className="py-4">Description</th>
              <th className="py-4">tag</th>
              <th className="py-4">Category</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="px-5">
            {reciepesList.length > 0 &&
              reciepesList.map((reciepe) => (
                <tr key={reciepe.id}>
                  <td>
                    <p className="fw-normal mb-1">{reciepe.name}</p>
                  </td>
                  <td>
                    {reciepe.imagePath ? (
                      <img
                        className="rounded border border-1"
                        style={{ width: "56px", height: "56px" }}
                        src={`https://upskilling-egypt.com:3006/${reciepe.imagePath}`}
                        alt="reciepe"
                      />
                    ) : (
                      <img
                        src={noDataImg}
                        className="rounded border border-1"
                        style={{ width: "56px", height: "56px" }}
                        alt="no reciepe"
                      />
                    )}
                  </td>
                  <td>
                    <p className="fw-normal mb-1">{reciepe.price}</p>
                  </td>
                  <td>
                    <p className="fw-normal mb-1">{reciepe.description}</p>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="ms-3">
                        <p className="text-muted mb-0">{reciepe.tag.name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {
                      <p className="text-muted mb-0">
                        {reciepe.category[0]?.name
                          ? reciepe.category[0]?.name
                          : "No Category"}
                      </p>
                    }
                  </td>
                  <td>
                    <div className="d-flex gap-3 align-items-center ">
                      <i
                        className="fa fa-eye text-primary "
                        onClick={() => handleShowReciepe(reciepe)}
                      ></i>
                      {loginData?.userGroup == "SuperAdmin" ? (
                        <>
                          <Link to={`/dashboard/editreciepe/${reciepe.id}`}>
                            <i className="fa fa-edit text-warning"></i>
                          </Link>

                          <i
                            className="fa fa-trash text-danger"
                            onClick={() => handleShowDelete(reciepe.id)}
                          ></i>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {reciepesList.length == 0 && <NoData />}
        <nav
          aria-label="Page navigation example"
          style={{ display: "flex", justifyContent: "end" }}
        >
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">«</span>
              </a>
            </li>
            {pageNumbers.map((pageNo, index) => (
              <li
                className="page-item"
                key={index}
                onClick={() =>
                  getReciepes(
                    reciepeName,
                    reciepeTag,
                    reciepeCategory,
                    20,
                    pageNo
                  )
                }
              >
                <a className="page-link">{pageNo}</a>
              </li>
            ))}
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">»</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
