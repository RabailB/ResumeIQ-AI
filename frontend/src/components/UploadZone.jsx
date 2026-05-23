import React, { useState, useRef, useCallback } from 'react'
import client from '../api/client'
import './UploadZone.css'

const MAX_SIZE_MB = 10
const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ACCEPTED_EXTS = ['.pdf', '.docx']

function getFileIcon(file) {
  if (!file) return '📄'
  if (file.type === 'application/pdf') return '📕'
  return '📘'
}

export default function UploadZone({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const inputRef = useRef(null)

  const validateFile = useCallback((f) => {
    if (!f) return 'No file selected'
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!ACCEPTED_EXTS.includes(ext) && !ACCEPTED_TYPES.includes(f.type)) {
      return 'Please upload a PDF or DOCX file only.'
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size must be under ${MAX_SIZE_MB}MB.`
    }
    return null
  }, [])

  const handleFileSelect = useCallback((f) => {
    const err = validateFile(f)
    if (err) {
      setError(err)
      setFile(null)
      return
    }
    setError('')
    setFile(f)
  }, [validateFile])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const onDragLeave = useCallback(() => {
    setDragging(false)
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFileSelect(dropped)
  }, [handleFileSelect])

  const onInputChange = useCallback((e) => {
    const selected = e.target.files[0]
    if (selected) handleFileSelect(selected)
  }, [handleFileSelect])

  const handleUpload = useCallback(async () => {
    if (!file) return
    setUploading(true)
    setProgress(0)
    setError('')
    setSuccess(false)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await client.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded * 100) / (e.total || 1))
          setProgress(pct)
        },
      })
      setSuccess(true)
      setTimeout(() => {
        onUploadSuccess && onUploadSuccess(response.data.id)
      }, 600)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }, [file, onUploadSuccess])

  const handleReset = useCallback(() => {
    setFile(null)
    setError('')
    setSuccess(false)
    setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  return (
    <div className="upload-zone-wrapper">
      {/* Drop area */}
      <div
        className={`drop-area ${dragging ? 'dragging' : ''} ${file ? 'has-file' : ''} ${success ? 'success' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !file && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !file && inputRef.current?.click()}
        aria-label="Resume upload area"
        id="resume-drop-zone"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={onInputChange}
          style={{ display: 'none' }}
          id="resume-file-input"
        />

        {success ? (
          <div className="upload-state">
            <div className="upload-icon success-icon">✅</div>
            <p className="upload-title">Upload Successful!</p>
            <p className="upload-sub">Starting analysis…</p>
          </div>
        ) : file ? (
          <div className="upload-state">
            <div className="upload-icon file-icon">{getFileIcon(file)}</div>
            <p className="upload-title">{file.name}</p>
            <p className="upload-sub">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            {uploading && (
              <div className="upload-progress-wrap">
                <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
                <span className="upload-progress-text">{progress}%</span>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-state">
            <div className="upload-icon cloud-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" />
                <line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p className="upload-title">Drop your resume here</p>
            <p className="upload-sub">or <span className="browse-link">click to browse</span></p>
            <div className="upload-formats">
              <span className="format-tag">PDF</span>
              <span className="format-tag">DOCX</span>
              <span className="format-limit">Max {MAX_SIZE_MB}MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error fade-in">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      {file && !success && (
        <div className="upload-actions fade-in">
          <button
            className="btn-outline btn-sm"
            onClick={handleReset}
            disabled={uploading}
            id="upload-reset-btn"
          >
            Change File
          </button>
          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={uploading || !file}
            id="upload-submit-btn"
          >
            {uploading ? (
              <>
                <div className="spinner" />
                <span>Uploading… {progress}%</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                <span>Upload & Analyze</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
