import { fireEvent, render, screen } from '@testing-library/react';
import CategoriesSelect from '../categories/CategoriesSelect';

const mockCategories = [
  { id: '1', name: 'Work' },
  { id: '2', name: 'Personal' },
];

describe('CategoriesSelect Component', () => {
  it('passed value is displayed in select', () => {
    render(<CategoriesSelect categories={mockCategories} value="1" />);
    const selectedValue = screen.getByText(/work/i);
    expect(selectedValue).toBeInTheDocument();
  });
  it('all passed categories displayed, with No category, without All', () => {
    render(<CategoriesSelect categories={mockCategories} allowAll={false} />);
    const categorySelect = screen.getByRole('combobox');
    expect(categorySelect).toBeInTheDocument();

    fireEvent.click(categorySelect);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('No category');
    expect(options[1]).toHaveTextContent('Work');
    expect(options[2]).toHaveTextContent('Personal');
  });

  it('if allowAll is true, All categories are displayed', () => {
    render(<CategoriesSelect categories={mockCategories} allowAll={true} />);
    const categorySelect = screen.getByRole('combobox');
    expect(categorySelect).toBeInTheDocument();

    fireEvent.click(categorySelect);
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('All tasks');
    expect(options[1]).toHaveTextContent('No category');
    expect(options[2]).toHaveTextContent('Work');
    expect(options[3]).toHaveTextContent('Personal');
  });
  it('when value is selected, onChange is executed', () => {
    const onChange = jest.fn();

    render(<CategoriesSelect categories={mockCategories} allowAll={true} onChange={onChange} />);
    const categorySelect = screen.getByRole('combobox');
    expect(categorySelect).toBeInTheDocument();
    fireEvent.click(categorySelect);

    const workOption = screen.getByText('Work');
    fireEvent.click(workOption);
    expect(onChange).toHaveBeenCalledWith('1');
  });
});
