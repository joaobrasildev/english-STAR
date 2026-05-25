import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

describe('Session setup flow', () => {
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

    render(<App />)

    await user.type(
      screen.getByLabelText('Questions'),
      '1. Tell me about yourself\n2. Describe a challenge you solved',
    )
    await user.clear(screen.getByLabelText('Target time (seconds)'))
    await user.type(screen.getByLabelText('Target time (seconds)'), '150')
    await user.click(screen.getByRole('button', { name: 'Start session' }))

    expect(screen.getByText('Practice the current STAR answer')).toBeInTheDocument()
    expect(screen.getByText('Tell me about yourself')).toBeInTheDocument()
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
})
