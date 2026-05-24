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

    expect(screen.getByText('Session ready')).toBeInTheDocument()
    expect(screen.getByText(/Current index:/)).toHaveTextContent('Current index: 0')
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
})
