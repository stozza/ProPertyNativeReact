import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TenancyEditorScreen from '../screens/TenancyEditorScreen';

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

describe('TenancyEditorScreen', () => {
  it('shows contracted fields when Contracted status selected', () => {
    const screen = render(
      <TenancyEditorScreen
        tenancy={null}
        theme={theme}
        onSave={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    fireEvent.press(screen.getByText('Contracted'));

    expect(screen.getByPlaceholderText('Tenant name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Contact number')).toBeTruthy();
    expect(screen.getByPlaceholderText('12')).toBeTruthy();
  });

  it('calls onSave for valid available tenancy', () => {
    const onSave = jest.fn();
    const screen = render(
      <TenancyEditorScreen
        tenancy={null}
        theme={theme}
        onSave={onSave}
        onDelete={jest.fn()}
      />,
    );

    fireEvent.changeText(screen.getByPlaceholderText('Room 1'), 'Room 2');
    fireEvent.changeText(screen.getByPlaceholderText('650'), '700');
    fireEvent.press(screen.getByText('Add Tenancy'));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0]).toMatchObject({
      type: 'Room 2',
      status: 'Available',
      monthlyCost: '700',
    });
  });
});
