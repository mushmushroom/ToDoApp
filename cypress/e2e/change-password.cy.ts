describe('Change password flow', () => {
  beforeEach(() => {
    cy.task('deleteUser', 'test123@example.com');
    cy.task('createUser', {
      email: 'test123@example.com',
      password: '12345678',
    });
    cy.login('test123@example.com', '12345678');
    cy.visit('/settings');
  });

  it('New password does not comply with requirements', () => {
    cy.get('input[name="newPassword"]').type('passwor');
    cy.contains('Password should contain at least 8 characters');
  });

  it("New password and confirmation don't match", () => {
    cy.get('input[name="newPassword"]').type('Test1234');
    cy.get('input[name="confirmPassword"]').type('Test123');
    cy.contains('Passwords do not match');
  });

  it('Old password is incorrect', () => {
    cy.get('input[name="oldPassword"]').type('wrongpassword');
    cy.get('input[name="newPassword"]').type('Test1234');
    cy.get('input[name="confirmPassword"]').type('Test1234');
    cy.get('button[type=submit]').click();
    cy.contains('The current password is invalid');
  });

  it('Successful password change and login with new password', () => {
    cy.get('input[name="oldPassword"]').type('12345678');
    cy.get('input[name="newPassword"]').type('Test1234');
    cy.get('input[name="confirmPassword"]').type('Test1234');
    cy.get('button[type=submit]').click();
    cy.contains('The password was updated successfully');

    cy.logout();

    cy.visit('/auth/sign-in');
    cy.get('input[name="email"]').type('test123@example.com');
    cy.get('input[name="password"]').type('Test1234');
    cy.get('button[type=submit]').click();
    cy.contains('Logged in successfully! Loading your tasks...');
    cy.location('pathname').should('eq', '/my-tasks');
  });
});
