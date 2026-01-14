describe('Navigation menu flow', () => {
  beforeEach(() => {
    cy.task('deleteUser', 'test123@example.com');
    cy.task('createUser', {
      email: 'test123@example.com',
      password: '12345678',
    });
    cy.login('test123@example.com', '12345678');
    cy.visit('/my-tasks');
  });

  it('Logo link redirects to home page', () => {
    cy.get('a[aria-label="home page"]').click();
    cy.location('pathname').should('eq', '/');
  });
  it('My tasks link redirects to my-tasks page', () => {
    cy.contains('a', 'My tasks').click();
    cy.location('pathname').should('eq', '/my-tasks');
  });
  it('Settings link redirects to settings page', () => {
    cy.contains('a', 'Settings').click();
    cy.location('pathname').should('eq', '/settings');
  });
  it('Logout link logs out a user and redirects to home page', () => {
    cy.contains('button', 'Logout').click();
    cy.location('pathname').should('eq', '/');
    cy.contains('Live Demo');
    cy.contains('Log in');
  });
  // add once merged with categories branch
  // it('Manage categories link redirects to categories page', () => {
  //   cy.contains('a', 'Manage categories').click();
  //   cy.location('pathname').should('eq', '/categories');
  // });
});
