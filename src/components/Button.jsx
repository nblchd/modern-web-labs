export default function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{ padding: '10px 20px', margin: '5px', cursor: 'pointer' }}
    >
      {children}
    </button>
  );
}
