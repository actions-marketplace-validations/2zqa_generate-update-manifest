/**
 * Unit tests for the action's main business logic, src/main.ts
 */
import * as main from '../src/main'
import * as fs from 'node:fs/promises'
import Validator from '../src/validator'

const addonIDRegex = '{692884b1-e357-4adb-9e3c-f4a3d74bb38b}'
const addonIDEmail = 'uBlock0@raymondhill.net'

describe('generateUpdateManifest', () => {
  it('returns a manifest with an empty updates list', () => {
    expect(main.generateUpdateManifest([], addonIDRegex)).toEqual({
      addons: {
        [addonIDRegex]: {
          updates: []
        }
      }
    })
  })

  it('generates a manifest', async () => {
    const expectedJsonPromise = fs.readFile(
      './__tests__/fixtures/expected.json'
    )
    const mockedResponsePromise = fs.readFile(
      './__tests__/fixtures/releases.json'
    )
    const [expectedJson, mockedResponse] = await Promise.all([
      expectedJsonPromise,
      mockedResponsePromise
    ])
    const expected = JSON.parse(expectedJson.toString())
    const releases = JSON.parse(mockedResponse.toString())

    const manifest = main.generateUpdateManifest(releases, addonIDRegex)

    expect(manifest).toEqual(expected)
  })
})

describe('validateAddonID', () => {
  let validator: Validator

  beforeEach(() => {
    validator = new Validator()
  })

  it('does not add an error for a valid addon ID in UUID form', () => {
    main.validateAddonID(validator, addonIDRegex)
    expect(validator.isValid()).toBe(true)
  })

  it('does not add an error for a valid addon ID in e-mail form', () => {
    main.validateAddonID(validator, addonIDEmail)
    expect(validator.isValid()).toBe(true)
  })

  it('adds an error for an invalid addon ID', () => {
    main.validateAddonID(validator, 'not-an-addon-id')
    expect(validator.isValid()).toBe(false)
  })
})
