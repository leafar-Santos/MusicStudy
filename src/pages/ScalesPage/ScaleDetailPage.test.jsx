import { act } from 'react'
import { createRoot } from 'react-dom/client'
import ScaleDetailPage from './ScaleDetailPage'
import { loadScaleSamples } from '../../audio/scaleSamples'

jest.mock('../../audio/scaleSamples', () => ({
  ...jest.requireActual('../../audio/scaleSamples'),
  loadScaleSamples: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  useParams: () => ({ slug: 'menor-melodica' }),
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}))

let container, root, voices, context
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true
  window.scrollTo = jest.fn()
  voices = []
  context = {
    currentTime: 0, destination: {}, resume: jest.fn().mockResolvedValue(), close: jest.fn().mockResolvedValue(),
    createGain: () => ({ connect: jest.fn(), disconnect: jest.fn(), gain: { value: 0, setTargetAtTime: jest.fn(), setValueAtTime: jest.fn(), linearRampToValueAtTime: jest.fn(), exponentialRampToValueAtTime: jest.fn() } }),

  }
  loadScaleSamples.mockReset()
  loadScaleSamples.mockResolvedValue({ play: (midi, time, duration) => {
    const voice = { midi, time, duration, stop: jest.fn() }
    voices.push(voice)
    return voice
  } })
  window.AudioContext = jest.fn(() => context)
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  act(() => root.render(<ScaleDetailPage />))
})
afterEach(() => {
  act(() => root.unmount())
  container.remove()
  delete window.AudioContext
  jest.restoreAllMocks()
})

test('schedules all notes with musical timing and cancels on tonic changes', async () => {
  await act(async () => container.querySelector('.scale-playback button').click())
  expect(voices).toHaveLength(8)
  expect(voices[0].midi).toBe(69)
  expect(voices[1].time - voices[0].time).toBeCloseTo(.6)
  const tonic = container.querySelectorAll('select')[1]
  act(() => { tonic.value = 'C'; tonic.dispatchEvent(new Event('change', { bubbles: true })) })
  voices.forEach(voice => expect(voice.stop).toHaveBeenCalledTimes(1))
  expect(container.querySelector('[role="status"]').textContent).toBe('Pronto para ouvir')
})

test('changes melodic descent to natural notes and plays a single staff note', async () => {
  const direction = container.querySelectorAll('select')[2]
  act(() => { direction.value = 'descending'; direction.dispatchEvent(new Event('change', { bubbles: true })) })
  expect(Array.from(container.querySelectorAll('.scale-note-buttons strong')).map(node => node.textContent)).toEqual(['Lá', 'Sol', 'Fá', 'Mi', 'Ré', 'Dó', 'Si', 'Lá'])
  await act(async () => container.querySelectorAll('.scale-staff-note')[1].dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(voices).toHaveLength(1)
  expect(voices[0].midi).toBe(79)
  act(() => root.render(<div />))
  expect(context.close).toHaveBeenCalledTimes(1)
})

test('reports blocked audio and allows a new playback attempt', async () => {
  context.resume.mockRejectedValueOnce(new Error('Blocked'))
  await act(async () => container.querySelector('.scale-playback button').click())
  expect(container.querySelector('[role="status"]').textContent).toContain('Não foi possível')
  await act(async () => container.querySelector('.scale-playback button').click())
  expect(voices).toHaveLength(8)
})

test('offers four sample instruments, caches loads and stops when changing sound', async () => {
  const sound = container.querySelector('select')
  expect(Array.from(sound.options).map(option => option.text)).toEqual(['Piano', 'Clarinete', 'Violino', 'Sax alto'])
  for (const id of ['piano', 'clarinet', 'violin', 'alto_sax']) {
    act(() => { sound.value = id; sound.dispatchEvent(new Event('change', { bubbles: true })) })
    await act(async () => container.querySelector('.scale-playback button').click())
    expect(loadScaleSamples.mock.calls.at(-1)[2]).toBe(id)
  }
  expect(voices[0].stop).toHaveBeenCalled()
  act(() => { sound.value = 'piano'; sound.dispatchEvent(new Event('change', { bubbles: true })) })
  await act(async () => container.querySelector('.scale-playback button').click())
  expect(loadScaleSamples).toHaveBeenCalledTimes(4)
})

test('ignores a pending sample load after stop and retries failed downloads', async () => {
  let resolve
  loadScaleSamples.mockImplementationOnce(() => new Promise(done => { resolve = done }))
  await act(async () => container.querySelector('.scale-playback button').click())
  expect(container.querySelector('[role="status"]').textContent).toContain('Carregando samples')
  act(() => container.querySelectorAll('.scale-playback button')[1].click())
  const play = jest.fn()
  await act(async () => resolve({ play }))
  expect(play).not.toHaveBeenCalled()
  const sound = container.querySelector('select')
  act(() => { sound.value = 'clarinet'; sound.dispatchEvent(new Event('change', { bubbles: true })) })
  loadScaleSamples.mockRejectedValueOnce(new Error('Offline'))
  await act(async () => container.querySelector('.scale-playback button').click())
  expect(container.querySelector('[role="status"]').textContent).toContain('Não foi possível')
  await act(async () => container.querySelector('.scale-playback button').click())
  expect(voices).toHaveLength(8)
})
