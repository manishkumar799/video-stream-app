import React from 'react';

const App = () => {
  return (
    <div>
      {/* <h1>Video Streaming App</h1> */}
      <video controls style={{ width: '80%', margin: '20px auto', display: 'block' }}>
        <source src="http://localhost:5000/video" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default App;
