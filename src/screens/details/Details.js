import React from 'react';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import './Details.css';
import YouTube from 'react-youtube';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Link } from 'react-router-dom';

function Details(props) {
    const [state, setState] = React.useState({
        movie: {
            genres: [],
            trailer_url: "",
            artists: []
        },
        starIcons: [{
            id: 1,
            stateId: "star1",
            color: "black"
        },
            {
                id: 2,
                stateId: "star2",
                color: "black"
            },
            {
                id: 3,
                stateId: "star3",
                color: "black"
            },
            {
                id: 4,
                stateId: "star4",
                color: "black"
            },
            {
                id: 5,
                stateId: "star5",
                color: "black"
            }]
    });

    async function loadMovies() {
        const response = await fetch(`${props.baseUrl}movies/${props.match.params.id}`);
        const movie = await response.json();
        setState({...state, movie: movie });
    }
    React.useEffect(() => {
        loadMovies()
    }, []);

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
        }
    };

    const artistClickHandler = (url) => {
        window.location = url;
    }

    const starClickHandler = (id) => {
        let starIconList = [];
        for (let star of state.starIcons) {
            let starNode = star;
            if (star.id <= id) {
                starNode.color = "yellow"
            }
            else {
                starNode.color = "black";

            }
            starIconList.push(starNode);
        }
        setState({...state, starIcons: starIconList });
    }

    return (
        <div className="details">
            <Header id={props.match.params.id} baseUrl={props.baseUrl} showBookShowButton="true" />
            <div className="back">
                <Typography>
                    <Link to="/">  &#60; Back to Home</Link>
                </Typography>
            </div>
            <div className="containerDetails">
                <div className="details-left">
                    <img src={state.movie.poster_url} alt={state.movie.title} />
                </div>

                <div className="details-center">
                    <div>
                        <Typography variant="headline" component="h2">{state.movie.title} </Typography>
                    </div>
                    <br />
                    <div>
                        <Typography>
                            <span className="bold">Genres: </span> {state.movie.genres.join(', ')}
                        </Typography>
                    </div>
                    <div>
                        <Typography><span className="bold">Duration:</span> {state.movie.duration} </Typography>
                    </div>
                    <div>
                        <Typography><span className="bold">Release Date:</span> {new Date(state.movie.release_date).toDateString()} </Typography>
                    </div>
                    <div>
                        <Typography><span className="bold"> Rating:</span> {state.movie.critics_rating}  </Typography>
                    </div>
                    <div className="top-margin">
                        <Typography><span className="bold">Plot:</span> <a href={state.movie.wiki_url}>(Wiki Link)</a> {state.movie.storyline} </Typography>
                    </div>
                    <div className="trailerContainer">
                        <Typography>
                            <span className="bold">Trailer:</span>
                        </Typography>
                        <YouTube
                            videoId={state.movie.trailer_url.split("?v=")[1]}
                            opts={opts}
                        />
                    </div>
                </div>

                <div className="details-right">
                    <Typography>
                        <span className="bold">Rate this movie: </span>
                    </Typography>
                    {state.starIcons.map(star => (
                        <StarBorderIcon
                            className={star.color}
                            key={"star" + star.id}
                            onClick={() => starClickHandler(star.id)}
                        />
                    ))}

                    <div className="bold top-margin bottom-margin=">
                        <Typography>
                            <span className="bold">Artists:</span>
                        </Typography>
                    </div>
                    <div className="right-padding">
                        <GridList cellHeight={160} cols={2}>
                            {state.movie.artists != null && state.movie.artists.map(artist => (
                                <GridListTile
                                    className="gridTile"
                                    onClick={() => artistClickHandler(artist.wiki_url)}
                                    key={artist.id}>
                                    <img src={artist.profile_url} alt={artist.first_name + " " + artist.last_name} />
                                    <GridListTileBar
                                        title={artist.first_name + " " + artist.last_name}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Details;