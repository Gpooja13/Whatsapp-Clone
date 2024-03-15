import React, { useRef ,useEffect} from "react";

function ContextMenu({ options, coordinates, contextMenu, setContextMenu }) {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.id !== "context-opener") {
        if (
          contextMenuRef.current &&
          !contextMenuRef.current.contains(e.target)
        ) {
          setContextMenu(false);
        }
      }
    };
    document.addEventListener("click",handleOutsideClick);
    return()=>{
      document.removeEventListener("click",handleOutsideClick);
    }
  }, []);

  const handleClick = (e, callback) => {
    e.stopPropagation();
    callback();
    setContextMenu(false);
  };
  return (
    <div
      className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`}
      ref={contextMenuRef}
      style={{ top: coordinates.y, left: coordinates.x }}
    >
      <ul>
        {options.map(({ name, callback }) => {
          return (
            <li
              className="px-4 py-2 cursor-pointer hover:bg-background-default-hover"
              key={name}
              onClick={(e) => handleClick(e, callback)}
            >
              <span className="text-white">{name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ContextMenu;
