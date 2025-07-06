import React, { useRef, useState, useEffect } from 'react';

export const MultiAutoComplete = ({
  handle_AutoComplete_Click,
  autoCompleteData,
  inputName,
  txt_css,
  setRowItems,
  dropdownKeys = [] // ✅ Accept keys to show in dropdown
}) => {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [itemsData, setItemsData] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    setItemsData(autoCompleteData || []);
  }, [autoCompleteData]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setHighlightedIndex(-1);

    if (value) {
      const lower = value.toLowerCase();
      const results = itemsData.filter((item) =>
        dropdownKeys.some((key) =>
          String(item[key] || '').toLowerCase().includes(lower)
        )
      );
      setFilteredItems(results);
    } else {
      setFilteredItems([]);
    }
  };

  const handleItemClick = (item) => {
    setRowItems(item);
    setQuery('');
    setFilteredItems([]);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (filteredItems.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filteredItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleItemClick(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        setFilteredItems([]);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setFilteredItems([]);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="container w-3/6 relative">
      <input
        ref={inputRef}
        type="text"
        id={inputName}
        name={inputName}
        value={query}
         onClick={handle_AutoComplete_Click}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        autoComplete="off"
        className={`${txt_css} search-input`}
      />

      {filteredItems.length > 0 && (
        <div className="dropdown absolute z-10 bg-white border border-gray-300 mt-1 w-full max-h-60 overflow-auto" ref={dropdownRef}>
          <div className="dropdown-header font-semibold bg-gray-300 grid grid-cols-4 gap-4 p-2 border-b border-gray-300">
            {dropdownKeys.map((key, idx) => (
              <span key={idx}>{key.toUpperCase()}</span>
            ))}
          </div>
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className={`justify-normal  text-nowrap grid grid-cols-4 gap-4 p-2 cursor-pointer hover:bg-blue-100 ${
                index === highlightedIndex ? 'bg-blue-200' : ''
              }`}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {dropdownKeys.map((key, idx) => (
                <span key={idx}>{item[key]}</span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
