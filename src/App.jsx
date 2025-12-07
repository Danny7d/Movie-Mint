import { Link } from "react-router-dom";
import Navigation from "./components/Navigations";
import Searchbar from "./components/Searchbar";
import SuggestionSection from "./components/SuggestionSection";
import Trending from "./components/Trending";
import "./App.css";

function App() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold gradient-text ml-4">
          MovieMint
        </Link>
        <div className="flex-1 flex justify-center">
          <Searchbar />
        </div>
      </div>
      <nav></nav>
      <SuggestionSection />
      <Trending />
    </div>
  );
}

export default App;
