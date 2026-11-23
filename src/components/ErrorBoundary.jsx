import { Component } from "react";
import { ISSUES_URL } from "../config";
import "./ErrorBoundary.css";

/**
 * Catches errors while showing a chapter (a part that fails to load because the
 * connection dropped, a browser missing a feature, a bug) so the reader sees a
 * message instead of a blank page. Pass a `resetKey` (e.g. the chapter number):
 * when it changes, the boundary tries again.
 */
export default class ErrorBoundary extends Component {
  state = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error) {
    return { error };
  }

  // A new resetKey (e.g. the reader moved to another chapter) clears the error.
  static getDerivedStateFromProps(props, state) {
    return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null;
  }

  componentDidCatch(error, info) {
    console.error("The tutorial hit an error:", error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="error-box" role="alert">
        <h2>Something went wrong</h2>
        <p>
          This part of the tutorial couldn't be shown. That can happen if your connection dropped while it was
          loading, or if your browser is missing something it needs. Trying again or reloading the page usually fixes
          it.
        </p>
        <div className="error-buttons">
          <button onClick={() => this.setState({ error: null })}>Try again</button>
          <button onClick={() => window.location.reload()}>Reload the page</button>
        </div>
        <p>
          Still stuck? <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">Tell me about it on GitHub</a>{" "}
          and include the details below.
        </p>
        <details>
          <summary>Technical details</summary>
          <pre>{String(error?.message ?? error)}</pre>
        </details>
      </div>
    );
  }
}
