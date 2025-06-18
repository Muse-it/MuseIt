import { render, screen } from '@solidjs/testing-library';
import { PlotOptions } from './plotOptions';
import { describe, it, expect } from 'vitest';
import { mockMetadata } from '~/lib/mockData';
import { setupRender } from '~/lib/testUtils';

describe('PlotOptions', () => {
  it('renders plot options with metadata', () => {
    const metadata = { key: 'value' };
    render(() => setupRender(() => <PlotOptions source="mock" metadata={mockMetadata} search="TestSearch" />));
    expect(screen.getByText(/Plot Options/)).toBeDefined();
  });
});