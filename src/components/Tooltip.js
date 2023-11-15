// Tooltip.js
const Tooltip = ({ message }) => {
    return (
      <div className="relative group ml-2">
        <div className="absolute bottom-full mb-2 w-56 p-2 text-sm text-white bg-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out z-10">
          {message}
          <svg className="absolute text-gray-700 h-2 w-full left-0 ml-3 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve">
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
          </svg>
        </div>
        <div className="cursor-help text-lg">ℹ️</div>
      </div>
    );
  };
  
  export default Tooltip;
  