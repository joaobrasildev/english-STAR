import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../App'

const createSession = vi.fn()

vi.mock('../services/api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/api')>()

  return {
    ...actual,
    createSession: (...args: unknown[]) => createSession(...args),
  }
})

describe('Session setup flow', () => {
  afterEach(() => {
    createSession.mockReset()
  })

  it('shows a preview in the same order as the numbered questions', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(
      screen.getByLabelText('Questions'),
      '1. Tell me about yourself\n2. Describe a challenge you solved',
    )

    const previewItems = screen.getAllByRole('listitem')
    expect(previewItems.map((item) => item.textContent)).toEqual([
      'Tell me about yourself',
      'Describe a challenge you solved',
    ])
  })

  it('preserves multiline questions in the preview and when starting the session', async () => {
    const user = userEvent.setup()
    createSession.mockResolvedValue({
      sessionId: 'server-session-1',
      rawQuestionBlock:
        '1. Tell me about yourself\nFocus on the most recent role.\n\n2. Describe a challenge you solved',
      parsedQuestions: [
        'Tell me about yourself\nFocus on the most recent role.',
        'Describe a challenge you solved',
      ],
      targetSeconds: 120,
      status: 'active',
    })

    render(<App />)

    await user.type(
      screen.getByLabelText('Questions'),
      '1. Tell me about yourself{enter}Focus on the most recent role.{enter}{enter}2. Describe a challenge you solved',
    )

    const previewItems = screen.getAllByRole('listitem')
    expect(previewItems[0].querySelector('.preview-question')?.textContent).toBe(
      'Tell me about yourself\nFocus on the most recent role.',
    )

    await user.click(screen.getByRole('button', { name: 'Start session' }))

    expect(await screen.findByText('Practice the current STAR answer')).toBeInTheDocument()
    expect(
      screen.getByText((_, element) => {
        return (
          element?.classList.contains('question-text') === true &&
          element.textContent === 'Tell me about yourself\nFocus on the most recent role.'
        )
      }),
    ).toBeInTheDocument()
  })

  it('creates the initial session state with currentIndex zero when starting a valid session', async () => {
    const user = userEvent.setup()
    createSession.mockResolvedValue({
      sessionId: 'server-session-1',
      rawQuestionBlock:
        '1. Tell me about yourself\n2. Describe a challenge you solved',
      parsedQuestions: [
        'Tell me about yourself',
        'Describe a challenge you solved',
      ],
      targetSeconds: 150,
      status: 'active',
    })

    render(<App />)

    await user.type(
      screen.getByLabelText('Questions'),
      '1. Tell me about yourself\n2. Describe a challenge you solved',
    )
    await user.clear(screen.getByLabelText('Target time (seconds)'))
    await user.type(screen.getByLabelText('Target time (seconds)'), '150')
    await user.click(screen.getByRole('button', { name: 'Start session' }))

    expect(await screen.findByText('Practice the current STAR answer')).toBeInTheDocument()
    expect(screen.getByText('Tell me about yourself')).toBeInTheDocument()
    expect(createSession).toHaveBeenCalledWith({
      rawQuestionBlock: '1. Tell me about yourself\n2. Describe a challenge you solved',
      parsedQuestions: [
        'Tell me about yourself',
        'Describe a challenge you solved',
      ],
      targetSeconds: 150,
    })
  })

  it('blocks session start when the question block is invalid', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.type(
      screen.getByLabelText('Questions'),
      'Tell me about yourself\nDescribe a challenge',
    )
    await user.click(screen.getByRole('button', { name: 'Start session' }))

    expect(
      screen.getByText('Add at least one numbered question before starting.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Session ready')).not.toBeInTheDocument()
    expect(createSession).not.toHaveBeenCalled()
  })

  it('keeps the user in setup with a clear error when createSession fails', async () => {
    const user = userEvent.setup()
    createSession.mockRejectedValue(new Error('Session setup failed.'))

    render(<App />)

    await user.type(
      screen.getByLabelText('Questions'),
      '1. Tell me about yourself\n2. Describe a challenge you solved',
    )
    await user.click(screen.getByRole('button', { name: 'Start session' }))

    expect(await screen.findByText('Session setup failed.')).toBeInTheDocument()
    expect(screen.queryByText('Practice the current STAR answer')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Questions')).toHaveValue(
      '1. Tell me about yourself\n2. Describe a challenge you solved',
    )
    expect(screen.getByLabelText('Target time (seconds)')).toHaveValue(120)
  })

  it('renders session controls separately from the preview area without moving the main actions', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)

    await user.type(
      screen.getByLabelText('Questions'),
      '1. Tell me about yourself\n2. Describe a challenge you solved',
    )

    const controlsPanel = container.querySelector('.setup-controls-panel')
    const previewColumn = container.querySelector('.setup-preview-column')
    const previewPanel = previewColumn?.querySelector('.preview-panel')
    const previewList = previewPanel?.querySelector('.preview-list')

    expect(controlsPanel).toContainElement(screen.getByLabelText('Target time (seconds)'))
    expect(controlsPanel).toContainElement(
      screen.getByRole('button', { name: 'Start session' }),
    )
    expect(controlsPanel).toContainElement(
      screen.getByRole('button', { name: 'View history' }),
    )
    expect(previewPanel).toContainElement(screen.getByRole('heading', { name: 'Question preview' }))
    expect(previewList).toBeInTheDocument()
    expect(previewList?.children).toHaveLength(2)
  })

  it('blocks multiple starts while the session creation is loading', async () => {
    const user = userEvent.setup()
    let resolveCreateSession: ((value: unknown) => void) | undefined
    createSession.mockReturnValue(
      new Promise((resolve) => {
        resolveCreateSession = resolve
      }),
    )

    render(<App />)

    await user.type(
      screen.getByLabelText('Questions'),
      '1. Tell me about yourself\n2. Describe a challenge you solved',
    )

    const startButton = screen.getByRole('button', { name: 'Start session' })
    await user.click(startButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Starting session...' })).toBeDisabled()
    })

    expect(createSession).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'View history' })).toBeDisabled()

    resolveCreateSession?.({
      sessionId: 'server-session-1',
      rawQuestionBlock:
        '1. Tell me about yourself\n2. Describe a challenge you solved',
      parsedQuestions: [
        'Tell me about yourself',
        'Describe a challenge you solved',
      ],
      targetSeconds: 120,
      status: 'active',
    })

    expect(await screen.findByText('Practice the current STAR answer')).toBeInTheDocument()
  })
})
