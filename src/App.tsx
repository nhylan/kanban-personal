import "./App.css";

interface ColumnProps {
  title: string;
}

function Column({ title }: ColumnProps) {
  return (
    <section className="column">
      <h2>{title}</h2>
    </section>
  );
}

function App() {
  const columns = ["To Do", "Doing", "Done"];

  return (
    <main className="container">
      <h1>My Board</h1>
      <div className="board">
        {columns.map((title) => (
          <Column key={title} title={title} />
        ))}
      </div>
    </main>
  );
}

export default App;
