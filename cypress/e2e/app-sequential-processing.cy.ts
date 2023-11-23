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
describe('Sequential Processing', () => {
    it('should navigate to sequential-processing', () => {
        cy.visit('http://localhost:3000/')

        cy.wait(shortWait)
        cy.get('a[id*="sequential-processing"]').click()
        cy.wait(shortWait)

        cy.url().should('match', /\/demo\/sequential-processing$/)

        cy.get("#procNumber").type('{selectall}3')
        cy.get("#maxTimeout").type('{selectall}1000')

        cy.wait(shortWait)
        cy.get("#run").click()
        cy.wait(shortWait)


        cy.get("#clear").should('be.disabled')
        cy.get("#run").should('be.disabled')

        cy.wait(3000)

        cy.get("#clear").should('be.enabled')
        cy.get("#run").should('be.enabled')


        cy.wait(shortWait)
        cy.get("#clear").click()
        cy.wait(shortWait)


        cy.get("#home").click()
        cy.wait(shortWait)

        cy.url().should('match', /\/demo$/)

    })
})

// Prevent TypeScript from reading file as legacy script
export { }

