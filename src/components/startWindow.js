import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  mainBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 auto",
  },
  form: {
    margin: "20px 0",
  },
  cinemaBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: `1px solid grey`,
    padding: 10,
    borderRadius: 5,
    maxWidth: 700,
    width: "100%",
    margin: 10,
  },
  poster: {
    height: 200,
    marginRight: 50,
  },
});

const schema = yup.object({
  movie: yup.string().min(2).required(),
});

export default function StartWindow() {
  const [movie, setMovie] = useState("");
  const [foundMovies, setFoundMovies] = useState(null);
  const classes = useStyles();
  const navigate = useNavigate();
  const [cookies, setCookies] = useState(
    document.cookie.split(/; */).map((el) => el.slice(0, 9))
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSearch = () => {
    fetch(`https://www.omdbapi.com/?apikey=993add81&s=${movie}`)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw new Error("network error");
        }
      })
      .then((data) => setFoundMovies(data))
      .catch((err) => console.log("error", err));
  };

  const addToWishes = (id) => {
    const dataToWishlist = foundMovies.Search.filter(
      (cinema) => cinema.imdbID === id
    );
    document.cookie =
      encodeURIComponent(dataToWishlist[0].imdbID) +
      "=" +
      encodeURIComponent(dataToWishlist[0].imdbID);

    setCookies((prevState) => [...prevState, dataToWishlist[0].imdbID]);
  };

  return (
    <Box className={classes.mainBox}>
      <form className={classes.form} onSubmit={handleSubmit(handleSearch)}>
        <Controller
          name='movie'
          control={control}
          render={() => (
            <TextField
              size='small'
              error={errors.movie ? true : false}
              color={errors?.movie ? "error" : "secondary"}
              label='Enter title'
              helperText={errors?.movie?.message}
              style={{ marginRight: 20, width: 250 }}
              {...register("movie")}
              value={movie}
              onChange={(e) => setMovie(e.target.value)}
            />
          )}
        />
        <Button
          color='secondary'
          variant='contained'
          style={{ height: 40, marginRight: 20 }}
          onClick={handleSearch}
          type='submit'
        >
          Search
        </Button>
        <Button
          variant='contained'
          style={{ height: 40 }}
          onClick={() => {
            navigate("/wishes_list");
            window.location.reload();
          }}
        >
          Wishlist
        </Button>
      </form>
      {foundMovies
        ? foundMovies?.Search?.map((movie) => (
            <Box className={classes.cinemaBox} key={movie.imdbID}>
              <Box style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={movie.Poster}
                  alt='film poster'
                  className={classes.poster}
                />
                <Box style={{ marginRight: 30, maxWidth: 300 }}>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Title:</span>{" "}
                    {movie.Title}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Year:</span>{" "}
                    {movie.Year}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Type:</span>{" "}
                    {movie.Type}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>imdbID:</span>{" "}
                    {movie.imdbID}
                  </Typography>
                </Box>
              </Box>
              {cookies?.find((el) => el === movie.imdbID) ? (
                <Button color='success'>added</Button>
              ) : (
                <Button
                  variant='contained'
                  onClick={() => addToWishes(movie.imdbID)}
                >
                  Add to wishlist
                </Button>
              )}
            </Box>
          ))
        : null}
    </Box>
  );
}
