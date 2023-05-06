import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";
import MovieHeader from "./components/MovieHeader";
import EditMovieForm from "./components/EditMovieForm";
import FavoriteMovieList from "./components/FavoriteMovieList";
import AddMovieForm from "./components/AddMovieForm";
import axios from "axios";

//modal için sweetalert kütüphanesi
import Swal from "sweetalert2";

//import withReactContent from "sweetalert2-react-content";
//const MySwal = withReactContent(Swal);

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const { push } = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/movies")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const deleteMovie = (id) => {
    const movie = movies.find((movie) => movie.id === id);

    Swal.fire({
      title: `${movie.title} filmini silmek istediğinden emin misin?`,
      text: "Bunun geri dönüşü yoktur bilesin!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Evet, sil gitsin!",
      cancelButtonText: "Vazgeç",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Silindi!", `${movie.title} adlı film silindi`, "success");
        axios
          .delete(`http://localhost:9000/api/movies/${id}`)
          .then((res) => {
            console.log(res);
            //setMovies(movies.filter((movie)=>movie.id!==id)); normalde kullanılacak silme methodu
            setMovies(res.data); // bu örnek için yeterli olan silme delete ile gerçekleştiği için kalan filmleri döndüren method
            push("/movies");
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
    });
  };

  const addToFavorites = (movie) => {
    if (!favoriteMovies.find((favMovie) => favMovie.id === movie.id)) {
      setFavoriteMovies([...favoriteMovies, movie]);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: `${movie.title} adlı film zaten favori listenizde`,
        footer: "Bir film favori listenizde sadece 1 defa yer alabilir",
      });
    }
  };

  return (
    <div>
      <nav className="bg-zinc-800 px-6 py-3">
        <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-3 pb-4">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList favoriteMovies={favoriteMovies} />

          <Switch>
            <Route path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/add">
              <AddMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/:id">
              <Movie
                addToFavorites={addToFavorites}
                deleteMovie={deleteMovie}
              />
            </Route>

            <Route path="/movies">
              <MovieList movies={movies} />
            </Route>

            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;
