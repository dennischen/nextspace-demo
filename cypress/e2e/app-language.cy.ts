/* eslint-disable */
// Disable ESLint to prevent failing linting inside the Next.js repo.
// If you're using ESLint on your project, we recommend installing the ESLint Cypress plugin instead:
// https://github.com/cypress-io/eslint-plugin-cypress


//short wait for async ui operation
const shortWait = 100

function clear(cy: Cypress.cy & CyEventEmitter) {
    cy.type('{selectall}')
    cy.wait(10)
    cy.type('{backspace}')
    cy.wait(10)
    return cy
}

// Cypress E2E Test
describe('Language', () => {
    it('should navigate to language page', () => {
        cy.visit('http://localhost:3000/')

        cy.wait(shortWait)
        cy.get('a[id*="language"]').click()
        cy.wait(shortWait)

        cy.url().should('match', /\/demo\/language$/)

        let node = cy.get('main option').should('have.length', 2).first()
        node.should('have.value', 'en').contains('English').should('have.attr', 'selected')
        node = cy.get('main option').eq(1)
        node.should('have.value', 'zh').contains('Chinese').should('not.have.attr', 'selected')

        cy.get('main select').select('zh')
        cy.wait(shortWait)

        node = cy.get('main option').should('have.length', 2).first()
        node.should('have.value', 'en').contains('英文').should('not.have.attr', 'selected')
        node = cy.get('main option').eq(1)
        node.should('have.value', 'zh').contains('中文').should('have.attr', 'selected')

        cy.get('main select').select('en')
        cy.wait(shortWait)

        node = cy.get('main option').should('have.length', 2).first()
        node.should('have.value', 'en').contains('English').should('have.attr', 'selected')
        node = cy.get('main option').eq(1)
        node.should('have.value', 'zh').contains('Chinese').should('not.have.attr', 'selected')

        cy.get("#home").click()
        cy.wait(shortWait)

        cy.url().should('match', /\/demo$/)

    })
})

// Prevent TypeScript from reading file as legacy script
export { }

