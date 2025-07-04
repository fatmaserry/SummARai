import AuthProvider from "./provider/auth/authProvider";
import { SSEProvider } from "./provider/context/SSEContext";
import Routes from "./routes";

function App() {
  return (
    <AuthProvider>
      <SSEProvider>
        {/* The SSEProvider wraps the Routes to provide SSE functionality throughout the app */}
        <Routes />
      </SSEProvider>
    </AuthProvider>
  );
}

export default App;
