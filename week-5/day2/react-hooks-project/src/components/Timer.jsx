import { useState, useEffect } from "react";

function Timer() {

  const [seconds, setSeconds] =
    useState(0);

  useEffect(() => {

    const timer =
      setInterval(() => {

        setSeconds(prev =>
          prev + 1
        );

      }, 1000);

    return () => {
      clearInterval(timer);
    };

  }, []);

  return (
    <div>
      <h2>Timer Component</h2>

      <h1>{seconds}</h1>
    </div>
  );
}

export default Timer;