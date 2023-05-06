import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditMovieForm = (props) => {
  const { push } = useHistory();
  const { setMovies } = props;

  const [movie, setMovie] = useState({
    title: "",
    director: "",
    genre: "",
    metascore: 0,
    description: "",
  });

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const swalWithBootstrapButtons = Swal.mixin({
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Emin misin?",
        text: `${movie.title} isimli film eklenecek`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Evet, ekle",
        cancelButtonText: "Hayır, ekleme!",
        reverseButtons: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            "Olleyyy",
            `${movie.title} isimli film eklendi`,
            "success"
          );

          axios
            .post(`http://localhost:9000/api/movies/`, movie)
            .then((res) => {
              setMovies(res.data);
              push(`/movies`);
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Eklenmedi",
            "Ekleme işlemi onaylanmadı",
            "error"
          );
        }
      });
  };

  const { title, director, genre, metascore, description } = movie;

  return (
    <div className="bg-white rounded-md shadow flex-1">
      <form onSubmit={handleSubmit}>
        <div className="p-5 pb-3 border-b border-zinc-200">
          <h4 className="text-xl font-bold">
            Ekleniyor <strong>{movie.title}</strong>
          </h4>
        </div>

        <div className="px-5 py-3">
          <div className="py-2">
            <label className="block pb-1 text-lg">Title</label>
            <input
              value={title}
              onChange={handleChange}
              name="title"
              type="text"
            />
          </div>
          <div className="py-2">
            <label className="block pb-1 text-lg">Director</label>
            <input
              value={director}
              onChange={handleChange}
              name="director"
              type="text"
            />
          </div>
          <div className="py-2">
            <label className="block pb-1 text-lg">Genre</label>
            <input
              value={genre}
              onChange={handleChange}
              name="genre"
              type="text"
            />
          </div>
          <div className="py-2">
            <label className="block pb-1 text-lg">Metascore</label>
            <input
              value={metascore}
              onChange={handleChange}
              name="metascore"
              type="number"
            />
          </div>
          <div className="py-2">
            <label className="block pb-1 text-lg">Description</label>
            <textarea
              value={description}
              onChange={handleChange}
              name="description"
            ></textarea>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-zinc-200 flex justify-end gap-2">
          <Link to={`/movies/1`} className="myButton bg-zinc-500">
            Vazgeç
          </Link>
          <button
            type="submit"
            className="myButton bg-green-700 hover:bg-green-600"
          >
            Ekle
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMovieForm;
