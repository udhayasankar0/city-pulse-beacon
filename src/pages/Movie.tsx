import { useParams } from "react-router-dom";

const Movie = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Movie Details</h1>
      <p>Movie ID: {id}</p>
      {/* Add your movie component logic here */}
    </div>
  );
};

export default Movie;