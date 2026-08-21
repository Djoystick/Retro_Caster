import React from 'react'

export class ErrorBoundary extends React.Component<any, { hasError: boolean, error: any }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) {
    const fs = require('fs');
    const path = require('path');
    try {
      fs.writeFileSync(path.join(process.env.APPDATA || '', 'retrocaster-app', 'crash.log'), String(error.stack) + '\n' + JSON.stringify(errorInfo));
    } catch (e) {}
  }
  render() {
    if (this.state.hasError) return <div style={{color:'red', background:'black', padding:'20px'}}><h1>CRASH</h1><pre>{String(this.state.error?.stack)}</pre></div>;
    return this.props.children;
  }
}
