/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>;
    logout(): Chainable<void>;
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  const API_URL = Cypress.env('API_E2E_URL') as string;
  if (!API_URL) throw new Error('Cypress env API_URL is not defined');
  cy.request({
    method: 'GET',
    url: `${API_URL}/auth/csrf`,
  }).then((csrfResponse) => {
    return cy.request({
      method: 'POST',
      url: `${API_URL}/auth/callback/credentials`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        email,
        password,
        csrfToken: csrfResponse.body.csrfToken,
        json: 'true',
      },
    });
  });
});

Cypress.Commands.add('logout', () => {
  cy.clearCookie('authjs.session-token');
  cy.clearCookie('__Secure-authjs.session-token');
  // cy.request({
  //   method: 'POST',
  //   url: '/api/auth/signout',
  //   followRedirect: true,
  // });
});
