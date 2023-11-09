describe('Landing Page Tests', ()=> {
    beforeEach(() =>{
        cy.visit('/');
        cy.clearAllLocalStorage();
        cy.clearAllSessionStorage();
        cy.clearAllCookies();
        cy.clearLocalForage();
        cy.reload()
    })
    it('Check Dialog', () => {
        // Basic tests
        cy.get('ion-card-title').should('include.text', 'Welcome')
        cy.get('ion-card-title').should('include.text', '歡迎')
        cy.get('ion-card-subtitle').should('include.text', 'select language');
        cy.get('ion-card-subtitle').should('include.text', '語言');
        cy.getDataTest('toast').should('not.exist')
        // Test Checkbox functionality
        cy.getDataTest('endpoint-input').should('not.visible')
        cy.getDataTest('endpoint-checkbox').click();
        cy.getDataTest('endpoint-input').should('be.visible')
        cy.getDataTest('endpoint-checkbox').click();
        cy.getDataTest('endpoint-input').should('not.visible');
        cy.getDataTest('endpoint-checkbox').click();
        // Check error handling for invalid url
        cy.getDataTest('endpoint-input').type('INVALID_URL')
        cy.getDataTest('en-button').click();
        cy.getDataTest('toast').should('exist')
        cy.getDataTest('en-button').should('be.visible')
        cy.getDataTest('toast').should('not.exist')
        cy.getDataTest('zh-button').click();
        cy.getDataTest('toast').should('exist')
        cy.getDataTest('zh-button').click();
        //Check empty url handling
        cy.get('[data-testid="endpoint-input"] input').clear()
        cy.getDataTest('en-button').click()
        cy.getDataTest('toast').should('exist')
        //Check quick tour page
        cy.getDataTest('zh-button').should('not.exist')
        cy.getDataTest('tour-title').should('be.visible')
        cy.getDataTest('tour-title').should('contain.text', 'Quick Tour')
        cy.get('[data-testid="tour-finish-button"]').should('have.class', 'button-disabled')
        cy.getDataTest('tour-checkbox').should('have.class', 'checkbox-checked')
        cy.getDataTest('tour-checkbox').click();
        cy.getDataTest('tour-checkbox').should('not.have.class', 'checkbox-checked')
        // cy.getDataTest('tour-finish-button').should('not.have.class', 'button-disabled')
        cy.getDataTest('tour-finish-button').click();
        cy.getDataTest('tour-title').should('not.exist')
        cy.getDataTest('zh-button').should('not.exist')
        cy.getDataTest('tab-bus').should('be.visible')
    })
}) 
