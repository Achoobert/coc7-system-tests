/* global CONFIG, Hooks */
Hooks.on('quenchReady', (quench) => {
  const tests = [
    {
      test: 'dodge',
      fullName: 'dodge',
      skillName: 'dodge',
      specialization: '',
      special: false,
      fighting: false,
      firearm: false
    },
    {
      test: 'Fighting(brawl)',
      fullName: 'Fighting (brawl)',
      skillName: 'brawl',
      specialization: 'Fighting',
      special: true,
      fighting: true,
      firearm: false
    },
    {
      test: 'Firearms(handguns)',
      fullName: 'Firearms (handguns)',
      skillName: 'handguns',
      specialization: 'Firearms',
      special: true,
      fighting: false,
      firearm: true
    }
  ]

  quench.registerBatch(
    'coc7.item.skills.static',
    (context) => {
      const { describe, it, assert } = context

      describe('Static: guessNameParts', function () {
        this.timeout(30000)
        for (const test of tests) {
          it('Correctly guesses guessNameParts("' + test.test + '")', function () {
            const parts = CONFIG.Item.dataModels.skill.guessNameParts(test.test)
            assert.equal(parts.system.skillName, test.skillName, 'Skill name does not match')
            assert.equal(parts.system.specialization, test.specialization, 'Specialization name does not match')
            assert.equal(parts.system.properties.special, test.special, 'Special flag does not match')
            assert.equal(parts.system.properties.fighting, test.fighting, 'Fighting flag does not match')
            assert.equal(parts.system.properties.firearm, test.firearm, 'Firearm flag does not match')
          })
        }
      })

      describe('Static: getNamePartsSpec', function () {
        this.timeout(30000)
        for (const test of tests) {
          if (test.specialization === '') {
            it('Correctly guesses getNamePartsSpec("' + test.test + '")', function () {
              const parts = CONFIG.Item.dataModels.skill.getNamePartsSpec(test.test)
              assert.equal(parts.name, test.fullName, 'Item name does not match')
              assert.equal(parts.skillName, test.skillName, 'Skill name does not match')
              assert.equal(parts.specialization, test.specialization, 'Specialization name does not match')
            })
          } else {
            it('Correctly guesses getNamePartsSpec("' + test.fullName + '", "' + test.specialization + '")', function () {
              const parts = CONFIG.Item.dataModels.skill.getNamePartsSpec(test.fullName, test.specialization)
              assert.equal(parts.name, test.fullName, 'Item name does not match')
              assert.equal(parts.skillName, test.skillName, 'Skill name does not match')
              assert.equal(parts.specialization, test.specialization, 'Specialization name does not match')
            })
          }
          it('Correctly guesses getNamePartsSpec("' + test.test + '", "' + test.specialization + '")', function () {
            const parts = CONFIG.Item.dataModels.skill.getNamePartsSpec(test.test, test.specialization)
            assert.equal(parts.name, test.fullName, 'Item name does not match')
            assert.equal(parts.skillName, test.skillName, 'Skill name does not match')
            assert.equal(parts.specialization, test.specialization, 'Specialization name does not match')
          })
        }
      })
    },
    {
      displayName: 'Skills: Static'
    }
  )

  quench.registerBatch(
    'coc7.item.skills.items',
    (context) => {
      const { describe, it, assert } = context

      describe('Item: guessNameParts', function () {
        this.timeout(30000)
        for (const test of tests) {
          it('Correctly creates ' + test.test + ' skill', async function () {
            const item = await CONFIG.Item.documentClass.create({ name: test.test, type: 'skill' })
            const { name, system: { properties: { special, fighting, firearm }, skillName, specialization } } = item
            assert.equal(name, test.fullName, 'Item name does not match')
            assert.equal(skillName, test.skillName, 'Skill name does not match')
            assert.equal(specialization, test.specialization, 'Specialization name does not match')
            assert.equal(special, test.special, 'Special flag does not match')
            assert.equal(fighting, test.fighting, 'Fighting flag does not match')
            assert.equal(firearm, test.firearm, 'Firearm flag does not match')
            item.delete()
          })
        }
      })
    },
    {
      displayName: 'Skills Items: Creation',
      preSelected: false
    }
  )
})
