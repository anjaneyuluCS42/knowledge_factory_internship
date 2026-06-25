import React from "react";

class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, info) {
    console.log("Error :", error);
    console.log("Info :", info);
  }

  render() {

    if (this.state.hasError) {

      return (
        <h1>
          Something Went Wrong 😢
        </h1>
      );

    }

    return this.props.children;
  }
}

export default ErrorBoundary;