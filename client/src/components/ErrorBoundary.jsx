import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-center px-6">
          <h1 className="text-4xl font-bold text-white mb-3">Something went wrong</h1>
          <p className="text-gray-400 mb-8 text-sm">An unexpected error occurred. Try refreshing the page.</p>
          <div className="flex gap-4">
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/40"
            >
              Refresh Page
            </button>
            <a
              href="/"
              className="px-6 py-3 bg-white/[0.05] border border-white/10 text-gray-300 rounded-xl font-semibold text-sm hover:bg-white/[0.09] hover:text-white transition"
            >
              Go Home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
