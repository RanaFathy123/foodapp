import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import reciepeHeaderImg from "../../assets/images/header.png";
import noDataImg from "../../assets/images/no-data.png";
import Header from "../SharedModule/components/Header/Header";
import NoData from "../SharedModule/components/NoData/NoData";

import "react-responsive-pagination/themes/classic.css";

export default function Favorites() {
  const [favoritesList, setFavoritesList] = useState([]);
  const navigate = useNavigate();

  const getFavoritesList = async () => {
    try {
      const response = await axios.get(
        `https://upskilling-egypt.com:3006/api/v1/userRecipe/?pageSize=15&pageNumber=1`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(response.data.data);
      let favList = response.data.data.map((fav) => {
        return { ...fav, checkColor: true };
      });


      setFavoritesList(favList);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFavorite = async (favorite) => {
    try {
      const response = await axios.delete(
        `https://upskilling-egypt.com:3006/api/v1/userRecipe/${favorite.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(favoritesList);
      let favoriteListChanged = favoritesList.map((fav) => {
        if (fav.id == favorite.id) {
          fav.checkColor = false;
        }
        return fav;
      });
      setFavoritesList(favoriteListChanged)
      toast.error("Reciepe Deleted From Your Favorite");
      // navigate("/dashboard/reciepes");
      getFavoritesList();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFavoritesList();
  }, []);
  return (
    <>
      <Header
        title={"Favorite Items"}
        description={
          "You can now add your items that any user can order it from the Application and you can editYou can now add your items that any user can order it from the Application and you can edit"
        }
        imgUrl={reciepeHeaderImg}
      />
      <div className="d-flex flex-wrap justify-content-center gap-3 align-items-center mt-5 ">
        {favoritesList.length > 0 ? (
          favoritesList.map((favorite) => (
            <div
              key={favorite.id}
              className="card rounded  shadow-lg p-3 mb-5 bg-white rounded"
              style={{ width: "345px" }}
            >
              {favorite.recipe.imagePath ? (
                <img
                  className="rounded border border-1  mx-auto d-block"
                  style={{ width: "242px", height: "168px" }}
                  src={`https://upskilling-egypt.com:3006/${favorite.recipe.imagePath}`}
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

              <span
                className="position-absolute top-0 end-0 mt-2 me-2 border border-2 px-2 rounded"
                onClick={() => deleteFavorite(favorite)}
                title="Delete From Favorites"
              >
                {favorite.checkColor ? (
                  <i className="fas fa-heart text-success"></i>
                ) : (
                  <i className="fas fa-heart text-secondary"></i>
                )}
              </span>
              <div className="card-body">
                <p className="card-text">
                  Reciepe Name : {favorite.recipe.name}
                </p>
                <p className="card-text">
                  Reciepe description : {favorite.recipe.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <NoData />
        )}
      </div>
    </>
  );
}
