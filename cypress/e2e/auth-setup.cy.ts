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

  it(
    'Successfull registration and verification message',
    {
      env: {
        SKIP_EMAILS: true,
      },
    },
    () => {
      cy.task('deleteUser', 'testuser123@example.com');
      cy.visit('/auth/register');
      cy.get('input[name="email"]').type('testuser123@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('button[type=submit]').click();
      cy.contains('Success! Please check your inbox for a verification email.');
    },
  );

  it('Fails for already registered user', () => {
    cy.visit('/auth/register');
    cy.get('input[name="email"]').type('testuser123@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type=submit]').click();
    cy.contains('User already exists.');
  });

  it('Invalid credentials throw error on login', () => {
    cy.visit('/auth/sign-in');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type=submit]').click();
    cy.contains('Invalid credentials');
  });

  it('Email is not verified', () => {
    cy.task('deleteUser', 'test123@example.com');
    cy.task('createUser', {
      email: 'test123@example.com',
      password: '12345678',
    });
    cy.visit('/auth/sign-in');
    cy.get('input[name="email"]').type('test123@example.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type=submit]').click();
    cy.contains('Please verify your email before signing in.');
    cy.contains('button', 'Resend verification email').should('exist');
  });
  it('Successful login for verified user and redirect to /my-tasks', () => {
    cy.task('deleteUser', 'test123@example.com');
    cy.task('createUser', {
      email: 'test123@example.com',
      password: '12345678',
      email_verified: true,
    });
    cy.visit('/auth/sign-in');
    cy.get('input[name="email"]').type('test123@example.com');
    cy.get('input[name="password"]').type('12345678');
    cy.get('button[type=submit]').click();
    cy.contains('Logged in successfully! Loading your tasks...');
    cy.location('pathname').should('eq', '/my-tasks');
  });
});
