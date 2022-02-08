/* eslint-disable no-param-reassign */
// https://docs.cypress.io/api/introduction/api.html

const homeUrl = '#/';
const examplesUrl = '#/examples';
const demosUrl = '#/demos';
const utilsUrl = '#/utils';
const audioUrl = '#/audio';
const aboutUrl = '#/about';

const formPageTitle = 'Component examples';
const aboutTitle = 'This is an about page';

const URL_LINKS = 5;

const IEX_API_CALL = {
    method: 'GET',
    url: '**/stable/stock/aapl/batch?types=quote,news,chart&range=1m&last=50&token=*',
    status: 200,
    response: { chart: [], quote: {}, news: [] }
};

function setUp(cypress) {
    cypress.server();
    cypress.route(IEX_API_CALL);
}

Cypress.on('window:before:load', win => {
    delete win.fetch;
});

describe('Main view', () => {
    beforeEach(() => setUp(cy));

    it('contains menu links', () => {
        cy.visit(homeUrl);
        cy.get('a.nav-link').should('have.length', URL_LINKS);
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
        cy.contains('h1', formPageTitle);
    });

    it('last link is clicked', () => {
        cy.get('a.nav-link').eq(URL_LINKS - 1).click();
        cy.contains('h1', aboutTitle);
    });

    it('footer is available', () => {
        cy.get('footer').should('exist');
    });
});

describe('Home page', () => {
    beforeEach(() => setUp(cy));

    it('exists', () => {
        cy.visit(homeUrl);
        cy.get('.home').should('have.length', 1);
    });
});

describe('Examples page', () => {
    beforeEach(() => setUp(cy));

    it('exists', () => {
        cy.visit(examplesUrl);
    });
});

describe('Demos page', () => {
    beforeEach(() => setUp(cy));

    it('exists', () => {
        cy.visit(demosUrl);
    });
});

describe('Utils page', () => {
    beforeEach(() => setUp(cy));

    it('exists', () => {
        cy.visit(utilsUrl);
    });
});

describe('Audio page', () => {
    beforeEach(() => setUp(cy));

    it('exists', () => {
        cy.visit(audioUrl);
    });
});

describe('About page', () => {
    beforeEach(() => setUp(cy));

    it('exists', () => {
        cy.visit(aboutUrl);
        cy.contains('h1', aboutTitle);
    });
});
