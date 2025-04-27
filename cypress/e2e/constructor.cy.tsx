/// <reference types="cypress" />

describe('🍔 Страница конструктора бургеров', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' });
  
      cy.clearCookies();
      cy.window().then((win) => win.localStorage.removeItem('refreshToken'));
  
      cy.visit('/');
    });
  
    it('должен добавить булку и начинку в конструктор', () => {
      cy.fixture('ingredients.json').then((raw: any) => {
        const items = raw.data as any[];
        const bun = items.find((i) => i.type === 'bun');
        const main = items.find((i) => i.type === 'main');
  
        cy.get('[data-testid=ingredient-bun]')
          .contains(bun.name)
          .parent()
          .find('button')
          .contains('Добавить')
          .click();
        cy.contains(`${bun.name} (верх)`).should('exist');
        cy.contains(`${bun.name} (низ)`).should('exist');
  
        cy.get('[data-testid=ingredient-main]')
          .contains(main.name)
          .parent()
          .find('button')
          .contains('Добавить')
          .click();
        cy.get('[data-testid=constructor-list]')
          .contains(main.name)
          .should('exist');
      });
    });
  
    it('должен открыть и закрыть модалку ингредиента', () => {
      cy.fixture('ingredients.json').then((raw: any) => {
        const items = raw.data as any[];
        const sauce = items.find((i) => i.type === 'sauce');

        cy.get('[data-testid=ingredient-sauce]')
          .contains(sauce.name)
          .click();
        cy.get('[data-testid=modal]')
          .should('be.visible')
          .contains(sauce.name);
  
        cy.get('[data-testid=modal-close]').click();
        cy.get('[data-testid=modal]').should('not.exist');
  
        cy.get('[data-testid=ingredient-sauce]')
          .contains(sauce.name)
          .click();
        cy.get('[data-testid=modal]').should('be.visible');
  
        cy.get('#modals > *').eq(1).click({ force: true });
        cy.get('[data-testid=modal]').should('not.exist');
      });
    });
  
    it('должен создать заказ и очистить конструктор', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'fakeRefreshToken');
      });
      cy.setCookie('accessToken', 'fakeAccessToken');
  
      cy.intercept('GET', '**/auth/user', { fixture: 'user.json' });

      cy.intercept('POST', '**/orders', { fixture: 'orderResponse.json' });
  
      cy.visit('/');
  
      cy.fixture('ingredients.json').then((raw: any) => {
        const items = raw.data as any[];
        const bun = items.find((i) => i.type === 'bun');
        const main = items.find((i) => i.type === 'main');
  
        cy.get('[data-testid=ingredient-bun]')
          .contains(bun.name)
          .parent()
          .find('button')
          .contains('Добавить')
          .click();
        cy.get('[data-testid=ingredient-main]')
          .contains(main.name)
          .parent()
          .find('button')
          .contains('Добавить')
          .click();
  
        cy.contains('Оформить заказ').click();

        cy.get('[data-testid=modal]').should('be.visible');
        cy.fixture('orderResponse.json').then((orderRes: any) => {
          const expected = orderRes.order.number.toString();
          cy.get('[data-testid=order-number]').should('contain', expected);
        });
  
        cy.get('[data-testid=modal-close]').click();
        cy.contains('Выберите булки').should('exist');
        cy.contains('Выберите начинку').should('exist');
      });
    });
  });
  