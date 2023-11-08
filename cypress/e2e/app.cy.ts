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

        cy.url().should('include', '/demo')

    })

    it('should navigate to theme page', () => {
        cy.visit('http://localhost:3000/')

        cy.get('a[id*="theme"]').click()
        cy.wait(shortWait)

        cy.url().should('include', '/demo/theme')

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


        cy.url().should('include', '/demo')

    })
})

// Prevent TypeScript from reading file as legacy script
export { }

