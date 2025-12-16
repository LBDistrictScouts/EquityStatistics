import { render, screen } from '@testing-library/react';
import {getOrMakeCookie} from './utilities';

test('Tests utility function', () => {
  let result = getOrMakeCookie('test', () => {return 'Goat123'});
  expect(result).toBe('Goat123');

  result = getOrMakeCookie('test', () => {return 'Fish456'});
  expect(result).toBe('Goat123');

  result = getOrMakeCookie('test2', () => {return 'Fish456'});
  expect(result).toBe('Fish456');
});
