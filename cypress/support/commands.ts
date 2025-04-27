// добавим пару удобных команд
declare namespace Cypress {
    interface Chainable {
      /**
       * Устанавливает фейковые токены в localStorage и cookie
       */
      setAuthTokens(): void;
  
      /**
       * Очищает все токены
       */
      clearAuthTokens(): void;
    }
  }
  
  Cypress.Commands.add('setAuthTokens', () => {
    // фейковые токены, можно вынести в fixtures
    cy.window().then(win => {
      win.localStorage.setItem('refreshToken', 'fakeRefreshToken');
    });
    cy.setCookie('accessToken', 'fakeAccessToken');
  });
  
  Cypress.Commands.add('clearAuthTokens', () => {
    cy.clearCookies();
    cy.window().then(win => {
      win.localStorage.removeItem('refreshToken');
    });
  });
  