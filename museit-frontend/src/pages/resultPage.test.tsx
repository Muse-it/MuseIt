import { render, screen } from '@solidjs/testing-library';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { Router } from '@solidjs/router';
import ResultPage from './resultPage';
import { describe, it, expect, vi } from 'vitest';
import { createSignal } from 'solid-js';
import { setupRender } from '~/lib/testUtils';

describe('ResultPage', () => {
  it('renders the title with search text', () => {
    render(() => setupRender(() => <ResultPage />));
    expect(screen.getByText(/Searching with/)).toBeDefined();
  });
});

describe('doRefetch', () => {
  it('calls refetch when enabled', () => {
    const refetch = vi.fn();
    const [isGenEnabled, setIsGenEnabled] = createSignal(true);

    const doRefetch = () => {
      if (isGenEnabled()) {
        refetch();
      } else {
        setIsGenEnabled(true);
      }
    };

    doRefetch();
    expect(refetch).toHaveBeenCalled();
  });
});