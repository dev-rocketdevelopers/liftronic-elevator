"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  MegaMenuState,
  MegaMenuActions,
} from "~/components/layout/navbar/types";

/**
 * Custom hook to manage mega menu hover state with debounced timers
 * Prevents flickering and provides smooth UX
 */
export function useMegaMenu() {
  const [state, setState] = useState<MegaMenuState>({
    isOpen: false,
    activeMenu: null,
    activeRangeId: null,
  });

  const openTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  // Open menu with delay
  const openMenu = useCallback(
    (menuType: "products" | "services") => {
      clearTimers();
      openTimerRef.current = setTimeout(() => {
        setState({
          isOpen: true,
          activeMenu: menuType,
          activeRangeId: null,
        });
      }, 150); // 150ms delay before opening
    },
    [clearTimers]
  );

  // Close menu with delay
  const closeMenu = useCallback(() => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => {
      setState({
        isOpen: false,
        activeMenu: null,
        activeRangeId: null,
      });
    }, 200); // 200ms delay before closing
  }, [clearTimers]);

  // Set active product range
  const setActiveRange = useCallback((rangeId: string | null) => {
    setState((prev: MegaMenuState) => ({
      ...prev,
      activeRangeId: rangeId,
    }));
  }, []);

  // Immediate close (for clicks, escape key, etc.)
  const closeImmediate = useCallback(() => {
    clearTimers();
    setState({
      isOpen: false,
      activeMenu: null,
      activeRangeId: null,
    });
  }, [clearTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const actions: MegaMenuActions = {
    openMenu,
    closeMenu,
    setActiveRange,
  };

  return {
    state,
    actions,
    closeImmediate,
  };
}
