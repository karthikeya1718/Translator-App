// import { useState } from 'react';
// import axios from 'axios';

// function App() {
//   // State for keyword, language, and results
//   const [keyword, setKeyword] = useState('');
//   const [language, setLanguage] = useState('Telugu');
//   const [targetLanguage, setTargetLanguage] = useState('en');
//   const [results, setResults] = useState([]);

//   // Function to fetch sentiment analysis results
//   const fetchResults = async () => {
//     try {
//       const response = await axios.post('http://127.0.0.1:5000/analyze', {
//         keyword: keyword,
//         language: language,
//         target: targetLanguage
//       });
//       setResults(response.data); // Save the response data in state
//     } catch (error) {
//       console.error('Error fetching data', error);
//     }
//   };

//   return (
//     <div>
//       <div className='flex flex-col p-4 ustify-start gap-y-4 mt-4 mb-4'>
//         <h1 className='text-5xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 font-bold text-center rounded-md textGradient py-1'>
//           News Sentiment Analysis
//         </h1>

//         <div>
//           <label>Enter Keyword:</label>
//           <input
//             type="text"
//             value={keyword}
//             onChange={(e) => setKeyword(e.target.value)}
//             className='border-2 border-gray-300 rounded-md ml-2'
//           />
//         </div>

//         <div>
//           <label>Select Language:</label>
//           <select value={language} onChange={(e) => setLanguage(e.target.value)} className='ml-2'>
//             <option value="Telugu">Telugu</option>
//             <option value="Hindi">Hindi</option>
//             <option value="Tamil">Tamil</option>
//             <option value="Malayalam">Malayalam</option>
//             <option value="Kannada">Kannada</option>
//           </select>
//         </div>

//         <div>
//           <label>Select Target Language:</label>
//           <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} className='ml-2'>
//             <option value="en">English</option>
//             <option value="te">Telugu</option>
//             <option value="hi">Hindi</option>
//             <option value="ta">Tamil</option>
//             <option value="ml">Malayalam</option>
//             <option value="kn">Kannada</option>
//           </select>
//         </div>

//         <button onClick={fetchResults}
//           className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 mx-auto"
//         >Show Results</button>
//       </div>
//       <div>
//         {results.length > 0 && (
//           <table>
//             <thead>
//               <tr>
//                 <th  className='max-w-[500px]'>Title</th>
//                 <th  className='max-w-[500px]'>Translation</th>
//                 <th>Link</th>
//                 <th>Sentiment</th>
//                 <th>Sentiment Class</th>
//               </tr>
//             </thead>
//             <tbody>
//               {results.map((result, index) => (
//                 <tr key={index}>
//                   <td className='max-w-[500px]'>{result.title}</td>
//                   <td className='max-w-[500px]'>{result.translation}</td>
//                   <td>
//                     <a href={result.link} target="_blank" rel="noopener noreferrer">
//                       {result.link}
//                     </a>
//                   </td>
//                   <td>{result.sentiment}</td>
//                   <td>{result['Sentiment Class']}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//       </div>
//       );
// }

//       export default App;



import { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [language, setLanguage] = useState('Telugu');
  const [target, setTarget] = useState('en');
  const [results, setResults] = useState([]);

  const languages = [
    'Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze', {
        keyword,
        language,
        target
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className='text-5xl bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 font-bold text-center rounded-md textGradient py-2'>
        Translator
      </h1>
      {/* <div> */}
      <form className='flex justify-center gap-x-4 mt-4 mb-4 items-center'>
        <input
          type="text"
          placeholder=" Enter Keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
          className='border-2 border-gray-300 rounded-md ml-2'
        />
        <select value={language} onChange={(e) => setLanguage(e.target.value)}
          style={{ marginRight: '20px' }}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
        <select value={target} onChange={(e) => setTarget(e.target.value)}
          style={{ marginRight: '20px' }}
        >
          <option value="en">English</option>
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="ml">Malayalam</option>
          <option value="kn">Kannada</option>
        </select>
        <button type="submit" onClick={handleSubmit}
          className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 mx-auto"
        >Show Results</button>
      </form>
      {/* </div> */}
      <table className="border-4" style={{ borderColor: "darkslategray" }}>
        <thead className="border-4" style={{ borderColor: "darkslategray" }}>
          <tr>
            <th className="border-4" style={{ borderColor: "darkslategray" }}>Title</th>
            <th className="border-4" style={{ borderColor: "darkslategray" }}>Translation</th>
            <th className="border-4" style={{ borderColor: "darkslategray" }}>Link</th>
            <th className="border-4" style={{ borderColor: "darkslategray" }}>Sentiment</th>
            <th className="border-4" style={{ borderColor: "darkslategray" }}>Sentiment Class</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td className="max-w-[500px] border-4" style={{ borderColor: "darkslategray" }}>{result.title}</td>
              <td className="max-w-[550px] border-4" style={{ borderColor: "darkslategray" }}>{result.translation}</td>
              <td className="mr-2 p-4 border-4" style={{ borderColor: "darkslategray" }}>
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  Link
                </a>
              </td>
              <td className="border-4" style={{ borderColor: "darkslategray" }}>{result.sentiment}</td>
              <td className="border-4" style={{ borderColor: "darkslategray" }}>{result['Sentiment Class']}</td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* <table className="border-4 border-black">
        <thead className='border-4'>
          <tr>
            <th className='border-4'>Title</th>
            <th className='border-4'>Translation</th>
            <th className='border-4'>Link</th>
            <th className='border-4'>Sentiment</th>
            <th className='border-4'>Sentiment Class</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td className='max-w-[500px] border-4'>{result.title}</td>
              <td className='max-w-[550px] border-4'>{result.translation}</td>
              <td className='mr-2 p-4 border-4'>
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >Link</a></td>
              <td className='border-4'>{result.sentiment}</td>
              <td className='border-4'>{result['Sentiment Class']}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default App;