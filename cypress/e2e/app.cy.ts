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
describe('Navigation', () => {
    it('should navigate to home page', () => {
        // Start from the index page
        cy.visit('http://localhost:3000/')

        cy.url().should('include', '/demo')

        cy.get("#home").click()
        cy.wait(shortWait)

        cy.url().should('include', '/demo')

    })
    it('should navigate to language page', () => {
        cy.visit('http://localhost:3000/')

        cy.get('a[id*="language"]').click()
        cy.wait(shortWait)

        cy.url().should('include', '/demo/language')

        let node = cy.get('main option').should('have.length', 2).first()
        node.should('have.value', 'en').contains('English').should('have.attr', 'selected')
        node = cy.get('option').eq(1)
        node.should('have.value', 'zh').contains('Chinese').should('not.have.attr', 'selected')

        cy.get('main select').select('zh')
        cy.wait(shortWait)

        node = cy.get('main option').should('have.length', 2).first()
        node.should('have.value', 'en').contains('英文').should('not.have.attr', 'selected')
        node = cy.get('option').eq(1)
        node.should('have.value', 'zh').contains('中文').should('have.attr', 'selected')

        cy.get('main select').select('en')
        cy.wait(shortWait)

        node = cy.get('main option').should('have.length', 2).first()
        node.should('have.value', 'en').contains('English').should('have.attr', 'selected')
        node = cy.get('option').eq(1)
        node.should('have.value', 'zh').contains('Chinese').should('not.have.attr', 'selected')

        cy.get("#home").click()
        cy.wait(shortWait)

        cy.url().should('include', '/demo')

    })
    it('should navigate to sequential-processing', () => {
        cy.visit('http://localhost:3000/')

        cy.get('a[id*="sequential-processing"]').click()
        cy.wait(shortWait)

        cy.url().should('include', '/demo/sequential-processing')

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

        cy.url().should('include', '/demo')

    })

    it('should navigate to lazy-preloading', () => {
        cy.visit('http://localhost:3000/')

        cy.get('a[id*="lazy-preloading"]').click()
        cy.wait(shortWait)

        cy.url().should('include', '/demo/lazy-preloading')

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

        cy.get("#btn1").should('not.be.visible')
        cy.get("#btn2").should('not.be.visible')
        cy.get("#btn3").should('not.be.visible')

        cy.get(".nextspace-modal").should('be.visible')
        cy.get(".nextspace-modal p").contains('Loading')

        cy.wait(1000)
        cy.get("#btn1").should('be.visible').should('be.enabled')
        cy.get("#btn2").should('be.visible').should('be.disabled')
        cy.get("#btn3").should('be.visible').should('be.enabled')
        cy.get(".nextspace-modal").should('not.exist')

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

        cy.get(".nextspace-modal").should('not.exist')
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

        cy.url().should('include', '/demo')

    })
})

// Prevent TypeScript from reading file as legacy script
export { }

