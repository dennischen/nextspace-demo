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
describe('Slow Route', () => {
    it('should navigate to slow-route page', () => {
        cy.visit('http://localhost:3000/')

        //wait for everything ready to simulate this test
        cy.wait(1000)

        cy.wait(shortWait)
        let t1 = Date.now()
        cy.get('a[id*="slow-route"]').click()
        let t2 = Date.now()
        cy.wait(shortWait)

        expect((t2 - t1) < 500)

        cy.url().then(href => {
            expect(href.endsWith("/demo"), href).to.be.true
        })
        //there is a progess

        //the default slow-route wait is 3000
        cy.wait(4000)

        //check timeoput before href for waiting page ready in cy
        cy.get("#timeout").contains("3000 ms")

        cy.url().then(href => {
            expect(href.endsWith("/demo/slow-route"), href).to.be.true
        })

        cy.wait(shortWait)
        cy.get("#home").click()
        cy.wait(shortWait)

        cy.url().then(href => {
            expect(href.endsWith("/demo"), href).to.be.true
        })

        cy.wait(shortWait)
        t1 = Date.now()
        cy.get('a[id*="slow-route"]').click()
        t2 = Date.now()
        cy.wait(shortWait)

        expect((t2 - t1) < 500)

        cy.url().then(href => {
            expect(href.endsWith("/demo/slow-route"), href).to.be.true
        })

        cy.wait(shortWait)
        cy.get("#home").click()
        cy.wait(shortWait)

        cy.url().then(href => {
            expect(href.endsWith("/demo"), href).to.be.true
        })

    })
})

// Prevent TypeScript from reading file as legacy script
export { }

