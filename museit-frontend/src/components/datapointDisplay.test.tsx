import { render, screen } from '@solidjs/testing-library';
import { DatapointDisplay } from './datapointsDisplay';
import { describe, it, expect } from 'vitest';
import { mockMetadata } from '~/lib/mockData';
import { setupRender } from '~/lib/testUtils';

describe('DatapointDisplay', () => {
  it('renders data points from metadata', () => {
    const metadata = { points: [1, 2, 3] };
    render(() => setupRender(() => <DatapointDisplay metadata={mockMetadata} />));
    expect(screen.getByText(/Data Points/)).toBeDefined();
  });
});