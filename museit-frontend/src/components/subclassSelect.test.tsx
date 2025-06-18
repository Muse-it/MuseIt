import { render, screen, fireEvent } from '@solidjs/testing-library';
import {SubclassSelect} from './subclassSelect';
import { describe, it, vi, expect } from 'vitest';
import { mockSearch } from '~/lib/mockData';
import { setupRender } from '~/lib/testUtils';

describe('SubclassSelect', () => {
  it('renders and triggers refetch on selection', () => {
    const mockRefetch = vi.fn();
    render(() => setupRender(() => <SubclassSelect allSubclasses={mockSearch} triggerRefetch={mockRefetch} />));
    fireEvent.click(screen.getByText('A'));
    expect(mockRefetch).toHaveBeenCalled();
  });
});