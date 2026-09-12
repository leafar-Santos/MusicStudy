import { buildScale, scaleTypes, tonics } from './scales'

test('spells C major and A minor variants correctly', () => {
  const names = (tonic, type, direction) => buildScale(tonic, scaleTypes[type], direction).map(note => note.name)
  expect(names('C', 0)).toEqual(['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si', 'Dó'])
  expect(names('A', 1)).toEqual(['Lá', 'Si', 'Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá'])
  expect(names('A', 2)).toEqual(['Lá', 'Si', 'Dó', 'Ré', 'Mi', 'Fá', 'Sol♯', 'Lá'])
  expect(names('A', 3)).toEqual(['Lá', 'Si', 'Dó', 'Ré', 'Mi', 'Fá♯', 'Sol♯', 'Lá'])
  expect(names('A', 3, 'descending')).toEqual(['Lá', 'Sol', 'Fá', 'Mi', 'Ré', 'Dó', 'Si', 'Lá'])
})

test('preserves letter names, including enharmonic and double accidentals', () => {
  expect(buildScale('F#', scaleTypes[0])[6].name).toBe('Mi♯')
  expect(buildScale('C#', scaleTypes[0])[2].name).toBe('Mi♯')
  expect(buildScale('Gb', scaleTypes[0])[3].name).toBe('Dó♭')
  expect(buildScale('Gb', scaleTypes[1])[2].name).toBe('Si𝄫')
  expect(buildScale('C#', scaleTypes[2])[6].name).toBe('Si♯')
  expect(buildScale('G#', scaleTypes[2])[6].name).toBe('Fá𝄪')
})

test.each(tonics.map(tonic => [tonic.id]))('%s has correct intervals and staff positions for every scale', tonic => {
  scaleTypes.forEach(type => {
    const notes = buildScale(tonic, type)
    expect(notes).toHaveLength(8)
    expect(notes.map(note => note.midi - notes[0].midi)).toEqual(type.intervals)
    notes.forEach((note, index) => {
      expect(note.position).toBe(notes[0].position + index)
      expect(note.symbol).toBeDefined()
      expect(note.name).not.toContain('undefined')
      expect(note.frequency).toBeCloseTo(440 * 2 ** ((note.midi - 69) / 12))
    })
    const descending = buildScale(tonic, type, 'descending')
    const expected = buildScale(tonic, type.slug === 'menor-melodica' ? scaleTypes[1] : type).reverse()
    expect(descending).toEqual(expected)
  })
})
