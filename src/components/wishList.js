import React, { useEffect,  useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router";


const useStyles = makeStyles({
  mainBox: {
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  head: {
    textTransform: "uppercase",
  },
  cinemaBox: {
    display: "flex",
    alignItems: "center",
    border: "1px solid grey",
    padding: 10,
    borderRadius: 5,
    margin: "10px 0",
  },
  poster: {
    height: 400,
    marginRight: 50,
  },
  ratingBox: {
    margin: "20px 0",
  },
  description: {
    maxWidth: 600,
    width: "100%",
  },
});

const cookies = document.cookie.split(/; */);

export default function WishList() {
  const [wishList, setWishList] = useState([]);
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    const ids = cookies?.map((el) => el.slice(0, 9));

    if (ids[0].length !== 0) {
      ids?.forEach((el) => {
        fetch(`https://www.omdbapi.com/?i=${el}&apikey=993add81`)
          .then((resp) => {
            if (resp.ok) {
              return resp.json();
            } else {
              throw new Error("network error");
            }
          })
          .then((data) => setWishList((prevState) => [...prevState, data]))
          .catch((err) => console.log("error", err));
      });
    } else {
      setWishList([]);
    }

  }, []);

  function deleteCookie(name) {
    const cookieName = encodeURIComponent(name);
    document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  const handleRemoveItem = (id) => {
    deleteCookie(id);
    const filteredData = wishList.filter((item) => item.imdbID !== id);
    setWishList(filteredData);
  };

  return (
    <Box className={classes.mainBox}>
      <Typography variant='h5' className={classes.head}>
        Your wishes list
      </Typography>
      <Button
        variant='contained'
        style={{ margin: "20px 0" }}
        onClick={() => {
          navigate("/");
          window.location.reload();
        }}
      >
        Return
      </Button>
      <Box>
        {wishList ? (
          wishList?.map((singleItem) => (
            <Box key={singleItem.imdbID} className={classes.cinemaBox}>
              <img
                src={singleItem.Poster}
                alt='poster'
                className={classes.poster}
              />
              <Box>
                <Typography>
                  <span style={{ fontWeight: "bold" }}>Title:</span>{" "}
                  {singleItem.Title}
                </Typography>
                <Typography>
                  <span style={{ fontWeight: "bold" }}>Year:</span>{" "}
                  {singleItem.Year}
                </Typography>
                <Typography>
                  <span style={{ fontWeight: "bold" }}>Genre:</span>{" "}
                  {singleItem.Genre}
                </Typography>
                <Typography>
                  <span style={{ fontWeight: "bold" }}>Director:</span>{" "}
                  {singleItem.Director}
                </Typography>
                <Typography>
                  <span style={{ fontWeight: "bold" }}>Writers:</span>{" "}
                  {singleItem.Writer}
                </Typography>
                <Box className={classes.ratingBox}>
                  <Typography variant='h6'>Ratings</Typography>
                  <Typography>IMDb Rating: {singleItem.imdbRating}</Typography>
                  {singleItem?.Ratings?.map((rating, i) => (
                    <Typography key={i}>
                      {rating.Source}: {rating.Value}
                    </Typography>
                  ))}
                </Box>
                <Box className={classes.description}>
                  <Typography variant='h6'>Description</Typography>
                  <Typography>{singleItem.Plot}</Typography>
                </Box>
                <Button
                  variant='contained'
                  color='error'
                  style={{ marginTop: 20 }}
                  onClick={() => handleRemoveItem(singleItem.imdbID)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>Loading...</Typography>
        )}
      </Box>
      {wishList.length === 0 ? <Typography>List is empty</Typography> : null}
    </Box>
  );
}
