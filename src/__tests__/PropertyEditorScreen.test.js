import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PropertyEditorScreen from '../screens/PropertyEditorScreen';

const theme = {
  background: '#fff',
  input: '#fff',
  text: '#111',
  muted: '#666',
  border: '#ccc',
  button: '#1976d2',
  buttonText: '#fff',
  cardSoft: '#f5f5f5',
  error: '#d32f2f',
};

describe('PropertyEditorScreen', () => {
  it('renders add mode and calls onSave with valid payload', () => {
    const onSave = jest.fn();

    const screen = render(
      <PropertyEditorScreen
        property={null}
        theme={theme}
        onSave={onSave}
        onDelete={jest.fn()}
      />,
    );

    fireEvent.changeText(screen.getByPlaceholderText('Bramble'), 'New Property');
    fireEvent.changeText(screen.getByPlaceholderText('Address'), 'Main Street');
    fireEvent.changeText(screen.getByPlaceholderText('House'), 'House');
    fireEvent.changeText(screen.getByPlaceholderText('300000'), '250000');

    fireEvent.press(screen.getByText('Add Property'));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0]).toMatchObject({
      name: 'New Property',
      address: 'Main Street',
      type: 'House',
      value: '250000',
    });
  });

  it('renders edit mode and shows delete action', () => {
    const property = {
      propertyId: 1,
      name: 'Bramble',
      address: 'X',
      type: 'House',
      value: '100000',
      state: 'Amber',
    };

    const screen = render(
      <PropertyEditorScreen
        property={property}
        theme={theme}
        onSave={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText('Save Property')).toBeTruthy();
    expect(screen.getByText('Delete Property')).toBeTruthy();
  });
});
