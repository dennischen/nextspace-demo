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
describe('Lazy Preloading', () => {
    
    it('should navigate to lazy-preloading', () => {
        cy.visit('http://localhost:3000/')

        cy.get('a[id*="lazy-preloading"]').click()
        cy.wait(shortWait)

        cy.url().then(href=>{
            expect(href.endsWith("/demo/lazy-preloading")).to.be.true;
        })

        cy.get("#panel1").should('have.id', 'panel1').contains("Panel1")
        cy.get("#panel2").should('not.exist')
        cy.get("#panel3").should('not.exist')

        cy.get("#btn1").should('be.visible').should('be.disabled')
        cy.get("#btn2").should('be.visible').should('be.enabled')
        cy.get("#btn3").should('be.visible').should('be.enabled')

        //click btn2
        cy.wait(shortWait)
        cy.get("#btn2").click()
        cy.wait(shortWait)

        cy.get("#btn1").should('be.visible')
        cy.get("#btn2").should('be.visible')
        cy.get("#btn3").should('be.visible')

        cy.get("#loading").should('be.visible')
        cy.get("#loading").contains('Panel Loading')

        cy.wait(1000)
        cy.get("#btn1").should('be.visible').should('be.enabled')
        cy.get("#btn2").should('be.visible').should('be.disabled')
        cy.get("#btn3").should('be.visible').should('be.enabled')
        cy.get("#loading").should('not.exist')

        cy.get("#panel1").should('not.exist')
        cy.get("#panel2").should('have.id', 'panel2').contains("Panel2")
        cy.get("#panel3").should('not.exist')


        //click btn2
        cy.wait(shortWait)
        cy.get("#btn3").click()
        cy.wait(shortWait)

        cy.get("#btn1").should('be.visible')
        cy.get("#btn2").should('be.visible')
        cy.get("#btn3").should('be.visible')

        cy.get("#loading").should('not.exist')
        //it is too fast for test this real case to show the indicator
        //just ignore the assert

        cy.wait(1000)
        cy.get("#btn1").should('be.visible').should('be.enabled')
        cy.get("#btn2").should('be.visible').should('be.enabled')
        cy.get("#btn3").should('be.visible').should('be.disabled')

        cy.get("#panel1").should('not.exist')
        cy.get("#panel2").should('not.exist')
        cy.get("#panel3").should('have.id', 'panel3').contains("Panel3")

        cy.get("#home").click()
        cy.wait(shortWait)

        cy.url().then(href=>{
            expect(href.endsWith("/demo")).to.be.true;
        })

    })

})

// Prevent TypeScript from reading file as legacy script
export { }

