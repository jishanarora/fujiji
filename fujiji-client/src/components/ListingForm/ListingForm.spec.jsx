import { render, fireEvent } from '@testing-library/react';

import ListingForm from './ListingForm';

const mockInvalidFile = {
  name: 'test.txt',
  type: 'random/type',
};

const mockValidFile = {
  name: 'test.png',
  type: 'image/png',
};

const mockUpdateProps = {
  title: 'mockTitle',
  description: 'mockDescription',
  condition: 'Refurbished',
  city: 'mockCity',
  province: 'BC',
  imageUrl: 'mockUrl',
  price: 99,
  category: 'Other',
  isUpdate: true,
};

const mockPostProps = {
  title: 'mockTitle',
  description: 'mockDescription',
  condition: 'Refurbished',
  city: 'mockCity',
  province: 'BC',
  price: 99,
  category: 'Other',
  isUpdate: false,
};

describe('ListingForm', () => {
  it('should render with empty props (post form)', () => {
    const { getByText } = render(<ListingForm />);
    // isUpdate is false by default. e.g., render component for POST
    expect(getByText('Post')).toBeInTheDocument();
    expect(getByText('Discard')).toBeInTheDocument();
    // condition is "Used" by default
    expect(getByText('Used').selected).toBeTruthy();
    expect(getByText('Brand New').selected).toBeFalsy();
    expect(getByText('Refurbished').selected).toBeFalsy();
    // province is "MB" by default
    expect(getByText('MB').selected).toBeTruthy();
    expect(getByText('Other').selected).toBeTruthy();
  });

  it('should render update form', () => {
    const { getByText, getByDisplayValue } = render(
      <ListingForm {...mockUpdateProps} />,
    );

    expect(getByDisplayValue(mockUpdateProps.title)).toBeInTheDocument();
    expect(getByDisplayValue(mockUpdateProps.description)).toBeInTheDocument();
    expect(getByDisplayValue(mockUpdateProps.city)).toBeInTheDocument();
    expect(getByText('Update')).toBeInTheDocument();
    expect(getByText('Delete')).toBeInTheDocument();
    expect(getByText(mockUpdateProps.condition).selected).toBeTruthy();
    expect(getByText(mockUpdateProps.province).selected).toBeTruthy();
  });

  it('should give errors when submitting incomplete form', () => {
    const { getByText } = render(<ListingForm />);

    fireEvent.click(getByText('Post'), { bubbles: true });

    expect(getByText("Title can't be empty")).toBeInTheDocument();
    expect(getByText("City can't be empty")).toBeInTheDocument();
    expect(getByText('Listing must have an image')).toBeInTheDocument();
    expect(
      getByText('Price is invalid (valid ex: 5000 or 49.99)'),
    ).toBeInTheDocument();
  });

  it('should give errors when uploading incorrect file format', () => {
    const { getByText } = render(<ListingForm {...mockUpdateProps} />);

    const fileInput = document.querySelector('#image-upload-input');

    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(['(??????_???)'], mockInvalidFile.name, {
            type: mockInvalidFile.type,
          }),
        ],
      },
    });

    expect(getByText('Allowed files: .png, .jpg, .jpeg')).toBeInTheDocument();
  });

  it('should not give errors when submitting a valid file format', () => {
    global.URL.createObjectURL = jest.fn(() => 'url');
    const { queryByText, getByLabelText } = render(
      <ListingForm {...mockUpdateProps} />,
    );

    const fileInput = document.querySelector('#image-upload-input');

    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(['(??????_???)'], mockValidFile.name, {
            type: mockValidFile.type,
          }),
        ],
      },
    });

    expect(queryByText('Allowed files: .png, .jpg, .jpeg')).toBeFalsy();
    expect(getByLabelText('listing-image')).toBeInTheDocument();
  });

  it('should submit the form if all fields are valid', () => {
    const mockOnSubmit = jest.fn();

    const { getByText, getByDisplayValue } = render(
      <ListingForm {...mockPostProps} onSubmit={mockOnSubmit} />,
    );

    const fileInput = document.querySelector('#image-upload-input');

    fireEvent.change(fileInput, {
      target: {
        files: [
          new File(['(??????_???)'], mockValidFile.name, {
            type: mockValidFile.type,
          }),
        ],
      },
    });

    fireEvent.click(getByText('Post'), { bubbles: true });

    expect(getByDisplayValue(mockPostProps.title)).toBeInTheDocument();
    expect(getByDisplayValue(mockPostProps.description)).toBeInTheDocument();
    expect(getByDisplayValue(mockPostProps.city)).toBeInTheDocument();
    expect(getByText('Post')).toBeInTheDocument();
    expect(getByText('Discard')).toBeInTheDocument();
    expect(getByText(mockPostProps.condition).selected).toBeTruthy();
    expect(getByText(mockPostProps.province).selected).toBeTruthy();
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should change the input value properly', () => {
    const mockOnSubmit = jest.fn();

    const { getByText, getByLabelText, getByDisplayValue } = render(
      <ListingForm {...mockPostProps} onSubmit={mockOnSubmit} />,
    );

    fireEvent.change(getByLabelText('listing-title'), {
      target: { value: 'different title' },
    });
    fireEvent.change(getByLabelText('listing-condition'), {
      target: { value: 'Brand New' },
    });
    fireEvent.change(getByLabelText('listing-description'), {
      target: { value: 'different description' },
    });
    fireEvent.change(getByLabelText('listing-city'), {
      target: { value: 'Toronto' },
    });
    fireEvent.change(getByLabelText('listing-province'), {
      target: { value: 'ON' },
    });
    fireEvent.change(getByLabelText('listing-category'), {
      target: { value: 'Chair' },
    });
    fireEvent.change(getByLabelText('listing-price'), {
      target: { value: 2345 },
    });

    expect(getByDisplayValue('different title')).toBeInTheDocument();
    expect(getByDisplayValue('different description')).toBeInTheDocument();
    expect(getByDisplayValue('Toronto')).toBeInTheDocument();

    expect(getByText('Brand New').selected).toBeTruthy();
    expect(getByText('Refurbished').selected).toBeFalsy();

    expect(getByText('ON').selected).toBeTruthy();
    expect(getByText('BC').selected).toBeFalsy();

    expect(getByText('Chair').selected).toBeTruthy();
    expect(getByText('Other').selected).toBeFalsy();

    expect(getByDisplayValue('2345')).toBeInTheDocument();
  });
});
