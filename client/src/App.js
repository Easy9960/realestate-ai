
import React, { useState } from "react";

function App() {
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [result, setResult] = useState(null);

  const compare = async () => {
    const res = await fetch("http://localhost:5000/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget, location, type })
    });
    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{padding:"40px", fontFamily:"Arial"}}>
      <h2>AI Property Comparison</h2>
      <input placeholder="Budget" onChange={e=>setBudget(e.target.value)} /><br/><br/>
      <input placeholder="Location" onChange={e=>setLocation(e.target.value)} /><br/><br/>
      <input placeholder="Type" onChange={e=>setType(e.target.value)} /><br/><br/>
      <button onClick={compare}>Compare</button>

      {result && (
        <div>
          <h3>Results:</h3>
          {result.properties.map(p=>(
            <div key={p._id}>
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
              <p>{p.size}</p>
              <p>ROI: {p.roi}</p>
            </div>
          ))}
          <h3>AI Recommendation</h3>
          <p>{result.recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default App;
