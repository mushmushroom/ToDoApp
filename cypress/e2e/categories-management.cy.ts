describe('Managing categories', () => {
  beforeEach(() => {
    cy.task('deleteUser', 'test123@example.com');
    cy.task('createUser', {
      email: 'test123@example.com',
      password: '12345678',
    });
    cy.login('test123@example.com', '12345678');
  });

  it('Manage categories link leads to categories page', () => {
    cy.visit('/my-tasks');
    cy.contains('a', 'Manage categories').click();
    cy.location('pathname').should('eq', '/categories');
  });

  it('category is added and displayed on the page', () => {
    cy.visit('/categories');
    cy.contains('button', 'Add new category').click();
    cy.get('input[name="categoryTitle"]').type('Test category');
    cy.contains('button', 'Save').click();
    cy.contains('The category has been added.');
    cy.contains('Test category');
  });

  it('category name should contain at least 4 characters', () => {
    cy.visit('/categories');
    cy.contains('button', 'Add new category').click();
    cy.get('input[name="categoryTitle"]').type('Tes');
    cy.contains('The category name should contain at least 4 characters');
    cy.contains('button', 'Save').should('be.disabled');
  });

  it('category name is edited and displayed on the page', () => {
    cy.visit('/categories');
    cy.contains('button', 'Add new category').click();
    cy.get('input[name="categoryTitle"]').type('Test category');
    cy.contains('button', 'Save').click();
    cy.get('button[title="Edit a category"]').click();
    cy.get('input[name="categoryTitle"]').type('New category');
    cy.contains('button', 'Save').click();
    cy.contains('The category has been updated.');
    cy.contains('New category');
  });

  it('category is deleted, tasks are reassinged to no category', () => {
    // create new category
    cy.visit('/categories');
    cy.contains('button', 'Add new category').click();
    cy.get('input[name="categoryTitle"]').type('Work');
    cy.contains('button', 'Save').click();

    // create new task and assign to this category
    cy.visit('/my-tasks');
    cy.contains('button', 'Add new task').click();
    cy.get('input[name="taskTitle"]').type('test task');
    cy.findByRole('combobox').click();
    cy.findByRole('option', { name: 'Work' }).click();
    cy.contains('button', 'Save').click();
    cy.contains('The task has been added.');
    cy.contains('test task');
    cy.contains('Work');

    // delete category, do not check the box
    cy.visit('/categories');
    cy.get('button[title="Delete a category"]').click();
    cy.get('button').contains('Delete').click();

    // category is not displayed
    cy.contains('The category has been deleted.');
    cy.contains('Work').should('not.exist');

    // task is reassigned
    cy.visit('/my-tasks');
    cy.contains('No category assigned');
  });
  it('category is deleted with the tasks assigned to it', () => {
    // create new category
    cy.visit('/categories');
    cy.contains('button', 'Add new category').click();
    cy.get('input[name="categoryTitle"]').type('Work');
    cy.contains('button', 'Save').click();

    // create new task and assign to this category
    cy.visit('/my-tasks');
    cy.contains('button', 'Add new task').click();
    cy.get('input[name="taskTitle"]').type('test task');
    cy.findByRole('combobox').click();
    cy.findByRole('option', { name: 'Work' }).click();
    cy.contains('button', 'Save').click();
    cy.contains('The task has been added.');
    cy.contains('test task');
    cy.contains('Work');

    // delete category, check the box
    cy.visit('/categories');
    cy.get('button[title="Delete a category"]').click();
    cy.get('button[id="remove-tasks"]').click();
    cy.get('button').contains('Delete').click();

    // category is not displayed
    cy.contains('The category and all associated tasks have been deleted.');
    cy.contains('Work').should('not.exist');

    // task is removed
    cy.visit('/my-tasks');
    cy.contains('test task').should('not.exist');
  });
});
