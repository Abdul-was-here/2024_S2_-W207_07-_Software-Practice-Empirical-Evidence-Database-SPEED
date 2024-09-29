import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Register from '../register';
import { useRouter } from 'next/router';


// 模拟 useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Register Component', () => {
  it('should render the registration form', () => {
    render(<register />);
    
    // 检查是否存在 email、password 输入框及角色选择框
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Submitter')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('should display an error when registration fails', async () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({ push: mockPush }));

    // 模拟 fetch 失败
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: 'Username has been used' }),
      })
    );

    render(<Register />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Register'));

    // 等待 alert 弹出
    await screen.findByText('Registration failed, username has been used');
  });

  it('should redirect after successful registration', async () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({ push: mockPush }));

    // 模拟 fetch 成功
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    render(<Register />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByText('Register'));

    // 确保页面跳转
    expect(mockPush).toHaveBeenCalledWith('/login');
  });
});
