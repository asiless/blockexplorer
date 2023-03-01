import { render, screen, waitFor } from '@testing-library/react';
import {Navigator, Addresses, LastBlock} from './App';
import {getLastBlock, getBalance} from './blocks';

jest.mock('./blocks', () => ({ getLastBlock: jest.fn()}))

it('renders Address', () => {
  render(<Addresses />);
//  const linkElement = screen.getByText(/learn react/i);
//  expect(linkElement).toBeInTheDocument();
});

it('renders LastBlock', async () => {

  getLastBlock.mockImplementation(() => Promise.resolve(
    [
      '101',
      {
        block_hash:'##block-hash##',
        transactions:[ {hash:'##hash-a##'}, {hash:'##hash-b##'}]
      }
    ]
    )
  );

  const { baseElement } = render(<LastBlock />);
  await waitFor(() => screen.getByText("Last Block: 101"));
  await waitFor(() => screen.getByText("block_hash:"));
  await waitFor(() => screen.getByText('"##block-hash##"'));
  await waitFor(() => screen.getByText("##hash-a##"));
  await waitFor(() => screen.getByText("##hash-b##"));
});

it('renders Navigator', async () => {

  getLastBlock.mockImplementation(() => Promise.resolve(['102', {a:'b', transactions:[ {hash:'a'}, {hash:'b'}]}]))

  const { baseElement } = render(<Navigator />);
  await waitFor(() => screen.getByText("Last Block: 102"));
 });
 