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
describe('Theme', () => {
    it('should navigate to theme page', () => {
        cy.visit('http://localhost:3000/')

        cy.wait(shortWait)
        cy.get('a[id*="theme"]').click()
        cy.wait(shortWait)

        cy.url().should('match', /\/demo\/theme$/)

        cy.get('main #bgColor').contains('#fefefe')
        cy.get('main #fgColor').contains('#0a0a0a')
        cy.get('main #primaryColor').contains('#87ceeb')

        let node = cy.get('main option').should('have.length', 2).first()
        node.should('have.value', 'lightblue').contains('Light Blue').should('have.attr', 'selected')
        node = cy.get('main option').eq(1)
        node.should('have.value', 'darkred').contains('Dark Red').should('not.have.attr', 'selected')

        cy.get('main select').select('darkred')
        cy.wait(shortWait)

        cy.get('main #bgColor').contains('#201010')
        cy.get('main #fgColor').contains('#fefefe')
        cy.get('main #primaryColor').contains('#470024')


        node = cy.get('main option').should('have.length', 2).first()
        node.should('have.value', 'lightblue').contains('Light Blue').should('not.have.attr', 'selected')
        node = cy.get('main option').eq(1)
        node.should('have.value', 'darkred').contains('Dark Red').should('have.attr', 'selected')

        cy.get('main select').select('lightblue')
        cy.wait(shortWait)

        node = cy.get('main option').should('have.length', 2).first()
        node.should('have.value', 'lightblue').contains('Light Blue').should('have.attr', 'selected')
        node = cy.get('main option').eq(1)
        node.should('have.value', 'darkred').contains('Dark Red').should('not.have.attr', 'selected')


        cy.get('main #bgColor').contains('#fefefe')
        cy.get('main #fgColor').contains('#0a0a0a')
        cy.get('main #primaryColor').contains('#87ceeb')

        cy.get("#home").click()
        cy.wait(shortWait)

        cy.url().should('match', /\/demo$/)
    })
})

// Prevent TypeScript from reading file as legacy script
export { }

