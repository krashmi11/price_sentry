import React, { useEffect } from 'react';

const MyComponent = () => {
    const username=localStorage.getItem('username');
  // Your function that you want to call first
  const myFunction = (input) => {
    console.log('This function is called first!'+input);
    // Add your logic here
  };

  // useEffect to call the function
  useEffect(() => {
    myFunction(username);
  }, [username]); // The empty dependency array means this runs once on mount

  return (
    <div>
      <h1>My Component</h1>
      {/* Other component logic */}
    </div>
  );
};

export default MyComponent;
