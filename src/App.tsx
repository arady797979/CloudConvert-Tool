
import DocumentConverter from './components/DocumentConverter';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>CloudConvert</h1>
        <p>
          A fast, secure, frontend-only document converter.
          Transform your images into professional PDFs entirely in your browser.
        </p>
      </header>
      
      <main>
        <DocumentConverter />
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} CloudConvert. All processing happens locally on your device.</p>
      </footer>
    </div>
  );
}

export default App;
