import { getSearchResult } from '../selectors/search/search';

describe('page', () => {
    it('should display the page content correctly', () => {
        cy.intercept('GET', '/results**').as('searchRequest');
        cy.visit('/');
        const result = getSearchResult();
        result.click();

        cy.wait('@searchRequest');
        cy.get('h1').contains('Search results');
        cy.contains('Loading...').should('not.exist');

        cy.get('aside').should('be.visible');
        cy.get('[data-testid="deals-result"]').should('be.visible');

        cy.contains('up to £1440').should('be.visible').click();
        cy.contains('up to £1440')
            .parent()
            .invoke('text')
            .then((text) => {
                const count = text.match(/\((\d+)\)/)[1];
                expect(count).equal('60');
            });

        cy.get('h2').should('contain', '60 results found');

        cy.get('[data-testid="deals-result"]').within(() => {
            cy.get('[data-testid="deal"]').each((deal) => {
                cy.wrap(deal)
                    .should('be.visible')
                    .within(() => {
                        cy.get('[data-testid="deal-price"]')
                            .invoke('text')
                            .then((price) => {
                                const priceWithoutPP = price.replace('pp', '');
                                const dealPrice = parseFloat(
                                    priceWithoutPP
                                        .replace('£', '')
                                        .replace(',', '')
                                );
                                const selectedPrice = 1440;
                                expect(dealPrice).to.be.lessThan(selectedPrice);
                            });
                    });
            });
        });

        cy.contains('Games Room').should('be.visible').click();
        cy.contains('Games Room')
            .parent()
            .invoke('text')
            .then((text) => {
                const count = text.match(/\((\d+)\)/)[1];
                expect(count).equal('38');
            });

        cy.get('h2').should('contain', '38 results found');

        cy.contains('Villas').should('be.visible').click();
        cy.contains('Villas')
            .parent()
            .invoke('text')
            .then((text) => {
                const count = text.match(/\((\d+)\)/)[1];
                expect(count).equal('5');
            });

        cy.get('h2').should('contain', '5 results found');

        cy.get('[data-testid="deals-result"]').within(() => {
            cy.get('[data-testid="deal"]').each((deal) => {
                cy.wrap(deal)
                    .should('be.visible')
                    .within(() => {
                        cy.get('[data-testid="rating"]').contains('Villas');
                    });
            });
        });

        cy.contains('Free transport to theme parks')
            .should('be.visible')
            .click();
        cy.contains('Free transport to theme parks')
            .parent()
            .invoke('text')
            .then((text) => {
                const count = text.match(/\((\d+)\)/)[1];
                expect(count).equal('0');
            });

        cy.get('h2').should('contain', '0 results found');
        cy.get('[data-testid="deals-result"]').should(
            'contain',
            'No Results Found'
        );
    });
});
