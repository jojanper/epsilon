// https://docs.cypress.io/api/introduction/api.html

const homeUrl = '#/';
const aboutUrl = '#/about';

const homeTitle = 'Welcome to Your Vue.js App';
const aboutTitle = 'This is an about page';


describe('Main view', () => {
    it('contains menu links', () => {
        cy.visit(homeUrl);
        cy.get('a.nav-link').should('have.length', 2);
    });

    it('first link is clicked', () => {
        cy.visit(aboutUrl);
        cy.get('a.nav-link').eq(0).click();
        cy.contains('h1', homeTitle);
    });

    it('second link is clicked', () => {
        cy.get('a.nav-link').eq(1).click();
        cy.contains('h1', aboutTitle);
    });

    it('footer is available', () => {
        cy.get('footer').should('exist');
    });
});

describe('Home page', () => {
    it('exists', () => {
        cy.server();
        cy.route({
            method: 'GET',
            url: 'https://api.iextrading.com/1.0/stock/aapl/batch?types=quote,news,chart&range=1m&last=1',
            status: 200,
            response: { data: { chart: [] } }
        });
        cy.visit(homeUrl);
        cy.contains('h1', homeTitle);
    });
});

describe('About page', () => {
    it('exists', () => {
        cy.visit(aboutUrl);
        cy.contains('h1', aboutTitle);
    });
});
