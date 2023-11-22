import 'cypress-if'
describe('General Tests', () => {
    beforeEach(() => {
        cy.visit('/')
        // cy.getDataTest('en-button').if('visible').then(($btn) => {
        //     if ($btn.is(':visible')){
        //         cy.wrap($btn).click()
        //         cy.wait(10)
        //     }
        // })
    })
    it('SearchBar Tests', () => {
        const searchTest = (type, input, itemVisible = true) => {
            if (Array.isArray(input)) {
                input.forEach((term) => {
                    cy.get(`@${type}-input`).clear()
                    cy.get(`@${type}-input`).type(term)
                    if (itemVisible) {
                        cy.getDataTest(`search-item-${type}`)
                            .its('length')
                            .should('be.gte', 1)
                    } else {
                        cy.getDataTest(`search-item-${type}`).should(
                            'not.exist'
                        )
                    }
                })
            } else {
                cy.get(`@${type}-input`).clear()
                cy.get(`@${type}-input`).type(input)
                if (itemVisible) {
                    cy.getDataTest(`search-item-${type}`)
                        .its('length')
                        .should('be.gte', 1)
                } else {
                    cy.getDataTest(`search-item-${type}`).should('not.exist')
                }
            }
        }

        // Search bar should not visible on list view
        cy.getDataTest('tab-mtr').click()
        cy.get('ion-searchbar').should('not.be.visible')
        cy.getDataTest('tab-light-rail').click()
        cy.get('ion-searchbar').should('not.be.visible')
        cy.getDataTest('tab-tram').click()
        cy.get('ion-searchbar').should('not.be.visible')

        // Check bus Search bar functionalisty
        cy.getDataTest('tab-bus').click()
        cy.getDataTest('search-bar-bus').should('be.visible')
        cy.getDataTest('search-bar-bus').find('input').as('bus-input')
        // Random Search for buses
        for (let i = 0; i < 10; i++) {
            const random = Math.ceil(Math.random() * 99)
            searchTest('bus', random)
        }
        // Routes from kmb, ctb, mtr, lwb
        searchTest('bus', [
            'E32',
            'e23',
            '33a',
            '23',
            'k17',
            'db01',
            'mong kok',
            'KWAI',
            'so uk',
        ])
        // Try Search for destination name
        searchTest(
            'bus',
            [
                'invalid location',
                'fan sija',
                '999x',
                'a90wu',
                'randomString',
                '*#',
            ],
            false
        )

        // Search bar test for Minibus
        cy.getDataTest('tab-minibus').click()
        cy.getDataTest('search-bar-minibus').should('be.visible')
        cy.getDataTest('search-bar-minibus').find('input').as('minibus-input')
        // Random search for minibus
        for (let i = 0; i < 10; i++) {
            const random = Math.ceil(Math.random() * 99)
            searchTest('minibus', random)
        }
        searchTest('minibus', ['mong', 'KWAI', '33m'])
        searchTest(
            'minibus',
            [
                'invalid location',
                'fan sija',
                '999x',
                'a90wu',
                'randomString',
                '*#',
            ],
            false
        )

        // Search bar test for ferry
        cy.getDataTest('tab-ferry').click()
        cy.getDataTest('search-bar-ferry').should('be.visible')
        cy.getDataTest('search-bar-ferry').find('input').as('ferry-input')
        // Random search for minibus
        for (let i = 0; i < 5; i++) {
            const random = Math.ceil(Math.random() * 99)
            searchTest('ferry', random, false)
        }
        searchTest('ferry', ['ap', 'ABERDEEN', 'pO tOi', ' ', '-'])
        searchTest(
            'ferry',
            [
                'invalid location',
                'fan sija',
                '999x',
                'a90wu',
                'randomString',
                '*#',
            ],
            false
        )
    })
})
