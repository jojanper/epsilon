// https://docs.cypress.io/api/introduction/api.html

const homeUrl = '#/';
const aboutUrl = '#/about';

const homeTitle = 'Welcome to Your Vue.js App';
const aboutTitle = 'This is an about page';

const IEX_API_CALL = {
    method: 'GET',
    url: 'https://api.iextrading.com/1.0/stock/aapl/batch?types=quote,news,chart&range=1m&last=1',
    status: 200,
    response: { chart: [] }
};

function setUp(cypress) {
    cypress.server();
    cypress.route(IEX_API_CALL);
}

describe('Main view', () => {
    before(() => setUp(cy));

    it('contains menu links', () => {
        cy.visit(homeUrl);
        cy.get('a.nav-link').should('have.length', 2);
    });

    it('language is changed', () => {
        cy.visit(homeUrl);

        // Open locale listing
        cy.get('.v-btn__content').eq(0).click();

        // Click first list entry
        cy.get('.v-list-item__title').eq(0).click();

        // Finnish locale is selected
        cy.wait(500);
        cy.get('.v-btn__content').eq(0).contains('fi');
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
    before(() => setUp(cy));

    it('exists', () => {
        cy.visit(homeUrl);
        cy.contains('h1', homeTitle);
    });
});

describe('About page', () => {
    before(() => setUp(cy));

    it('exists', () => {
        cy.visit(aboutUrl);
        cy.contains('h1', aboutTitle);
    });
});
