// https://docs.cypress.io/api/introduction/api.html

const homeTitle = 'Welcome to Your Vue.js App';
const aboutTitle = 'This is an about page';


describe('Main view', () => {
    it('contains menu links', () => {
        cy.visit('#/');
        cy.get('a.nav-link').should('have.length', 2);
    });

    it('first link is clicked', () => {
        cy.visit('#/about');
        cy.get('a.nav-link').eq(0).click();
        cy.contains('h1', homeTitle);
    });

    it('second link is clicked', () => {
        cy.get('a.nav-link').eq(1).click();
        cy.contains('h1', aboutTitle);
    });
});

describe('Home page', () => {
    it('exists', () => {
        cy.visit('#/');
        cy.contains('h1', homeTitle);
    });
});

describe('About page', () => {
    it('exists', () => {
        cy.visit('#/about');
        cy.contains('h1', aboutTitle);
    });
});
