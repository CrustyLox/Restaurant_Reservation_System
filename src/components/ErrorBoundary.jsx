import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-8">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full border border-red-100">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong.</h1>
            <p className="text-gray-700 mb-4">The application encountered a critical error and could not render.</p>
            <div className="bg-gray-100 p-4 rounded text-sm font-mono overflow-auto max-h-64 mb-4 text-red-800">
              {this.state.error && this.state.error.toString()}
            </div>
            <details className="cursor-pointer text-sm text-gray-500">
              <summary className="font-bold mb-2">Component Stack</summary>
              <pre className="mt-2 text-[10px] whitespace-pre-wrap bg-gray-50 p-4 rounded border border-gray-200">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button 
              onClick={() => window.location.href = '/'}
              className="mt-6 bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
