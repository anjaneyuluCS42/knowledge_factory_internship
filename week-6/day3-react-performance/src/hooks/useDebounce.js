import { useState, useEffect } from "react";

/*
========================================
useDebounce Hook

Purpose:
Waits for the user to stop typing
before updating the value.

Real World:

Google Search
Amazon Search
YouTube Search

========================================
*/

function useDebounce(value, delay) {

  // Store delayed value
  const [debouncedValue, setDebouncedValue] =
    useState(value);

  useEffect(() => {

    /*
    Wait for delay milliseconds
    */

    const timer = setTimeout(() => {

      setDebouncedValue(value);

    }, delay);

    /*
    Cleanup

    If user types again before
    delay completes,
    cancel previous timer.
    */

    return () => clearTimeout(timer);

  }, [value, delay]);

  return debouncedValue;

}

export default useDebounce;