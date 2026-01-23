describe('Home page', () => {
  it('loads successfully and contains action buttons for non-autorized user', () => {
    cy.visit('/');
    cy.contains('Live Demo');
    cy.contains('Log in');
  });

  it('if user is logged in, display My tasks button', () => {
    cy.task('deleteUser', 'test123@example.com');
    cy.task('createUser', {
      email: 'test123@example.com',
      password: '12345678',
    });

    cy.login('test123@example.com', '12345678');

    cy.visit('/');
    cy.contains('Go to my tasks');
  });

  it('If the user is not logged in, they are redirected from the protected paths', () => {
    cy.visit('/my-tasks');
    cy.location('pathname').should('eq', '/auth/sign-in');
    cy.visit('/settings');
    cy.location('pathname').should('eq', '/auth/sign-in');
  });
});
