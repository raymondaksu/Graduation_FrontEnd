import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import Navbar from "../components/navbar/Navbar";
import ChangePassword from "../components/changePassword/ChangePassword";
import ChangeCredentials from "../components/changeCredentials/ChangeCredentials";
import DeleteAccount from "../components/deleteAccount/DeleteAccount";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles({
  table: {
    width: "100%",
    backgroundColor: "#7373f5",
  },
});

//-----INLINE STYLES-----

const bodyStyle = {
  width: "60%",
  display: "flex",
  flexDirection: "column",
  margin: "auto",
};
const header = {
  width: "30%",
  fontSize: "2rem",
  color: "black",
  letterSpacing: "2px",
  textAlign: "center",
  margin: "2rem auto",
  fontWeight: "bold",
};

function AccountPage() {
  const classes = useStyles();
  let history = useHistory();
  const [userData, setUserData] = useState([]);

  //----------Modal------------------------
  const [openPassword, setOpenPassword] = useState(false);
  const [openCredentials, setOpenCredentials] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);

  //----------Fetch User Data------------
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const result = await axios.get(
        `https://fs-blog-backend.herokuapp.com/user/edit/`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? "Token " + token : null,
          },
        }
      );
      setUserData(result.data);
      console.log(result.data);
    } catch ({ response }) {
      if (response) {
        console.log("No data");
      } else {
        console.log("Something went wrong!");
      }
    }
  };

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <Navbar />
        <div style={header}>
          <p>Account Settings</p>
        </div>

        <div style={bodyStyle}>
          <TableContainer component={Paper} style={{ marginBottom: "1rem" }}>
            <Table className={classes.table} aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <p style={{ fontWeight: "bolder" }}>Username</p>
                  </TableCell>
                  <TableCell align="right">{userData?.username}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <p style={{ fontWeight: "bolder" }}>Email</p>
                  </TableCell>
                  <TableCell align="right">{userData?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <p style={{ fontWeight: "bolder" }}>Member Since</p>
                  </TableCell>
                  <TableCell align="right">
                    {moment(userData?.date_joined).format("MMMM Do YYYY, h:mm")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <p style={{ fontWeight: "bolder" }}>Last Login</p>
                  </TableCell>
                  <TableCell align="right">
                    {moment(userData?.last_login).format("MMMM Do YYYY, h:mm")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container justify="center">
              <ChangePassword
                openPassword={openPassword}
                setOpenPassword={setOpenPassword}
              />
            </Grid>
          <Grid container justify="center">
              <ChangeCredentials
                open={openCredentials}
                setOpen={setOpenCredentials}
                user={userData}
                refresh={refreshData}
              />
            </Grid>
          <Grid container justify="center">
              <DeleteAccount
                open={openDeleteAccount}
                setOpen={setOpenDeleteAccount}
              />
            </Grid>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                  setOpenCredentials(true);
                }}
              style={{ minWidth: "8rem", margin: "0.5rem" }}
            >
              <PersonIcon fontSize="small" />
              &nbsp; Change Credentials
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenPassword(true)}
              style={{ minWidth: "8rem", margin: "0.5rem" }}
            >
              <EditIcon fontSize="small" />
              &nbsp; Change Password
            </Button>
          </div>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDeleteAccount(true)}
              style={{ minWidth: "8rem", margin: "0.5rem" }}
            >
              <DeleteIcon fontSize="small" />
              &nbsp; Delete Account
            </Button>
          </div>
        </div>
        <Grid container xs={12} justify="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.goBack()}
            style={{ minWidth: "6rem", margin: "0.5rem" }}
          >
            <ArrowBackIosIcon fontSize="small" />
            &nbsp; Back
          </Button>
        </Grid>
      </div>
    </>
  );
}

export default AccountPage;
