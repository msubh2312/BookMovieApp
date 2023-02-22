import React, { useEffect, useState } from "react";
import "./Home.css";
import Header from "../../common/header/Header";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  upcomingMoviesHeading: {
    textAlign: "center",
    background: "#ff9999",
    padding: "8px",
    fontSize: "1rem",
  },
  gridListUpcomingMovies: {
    flexWrap: "nowrap",
    transform: "translateZ(0)",
    width: "100%",
  },
  gridListMain: {
    transform: "translateZ(0)",
    cursor: "pointer",
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 240,
    maxWidth: 240,
  },
  title: {
    color: theme.palette.primary.light,
  },
});

function Home(props) {
  // const navigate = useNavigate();
  const [state, setState] = useState({
    movieName: "",
    upcomingMovies: [],
    releasedMovies: [],
    genres: [],
    artists: [],
    genresList: [],
    artistsList: [],
    releaseDateStart: "",
    releaseDateEnd: "",
  });
  async function loadData() {
    //Get upcoming movies
    //status: PUBLISHED, RELEASED, CLOSED, DELETED
    const upcomingMoviesRaw = await fetch(
      props.baseUrl + "movies?status=PUBLISHED",
      { method: "GET" }
    );
    const upcomingMoviesData = await upcomingMoviesRaw.json();
    const upcomingMoviesList = upcomingMoviesData.movies;
    let upcomingMovies = state.upcomingMovies;
    upcomingMoviesList.forEach((movie) => upcomingMovies.push(movie));
    setState({ ...state, upcomingMovies: upcomingMovies });


    //Get released movies
    const releasedMoviesRaw = await fetch(
      props.baseUrl + "movies?status=RELEASED",
      { method: "GET" }
    );
    const releasedMoviesData = await releasedMoviesRaw.json();
    const releasedMoviesList = releasedMoviesData.movies;
    let releasedMovies = state.releasedMovies;
    releasedMoviesList.forEach((movie) => releasedMovies.push(movie));
    setState({ ...state, releasedMovies: releasedMovies });


    //Get Genres
    const genresRaw = await fetch("http://localhost:8085/api/v1/genres", {
      method: "GET",
    });

    const genresData = await genresRaw.json();
    const genreList = genresData.genres;
    let genres = state.genresList;
    genreList.forEach((genre) => genres.push(genre));
    setState({ ...state, genresList: genres });


    //Get artists
    const artistsRaw = await fetch(props.baseUrl + "artists", {
      method: "GET",
    });
    const artistsData = await artistsRaw.json();
    const artistsList = artistsData.artists;
    let artists = state.artistsList;
    artistsList.forEach((artist) => artists.push(artist));
    setState({ ...state, artistsList: artists });

  }
  const movieNameChangeHandler = (event) => {
    setState({ ...state, movieName: event.target.value });
  };

  const genreSelectHandler = (event) => {
    setState({ ...state, genres: event.target.value });
  };

  const artistSelectHandler = (event) => {
    setState({ ...state, artists: event.target.value });
  };

  const releaseDateStartHandler = (event) => {
    setState({ ...state, releaseDateStart: event.target.value });
  };

  const releaseDateEndHandler = (event) => {
    setState({ ...state, releaseDateEnd: event.target.value });
  };

  const movieClickHandler = (movieId) => {
    props.history.push("/movie/" + movieId);
  };

  async function filterApplyHandler() {
    let queryString = "?status=RELEASED";
    if (state.movieName !== "") {
      queryString += "&title=" + state.movieName;
    }
    if (state.genres.length > 0) {
      queryString += "&genre=" + state.genres.toString();
    }
    if (state.artists.length > 0) {
      queryString += "&artists=" + state.artists.toString();
    }
    if (state.releaseDateStart !== "") {
      queryString += "&start_date=" + state.releaseDateStart;
    }
    if (state.releaseDateEnd !== "") {
      queryString += "&end_date=" + state.releaseDateEnd;
    }

    const filterRaw = await fetch(
      props.baseUrl + "movies" + encodeURI(queryString),
      { method: "GET" }
    );
    const filterData = await filterRaw.json();
    const filteredMovies = filterData.movies;
    setState({ ...state, releasedMovies: filteredMovies });

  }
  useEffect(() => {
    loadData();
  }, []);

  const { classes } = props;

  return (
    <div>
      <Header
        baseUrl={props.baseUrl}
        modalStateValues={props.modalStateValues}
      />

      <div className={classes.upcomingMoviesHeading}>
        <span>Upcoming Movies</span>
      </div>

      <GridList cols={5} className={classes.gridListUpcomingMovies}>
        {state.upcomingMovies.map((movie) => (
          <GridListTile key={"upcoming" + movie.id}>
            <img
              src={movie.poster_url}
              className="movie-poster"
              alt={movie.title}
            />
            <GridListTileBar title={movie.title} />
          </GridListTile>
        ))}
      </GridList>

      <div className="flex-container">
        <div className="left">
          <GridList cellHeight={350} cols={4} className={classes.gridListMain}>
            {state.releasedMovies.map((movie) => (
              <GridListTile
                className="released-movie-grid-item"
                key={"grid" + movie.id}
                onClick={() => movieClickHandler(movie.id)}
              >
                <img
                  src={movie.poster_url}
                  className="movie-poster"
                  alt={movie.title}
                />
                <GridListTileBar
                  title={movie.title}
                  subtitle={
                    <span>
                      Release Date:{" "}
                      {new Date(movie.release_date).toDateString()}
                    </span>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
        <div className="right">
          <Card>
            <CardContent>
              <FormControl className={classes.formControl}>
                <Typography className={classes.title} color="textSecondary">
                  FIND MOVIES BY:
                </Typography>
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="movieName">Movie Name</InputLabel>
                <Input id="movieName" onChange={movieNameChangeHandler} />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-checkbox">
                  Genres
                </InputLabel>
                <Select
                  multiple
                  input={<Input id="select-multiple-checkbox-genre" />}
                  renderValue={(selected) => selected.join(",")}
                  value={state.genres}
                  onChange={genreSelectHandler}
                >
                  {state.genresList.map((genre) => (
                    <MenuItem key={genre.id} value={genre.genre}>
                      <Checkbox
                        checked={state.genres.indexOf(genre.genre) > -1}
                      />
                      <ListItemText primary={genre.genre} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-checkbox">
                  Artists
                </InputLabel>
                <Select
                  multiple
                  input={<Input id="select-multiple-checkbox" />}
                  renderValue={(selected) => selected.join(",")}
                  value={state.artists}
                  onChange={artistSelectHandler}
                >
                  {state.artistsList.map((artist) => (
                    <MenuItem
                      key={artist.id}
                      value={artist.first_name + " " + artist.last_name}
                    >
                      <Checkbox
                        checked={
                          state.artists.indexOf(
                            artist.first_name + " " + artist.last_name
                          ) > -1
                        }
                      />
                      <ListItemText
                        primary={artist.first_name + " " + artist.last_name}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  id="releaseDateStart"
                  label="Release Date Start"
                  type="date"
                  defaultValue=""
                  InputLabelProps={{ shrink: true }}
                  onChange={releaseDateStartHandler}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <TextField
                  id="releaseDateEnd"
                  label="Release Date End"
                  type="date"
                  defaultValue=""
                  InputLabelProps={{ shrink: true }}
                  onChange={releaseDateEndHandler}
                />
              </FormControl>
              <br />
              <br />
              <FormControl className={classes.formControl}>
                <Button
                  onClick={() => filterApplyHandler()}
                  variant="contained"
                  color="primary"
                >
                  APPLY
                </Button>
              </FormControl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default withStyles(styles)(Home);
