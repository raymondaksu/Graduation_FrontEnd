import axios from "axios";
import { useEffect, useState, useContext } from "react";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";

import "./HomePagination.css";
import "./HomeCreatePostButton.css";

import { Context } from "../context/Context";

import Navbar from "../components/navbar/Navbar";
import PostCard from "../components/card/Card";
import { SearchBox } from "../components/searchbox/SearchBox";
import { CategoryDropDown } from "../components/categorydropdown/CategoryDropDown";

import ControlPointIcon from "@material-ui/icons/ControlPoint";

import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { LoopCircleLoading } from "react-loadingg";

import { wallpaper } from "../styles/background";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "& > *": {
      margin: theme.spacing(5),
    },
    minHeight: "70vh",
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

// -----------INLINE STYLES--------

const searchContainerStyle = {
  width: "50%",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "30px auto",
};
const paginationContainerStyle = {
  width: "100%",
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "60px",
  backgroundColor: "transparent",
};
const buttonStyle = {
  padding: "10px",
  outline: "none",
  border: "0",
  borderRadius: "20px",
  cursor: "pointer",
  width: "16rem",
  fontSize: "1rem",
  fontWeight: "bold",
  backgroundColor: "#83acf1",
  color: "#fff",
};

// ---------MAIN FUNCTION----------
function Home() {
  const {
    keyword,
    setKeyword,
    categoryDisplay,
    selectedOption,
    setSelectedOption,
    userId,
  } = useContext(Context);

  const history = useHistory();

  const [postDisplayList, setPostDisplayList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sanitizedData, setSanitizedData] = useState([]);
  const [filteredDataWithPagination, setFilteredDataWithPagination] = useState(
    []
  );

  const classes = useStyles();

  // -------for pagination---------
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(6);
  const [pageCount, setPageCount] = useState(0);

  // --------fetch data------------
  const fetchData = async (
    postListURL = "https://fs-blogapp-django.herokuapp.com/api/post-list/"
  ) => {
    try {
      const result = await axios.get(postListURL);
      const data = result?.data;
      const published = data.filter((item) => item.status === 'published')
      setPostDisplayList(published);
      console.log(published);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  //-----------filter data---------
  const filterPosts = (keyword, data) => {
    const filterPostList = data.filter((item) => {
      return item.title.toUpperCase().indexOf(keyword.toUpperCase()) > -1;
    });
    setFilteredData(filterPostList);
  };

  const filteredDataFunc = () => {
    if (keyword !== "") {
      filterPosts(keyword, postDisplayList);
    } else {
      setFilteredData(postDisplayList);
    }
  };

  // -------category filter-------------
  const categoryFilterData = [];

  function categoryFilterFunc() {
    selectedOption.forEach((e) => {
      filteredData.forEach((x) => {
        if (e === x.category) {
          categoryFilterData.push(x);
        }
      });
    });
  }

  // ---------------Pagination logic---------------------------
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage * 6);
  };

  function paginationFunc() {
    const slice = sanitizedData.slice(offset, offset + perPage);
    setPageCount(Math.ceil(sanitizedData.length / perPage));
    setFilteredDataWithPagination(slice);
  }

  // ----------useEffects--------
  useEffect(() => {
    fetchData();
    // console.log("token : ", localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    filteredDataFunc();
  }, [keyword, postDisplayList]);

  useEffect(() => {
    categoryFilterFunc();
    setSanitizedData(categoryFilterData);
  }, [filteredData, selectedOption]);

  useEffect(() => {
    paginationFunc();
  }, [sanitizedData, offset, postDisplayList]);

  useEffect(() => {
    if (!selectedOption.length) {
      setSelectedOption(categoryDisplay.map((e) => e.value));
    }
  }, [selectedOption]);

  // -----------------RETURN------------------
  return !postDisplayList?.length ? (
    <div>
      <Navbar />
      <div style={{
          ...searchContainerStyle,
          margin: "30px auto",
        }}>
        <SearchBox />
      </div>
      <LoopCircleLoading />
    </div>
  ) : (
    <div
      style={{
        ...wallpaper,
        overflow: "hidden",
      }}
    >
      <Navbar />
      {userId && (
        <div className="flyingButton" onClick={() => history.push("/create")}>
          <ControlPointIcon fontSize="large" />
          <div className="createPostContainer">Create a Post</div>
        </div>
      )}
      <div
        style={{
          ...searchContainerStyle,
          margin: "30px auto",
        }}
      >
        <SearchBox />
        <div
          style={{
            ...searchContainerStyle,
            position: "absolute",
            top: "107px",
          }}
        >
          {keyword?.length ? (
            <p
              style={{ color: "tomato", fontWeight: "bolder", padding: "10px" }}
            >
              Results shown with keyword: "{keyword}"
            </p>
          ) : null}
        </div>
      </div>
      <div style={{ ...searchContainerStyle, margin: "10px auto" }}>
        <CategoryDropDown
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </div>
      <Grid container className={classes.root} spacing={5} justify="center">
        <Grid item xs={12}>
          <Grid container justify="center" spacing={5}>
            {sanitizedData.length ? (
              filteredDataWithPagination.map((item, idx) => {
                return <PostCard item={item} itemStatus={false} id={idx} />;
              })
            ) : (
              <div>
                {keyword?.length ? (
                  <p style={{ textAlign: "center", fontWeight: "bold" }}>
                  "{keyword}" is not available in bloglist titles.
                </p>
                ) : null}
                <Box p={9}>
                  <button
                    type=""
                    onClick={() => {
                      setKeyword("");
                      setSelectedOption(categoryDisplay.map((e) => e.value));
                    }}
                    style={buttonStyle}
                  >
                    Back to Home Page
                  </button>
                </Box>
              </div>
            )}
          </Grid>
        </Grid>
      </Grid>
      <div style={paginationContainerStyle}>
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}

export default Home;