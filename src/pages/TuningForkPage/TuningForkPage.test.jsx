import { act } from 'react'
import { createRoot } from 'react-dom/client'
import TuningForkPage from './TuningForkPage'

// Keep playback tests independent of CRA's older Jest router-export resolution.
jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}))

let container, root, play, pause

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true
  window.scrollTo = jest.fn()
  play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(function () {
    this.dispatchEvent(new Event('playing'))
    return Promise.resolve()
  })
  pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root.render(<TuningForkPage />))
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  jest.restoreAllMocks()
})

test('plays the recording, restarts it on another strike and stops it', async () => {
  const fork = container.querySelector('.tuning-fork-visual')
  const audio = container.querySelector('audio')
  expect(audio.getAttribute('src')).toBe(`${process.env.PUBLIC_URL}/audio/diapasao.mp3`)
  expect(audio.volume).toBe(.7)
  await act(async () => fork.click())
  expect(fork.classList.contains('is-playing')).toBe(true)
  audio.currentTime = 5
  await act(async () => fork.click())
  expect(audio.currentTime).toBe(0)
  expect(play).toHaveBeenCalledTimes(2)
  act(() => container.querySelector('.tuning-fork-actions button:last-child').click())
  expect(fork.classList.contains('is-playing')).toBe(false)
  expect(pause).toHaveBeenCalled()
})

test('reports playback failure and allows another attempt', async () => {
  play.mockRejectedValueOnce(new Error('Network failure'))
  await act(async () => container.querySelector('.tuning-fork-visual').click())
  expect(container.querySelector('[role="status"]').textContent).toContain('Não foi possível')
  await act(async () => container.querySelector('.tuning-fork-visual').click())
  expect(container.querySelector('[role="status"]').textContent).toContain('vibrando')
})

test('clears vibration when playback ends and pauses audio on leaving', async () => {
  await act(async () => container.querySelector('.tuning-fork-visual').click())
  act(() => container.querySelector('audio').dispatchEvent(new Event('ended')))
  expect(container.querySelector('.is-playing')).toBeNull()
  pause.mockClear()
  act(() => root.render(<div />))
  expect(pause).toHaveBeenCalledTimes(1)
})
