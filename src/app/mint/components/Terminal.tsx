'use client'

import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type RefObject,
  type UIEvent,
} from 'react'

interface TerminalProps {
  terminalLogs: string[]
  terminalRef?: RefObject<HTMLDivElement | null>
  className?: string
  compact?: boolean
}

interface TerminalRowProps {
  log: string
  rowClassName: string
}

const EMPTY_MESSAGE = 'No logs yet. Start recording or training to see logs here.'
const AUTO_SCROLL_THRESHOLD = 48

function getLogColorClass(log: string) {
  const normalizedLog = log.toUpperCase()

  if (normalizedLog.includes('ERROR') || log.includes('\u274c')) {
    return 'text-red-400'
  }
  if (normalizedLog.includes('WARNING') || normalizedLog.includes('WARN') || log.includes('\u26a0')) {
    return 'text-yellow-300'
  }
  if (
    normalizedLog.includes('SUCCESS') ||
    normalizedLog.includes('COMPLETE') ||
    normalizedLog.includes('[PROGRESS]') ||
    log.includes('\u2705') ||
    log.includes('\u2713')
  ) {
    return 'text-emerald-400'
  }
  if (normalizedLog.includes('INFO') || normalizedLog.includes('[INFO]')) {
    return 'text-sky-400'
  }

  return 'text-zinc-300'
}

function isScrolledNearBottom(element: HTMLDivElement) {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= AUTO_SCROLL_THRESHOLD
}

const TerminalRow = memo(function TerminalRow({ log, rowClassName }: TerminalRowProps) {
  return (
    <div className={`${rowClassName} ${getLogColorClass(log)}`}>
      <span className="shrink-0 select-none text-sky-500/55">{'\u203a'}</span>
      <span className="min-w-0 flex-1 whitespace-pre-wrap break-words  text-left [overflow-wrap:anywhere]">
        {log}
      </span>
    </div>
  )
})

function Terminal({ terminalLogs, terminalRef, className = '', compact = false }: TerminalProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const shouldFollowTailRef = useRef(true)
  const rowClassName = useMemo(
    () =>
      [
        'box-border flex min-w-full items-start justify-start gap-2 px-3 text-left font-mono',
        'transition-colors hover:bg-white/[0.03]',
        compact ? 'py-0.5 text-[9px] leading-4' : 'py-0.5 text-[9px] leading-[18px]',
      ].join(' '),
    [compact],
  )
  const scrollContainerStyle = useMemo<CSSProperties>(
    () => ({
      height: '100%',
      overflowAnchor: 'none',
      overflowX: 'hidden',
      overflowY: 'auto',
      scrollbarGutter: 'stable',
      scrollBehavior: 'auto',
      width: '100%',
    }),
    [],
  )

  const scrollToLatestLog = useCallback(() => {
    const element = scrollContainerRef.current
    if (!element) return

    element.scrollTop = element.scrollHeight
  }, [])

  const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
    shouldFollowTailRef.current = isScrolledNearBottom(event.currentTarget)
  }, [])

  useLayoutEffect(() => {
    if (terminalLogs.length === 0) {
      shouldFollowTailRef.current = true
      return
    }

    if (!shouldFollowTailRef.current) return

    scrollToLatestLog()
  }, [scrollToLatestLog, terminalLogs])

  useEffect(() => {
    const element = scrollContainerRef.current
    if (!element || typeof ResizeObserver === 'undefined') return

    const resizeObserver = new ResizeObserver(() => {
      if (shouldFollowTailRef.current) {
        scrollToLatestLog()
      }
    })

    resizeObserver.observe(element)

    return () => resizeObserver.disconnect()
  }, [scrollToLatestLog])

  return (
    <div
      ref={terminalRef}
      className={`min-h-0 min-w-0 flex-1 overflow-hidden bg-black/50 font-mono leading-relaxed ${className}`}
    >
      {terminalLogs.length > 0 ? (
        <div
          aria-label="Terminal output"
          className="custom-scrollbar overscroll-contain overflow-x-hidden overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb:hover]:bg-sky-500/70 [&::-webkit-scrollbar-track]:bg-zinc-950/80"
          onScroll={handleScroll}
          ref={scrollContainerRef}
          role="log"
          style={scrollContainerStyle}
        >
          <div className="min-w-full py-1">
            {terminalLogs.map((log, index) => (
              <TerminalRow
                key={index}
                log={log}
                rowClassName={rowClassName}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-full min-h-24 items-start justify-start p-4 text-left font-mono text-[10px] italic leading-relaxed text-zinc-600">
          {EMPTY_MESSAGE}
        </div>
      )}
    </div>
  )
}

export default memo(Terminal)
