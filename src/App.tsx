import DocumentConverter from './components/DocumentConverter';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>CloudConvert</h1>
        <p>
          Drop any file — images, Word docs, spreadsheets, code, Markdown, HTML —
          and download a clean PDF. No uploads. No servers. 100% in your browser.
        </p>
      </header>

      <main>
        <DocumentConverter />
      </main>

      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} CloudConvert &mdash; All conversion
          happens locally on your device. Your files never leave your browser.
        </p>
      </footer>
    </div>
  );
}

export default App;
