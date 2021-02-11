import React, { useState } from 'react';
import initialState from './data/initialState';
import presets from './data/presets';
import './App.css';

function App() {
  const [fields, setFields] = useState(initialState);

  const createStyle = (override = {}) => (
    {
      property: '',
      value: '',
      ...override
    }
  );
  const createField = (override = {}) => (
    {
      value: '',
      type: 'text',
      styles: [],
      ...override
    }
  );
  const updateFields = () => {
    setFields([...fields]);
  };
  const addStyle = (index, event) => {
    if (event) event.preventDefault();
    fields[index].styles.push(createStyle({is_new: true}));
    updateFields();
  };
  const removeStyle = (index, styleIndex, event) => {
    if (event) event.preventDefault();
    fields[index].styles.splice(styleIndex, 1);
    updateFields();
  };
  const toggleStyle = (index, event) => {
    if (event) event.preventDefault();
    fields[index].is_expanded = !fields[index].is_expanded;
    updateFields();
  };
  const addField = (event) => {
    if (event) event.preventDefault();
    fields.push(createField({is_new: true, is_expanded: true}));
    updateFields();
  };
  
  return (
    <div className="bo-container">
      <div className="bo-row">
        <div className="bo-col">
          {fields.map((field, index) => (
            <div className="field" key={index}>
              <h2>
                {field.value}
                <button className="style-btn style-edit"
                  onClick={toggleStyle.bind(this, index)}
                  data-index={index}>{field.is_expanded ? 'collapse': 'edit'}</button>
              </h2>
              <div className={`style-container ${!field.is_expanded ? 'hidden': ''}`}>
                <div className="bo-row style-row">
                  <div className="bo-col bo-col-1-3 style-col">
                    <label htmlFor={`fields[${index}].value`}><strong>Content</strong></label>
                  </div>
                  <div className="bo-col style-col">
                    <input 
                      onChange={(event) => {field.value = event.currentTarget.value; updateFields();}}
                      type="text"
                      id={`fields[${index}].value`}
                      className="input style-value"
                      value={field.value} />
                  </div>
                </div>
                {field.styles.map((style, styleIndex) => (
                  <div className="bo-row style-row" key={index+'_'+styleIndex}>
                    <div className="bo-col bo-col-1-3 style-col">
                      {style.is_new ? (
                        <span>
                          {style.is_custom ? (
                            <input
                              onChange={(event) => {style.property = event.currentTarget.value; updateFields();}}
                              type="text"
                              className="input style-property"
                              value={style.property}
                            />
                          ) : (
                            <select
                              className="input style-preset"
                              value={style.property}
                              onChange={(event) => {
                                if (event.currentTarget.value === 'MANUAL') {
                                  style.property = '';
                                  style.is_custom = true;
                                } else {
                                  style.property = event.currentTarget.value
                                }
                                updateFields(); 
                              }}
                            >
                              <option value="" disabled={true}>Select a property</option>
                              {presets.map((preset, key) => (
                                <option value={preset.name} key={key}>
                                  {preset.text || preset.name}
                                </option>
                              ))}
                              <option value="MANUAL">MANUAL</option>
                            </select>
                          )}
                        </span>
                      ) : (
                        <label htmlFor={`fields[${index}].styles[${styleIndex}].value`} title={style.property}>{style.property}</label>
                      )}
                    </div>
                    <div className="bo-col style-col">
                      <input  
                        onChange={(event) => {style.value = event.currentTarget.value; updateFields();}}
                        type={`${(presets.filter(preset => !style.is_custom && preset.name === style.property)[0]||{}).type || 'text'}`}
                        id={`fields[${index}].styles[${styleIndex}].value`}
                        className="input style-value"
                        value={style.value} />
                    </div>
                    <div className="bo-col bo-col-1-12 style-col">
                      <button
                        onClick={removeStyle.bind(this, index, styleIndex)}
                        className="style-btn style-remove">-</button>
                    </div>
                  </div>
                ))}
                <div className="style-row">
                  <button
                    onClick={addStyle.bind(this, index)}
                    className="style-btn style-add">+ add property</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addField}
            className="style-btn field-add">+ add field</button>
        </div>
        <div className="bo-col">
          <div className="console"><pre>{JSON.stringify(fields, null, 2)}</pre></div>
        </div>
      </div>
    </div>
  );
}

export default App;
