import { Component, type ReactNode } from 'react'
import { useStore } from '../lib/store'

/** Last line of defence: a friendly recovery screen instead of a blank page. The book is autosaved. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: unknown) { console.error('Folio crashed:', error) }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="crash" role="alert">
        <div className="modal-card">
          <h2>Something went wrong on our side</h2>
          <p>Your book is saved. Reload to pick up where you left off.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn ghost" onClick={() => { useStore.getState().restart(); location.reload() }}>Start a new book</button>
            <button className="btn primary" onClick={() => location.reload()}>Reload</button>
          </div>
        </div>
      </div>
    )
  }
}
