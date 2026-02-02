import axios from "axios";

import Cookies from "js-cookie";

const Api = axios.create({
  //set endpoint API
  baseURL: "http://localhost:3000",

  //set header axios
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

//handle unathenticated
Api.interceptors.response.use(
  function (response) {
    //return response
    return response;
  },
  (error) => {
    //check if response unauthenticated
    if (401 === error.response.status) {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      Cookies.remove("user");
      //redirect "/"
      window.location = "/";
    } else if (403 === error.response.status) {
      //redirect "/forbidden"
      window.location = "/forbidden";
    } else {
      //reject promise error
      return Promise.reject(error);
    }
  },
);

export default Api;
