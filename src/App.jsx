import { Link } from "react-router-dom";
import Searchbar from "./components/Searchbar";
import SuggestionSection from "./components/SuggestionSection";
import Trending from "./components/Trending";
import Popular from "./components/Popular";
import Background from "./Background";
import "./App.css";

function App({ style }) {
  return (
    <div style={style}>
      <div className="absolute top-4 left-4">
        <Link to="/" className="text-3xl font-bold gradient-text">
          MovieMint
        </Link>
      </div>
      <div className="flex justify-center pt-4">
        <Searchbar />
      </div>
      <Background />
      <nav></nav>
      <SuggestionSection />
      <Trending />
      <Popular />
    </div>
  );
}

export default App;
