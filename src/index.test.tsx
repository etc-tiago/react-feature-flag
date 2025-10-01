import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import FeatureFlagGate from './index'

// Mock the cookie module
vi.mock('cookie', () => ({
  default: {
    parse: vi.fn()
  }
}))

// Import the mocked cookie module
import cookie from 'cookie'

const mockCookieParse = cookie.parse as ReturnType<typeof vi.fn>

describe('FeatureFlagGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: ''
    })
  })

  describe('SSR functionality (with cookieHeader)', () => {
    it('should render children when feature flag is enabled via cookieHeader', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': 'true' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=true">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=true')
    })

    it('should not render children when feature flag is disabled via cookieHeader', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': '' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=')
    })

    it('should not render children when feature flag is missing from cookieHeader', () => {
      mockCookieParse.mockReturnValue({ 'other-flag': 'true' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="other-flag=true">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('other-flag=true')
    })

    it('should not render children when cookieHeader is empty', () => {
      mockCookieParse.mockReturnValue({})

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('')
    })

    it('should handle truthy non-string values in cookies', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': '1' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=1">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=1')
    })

    it('should handle falsy values in cookies', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': '' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=')
    })

    it('should handle string "false" as truthy (JavaScript behavior)', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': 'false' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=false">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      // String "false" is truthy in JavaScript
      expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=false')
    })
  })

  describe('Client-side functionality (without cookieHeader)', () => {
    it('should render children when feature flag is enabled via document.cookie', async () => {
      mockCookieParse.mockReturnValue({ 'test-flag': 'true' })
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'test-flag=true'
      })

      render(
        <FeatureFlagGate cookieName="test-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      await waitFor(() => {
        expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      })
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=true')
    })

    it('should not render children when feature flag is disabled via document.cookie', async () => {
      mockCookieParse.mockReturnValue({ 'test-flag': '' })
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'test-flag='
      })

      render(
        <FeatureFlagGate cookieName="test-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      await waitFor(() => {
        expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      })
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=')
    })

    it('should not render children when feature flag is missing from document.cookie', async () => {
      mockCookieParse.mockReturnValue({ 'other-flag': 'true' })
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'other-flag=true'
      })

      render(
        <FeatureFlagGate cookieName="test-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      await waitFor(() => {
        expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      })
      expect(mockCookieParse).toHaveBeenCalledWith('other-flag=true')
    })

    it('should not render children when document.cookie is empty', async () => {
      mockCookieParse.mockReturnValue({})
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: ''
      })

      render(
        <FeatureFlagGate cookieName="test-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      await waitFor(() => {
        expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      })
      expect(mockCookieParse).toHaveBeenCalledWith('')
    })

    it('should not render children initially (loading state)', () => {
      // Don't mock cookie.parse for this test to ensure it doesn't run

      render(
        <FeatureFlagGate cookieName="test-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      // Initially should not render children
      expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
    })

    it('should handle document.cookie being null', async () => {
      mockCookieParse.mockReturnValue({})
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: null
      })

      render(
        <FeatureFlagGate cookieName="test-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      await waitFor(() => {
        expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      })
      expect(mockCookieParse).toHaveBeenCalledWith('')
    })

    it('should handle document.cookie being undefined', async () => {
      mockCookieParse.mockReturnValue({})
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: undefined
      })

      render(
        <FeatureFlagGate cookieName="test-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      await waitFor(() => {
        expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      })
      expect(mockCookieParse).toHaveBeenCalledWith('')
    })

    it('should re-evaluate when cookieName changes', async () => {
      mockCookieParse
        .mockReturnValueOnce({ 'test-flag': '' })
        .mockReturnValueOnce({ 'new-flag': 'true' })

      const { rerender } = render(
        <FeatureFlagGate cookieName="test-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      await waitFor(() => {
        expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      })

      // Change cookieName
      rerender(
        <FeatureFlagGate cookieName="new-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      await waitFor(() => {
        expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      })
    })

    it('should not re-evaluate when cookieHeader is provided (SSR mode)', () => {
      mockCookieParse
        .mockReturnValueOnce({ 'test-flag': 'true' }) // First render
        .mockReturnValueOnce({ 'test-flag': 'true' }) // Second render - different cookieName not found in header

      const { rerender } = render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=true">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledTimes(1)

      // Re-render with different cookieName but same cookieHeader
      rerender(
        <FeatureFlagGate cookieName="different-flag" cookieHeader="test-flag=true">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      // Should not render because 'different-flag' is not in the cookieHeader
      expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge cases and error scenarios', () => {
    it('should handle complex children (React elements)', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': 'true' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=true">
          <div>
            <h1>Title</h1>
            <p>Description</p>
            <button type="button">Click me</button>
          </div>
        </FeatureFlagGate>
      )

      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('should handle string children', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': 'true' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=true">
          Simple text content
        </FeatureFlagGate>
      )

      expect(screen.getByText('Simple text content')).toBeInTheDocument()
    })

    it('should handle number children', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': 'true' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=true">
          {42}
        </FeatureFlagGate>
      )

      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should handle empty children', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': 'true' })

      const { container } = render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=true">
          {null}
        </FeatureFlagGate>
      )

      expect(container.firstChild).toBeNull()
    })

    it('should handle multiple cookies in header', () => {
      mockCookieParse.mockReturnValue({
        'test-flag': 'true',
        'other-flag': 'false',
        'session': 'abc123'
      })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=true; other-flag=false; session=abc123">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=true; other-flag=false; session=abc123')
    })

    it('should handle special characters in cookie name', () => {
      mockCookieParse.mockReturnValue({ 'test-flag-with-dashes': 'true' })

      render(
        <FeatureFlagGate cookieName="test-flag-with-dashes" cookieHeader="test-flag-with-dashes=true">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag-with-dashes=true')
    })

    it('should handle special characters in cookie value', () => {
      mockCookieParse.mockReturnValue({ 'test-flag': 'enabled=true&active=yes' })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=enabled%3Dtrue%26active%3Dyes">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=enabled%3Dtrue%26active%3Dyes')
    })
  })

  describe('Component props validation', () => {
    it('should work with required props only', async () => {
      mockCookieParse.mockReturnValue({ 'test-flag': '' })

      render(
        <FeatureFlagGate cookieName="test-flag">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      // Should not render initially (client-side loading)
      expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()

      // Wait for the effect to run
      await waitFor(() => {
        expect(screen.queryByText('Feature enabled')).not.toBeInTheDocument()
      })
    })

    it('should prioritize cookieHeader over document.cookie when both are available', () => {
      mockCookieParse
        .mockReturnValueOnce({ 'test-flag': 'true' }) // For cookieHeader
        .mockReturnValueOnce({ 'test-flag': 'false' }) // For document.cookie (should not be called)

      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: 'test-flag=false'
      })

      render(
        <FeatureFlagGate cookieName="test-flag" cookieHeader="test-flag=true">
          <div>Feature enabled</div>
        </FeatureFlagGate>
      )

      expect(screen.getByText('Feature enabled')).toBeInTheDocument()
      expect(mockCookieParse).toHaveBeenCalledTimes(1)
      expect(mockCookieParse).toHaveBeenCalledWith('test-flag=true')
    })
  })
})
