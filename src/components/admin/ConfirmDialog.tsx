'use client'

import { AlertTriangle, X } from 'lucide-react'

/**
 * ConfirmDialog Props
 */
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  loading?: boolean
}

/**
 * ConfirmDialog Component
 *
 * Reusable confirmation modal for destructive or important actions.
 * Features:
 * - Customizable title, message, and button text
 * - Danger variant for destructive actions (red styling)
 * - Loading state for async operations
 * - Keyboard support (Escape to close)
 * - Accessible with proper ARIA attributes
 *
 * @example
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   onClose={() => setShowDialog(false)}
 *   onConfirm={handleDelete}
 *   title="Delete User"
 *   message="Are you sure you want to delete this user? This action cannot be undone."
 *   variant="danger"
 *   confirmText="Delete"
 * />
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  /**
   * Handle keyboard events (Escape to close)
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !loading) {
      onClose()
    }
  }

  /**
   * Prevent clicks inside modal from closing it
   */
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  /**
   * Get button styles based on variant
   */
  const getConfirmButtonStyles = () => {
    if (variant === 'danger') {
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
    }
    return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white'
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onKeyDown={handleKeyDown}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all"
          onClick={handleModalClick}
        >
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            disabled={loading}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Icon */}
            {variant === 'danger' && (
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            )}

            {/* Title */}
            <h3
              id="modal-title"
              className="text-xl font-bold text-gray-900 mb-2 text-center"
            >
              {title}
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${getConfirmButtonStyles()}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
