import { Component, type ReactNode } from "react";

interface WebGLBoundaryProps {
  /** O que mostrar se a cena 3D (ou o chunk dela) falhar */
  fallback: ReactNode;
  children: ReactNode;
}

interface WebGLBoundaryState {
  failed: boolean;
}

/**
 * ErrorBoundary em volta do <Canvas>: se o Three.js quebrar (contexto WebGL
 * recusado, shader que não compila, chunk que não carregou), mostra o fallback
 * em vez de derrubar a página.
 */
export default class WebGLBoundary extends Component<WebGLBoundaryProps, WebGLBoundaryState> {
  state: WebGLBoundaryState = { failed: false };

  static getDerivedStateFromError(): WebGLBoundaryState {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
