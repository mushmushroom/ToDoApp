describe('User registration and login', () => {
  it('Register page - invalid inputs', () => {
    cy.visit('/auth/register');
    cy.get('input[name="email"]').type('testuser@example');
    cy.contains('Invalid email address');
    cy.get('input[name="password"]').type('passwor');
    cy.contains('Password should contain at least 8 characters');
    cy.get('input[name="password"]').type('d123');
    cy.get('input[name="confirmPassword"]').type('password12');
    cy.contains('Passwords do not match');
  });

  it('Successfull registration and redirect to sign in page', () => {
    cy.task('deleteUser', 'testuser123@example.com');
    cy.visit('/auth/register');
    cy.get('input[name="email"]').type('testuser123@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type=submit]').click();
    cy.contains('Success! You will be redirected to the login page now.');
    cy.location('pathname').should('eq', '/auth/sign-in');
  });

  it('Fails for already registered user', () => {
    cy.visit('/auth/register');
    cy.get('input[name="email"]').type('testuser123@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type=submit]').click();
    cy.contains('User already exists.');
  })
});
