import HomePage from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StickyActions from "./components/StickyActions";

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <Header />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
};

export default App;
