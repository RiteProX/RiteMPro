import React from 'react';

export default function AuthScreen(){
  return (
    <div aria-hidden style={{position:'fixed',right:12,bottom:12}}>
      {/* Placeholder auth control; real modal wired in later commits */}
      <button className="btn">Sign In</button>
    </div>
  );
}
