import { useEffect, useState } from "react";
import { Range, getTrackBackground, checkValuesAgainstBoundaries } from "react-range";
import Slider from '@mui/material/Slider';

export const ProgrameticSlider = ({ ltr }) => {

    const STEP = 0.1;
    const MIN = 0;
    const MAX = 100;

    const [values, setValues] = useState([50]);
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                direction: 'ltr',
            }}
        >
            <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                rtl={ltr}
                onChange={(values) => setValues(values)}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%'
                        }}
                    >
                        <div className="rangeslider-thumb"
                            ref={props.ref}
                            style={{
                                height: '5px',
                                width: '100%',
                                borderRadius: '4px',
                                background: getTrackBackground({
                                    values,
                                    colors: ['rgb(var(--primary-rgb))', 'var(--default-border)'],
                                    min: MIN,
                                    max: MAX,
                                    // rtl
                                }),
                                alignSelf: 'center'
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props, isDragged }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '42px',
                            width: '42px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--custom-white)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px var(--black-1)'
                        }}
                        key={props.key} 
                    >
                        <div
                            style={{
                                height: '16px',
                                width: '5px',
                                backgroundColor: isDragged ? 'rgb(var(--primary-rgb))' : 'var(--default-border)'
                            }}
                        />
                    </div>
                )}
            />
        </div>
    );
};


export const LabeledTwoThumbs = ({ rtl }) => {

    const STEP = 0.1;
    const MIN = 0;
    const MAX = 100;

    const [values, setValues] = useState([20, 40]);
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}
        >
            <Range
                values={values}
                step={STEP}
                min={MIN}
                max={MAX}
                rtl={rtl}
                onChange={(values) => setValues(values)}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%'
                        }}
                    >
                        <div className="rangeslider-thumb"
                            ref={props.ref}
                            style={{
                                height: '5px',
                                width: '100%',
                                borderRadius: '4px',
                                background: getTrackBackground({
                                    values,
                                    colors: [ 'var(--default-border)','rgb(var(--primary-rgb))', 'var(--default-border)'],
                                    min: MIN,
                                    max: MAX,
                                    rtl
                                }),
                                alignSelf: 'center'
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ index, props, isDragged }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '42px',
                            width: '42px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--custom-white)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px var(--black-1)'
                        }}
                        key={props.key} 
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-28px',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                                padding: '4px',
                                borderRadius: '4px',
                                backgroundColor: 'rgb(var(--primary-rgb))'
                            }}
                        >
                            {values[index].toFixed(1)}
                        </div>
                        <div
                            style={{
                                height: '16px',
                                width: '5px',
                                backgroundColor: isDragged ? 'rgb(var(--primary-rgb))' : 'var(--default-border)'
                            }}
                        />
                    </div>
                )}
            />
        </div>
    );
};



export const UpdatingMarks = ({ rtl }) => {
    const [values, setValues] = useState([50]);
    const [selectedMax, setSelectedMax] = useState(100);
    const [maxOptions] = useState([100, 150, 200, 250, 300]);

    const [selectedMin, setSelectedMin] = useState(0);
    const [minOptions] = useState([0, 15, 20, 25, 30]);

    const [selectedStep, setSelectedStep] = useState(1);
    const [stepOptions] = useState([0.5, 1, 5, 10, 20]);

    useEffect(() => {
        const valuesCopy = [...values].map((value) =>
            checkValuesAgainstBoundaries(value, selectedMin, selectedMax)
        );
        setValues(valuesCopy);
    }, [selectedMin, selectedMax, selectedStep]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}
        >
            <Range
                values={values}
                step={selectedStep}
                min={selectedMin}
                max={selectedMax}
                rtl={rtl}
                onChange={(values) => setValues(values)}
                renderMark={({ props, index }) => (
                    <div
                        {...props}
                        key={index}
                        style={{
                            ...props.style,
                            height: '16px',
                            width: '2px',
                            backgroundColor:
                                index * selectedStep + selectedMin < values[0]
                                    ? 'rgb(var(--primary-rgb))'
                                    : 'var(--default-border)'
                        }}
                    />
                )}
                renderTrack={({ props, children }) => (
                    <div className="rangeslider-thumb"
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%'
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: '3px',
                                width: '100%',
                                borderRadius: '4px',
                                background: getTrackBackground({
                                    values,
                                    colors: ['rgb(var(--primary-rgb))', 'var(--default-border)'],
                                    min: selectedMin,
                                    max: selectedMax,
                                    rtl
                                }),
                                alignSelf: 'center'
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ props, isDragged }) => (
                    <div
                        {...props}
                        key="thumb"
                        style={{
                            ...props.style,
                            height: '52px',
                            width: '22px',
                            borderRadius: '4px',
                            backgroundColor: 'var(--custom-white)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px var(--black-1)'
                        }}
                    >
                        <div
                            style={{
                                height: '16px',
                                width: '3px',
                                backgroundColor: isDragged ? 'rgb(var(--primary-rgb))' : 'var(--default-border)'
                            }}
                        />
                    </div>
                )}
            />
            <div className="w-100">
                <output
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        top: '20px',
                        position: 'relative',
                    }}
                >
                    <span style={{ backgroundColor: 'rgba(90,102,241,0.1)', color: '#5a66f1', padding: '6px', }}>{values[0].toFixed(1)}</span>
                </output>
                <div
                    style={{
                        top: '25px',
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: '15px'
                        }}
                    >
                        <p>Select range max:</p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, minmax(10px, 1fr))',
                                gridGap: '10px'
                            }}
                        >
                            {maxOptions.map((val, idx) => (
                                <button
                                    key={`${idx}-${val}`}
                                    id={`_${idx}-${val}`}
                                    data-max={val}
                                    style={{
                                        backgroundColor: val === selectedMax ? 'rgb(var(--primary-rgb))' : 'var(--custom-white)',
                                        color: val === selectedMax ? '#fff' : 'var(--default-text-color)',
                                        padding: '5px 10px',
                                        border:
                                            val === selectedMax
                                                ? '1px solid rgb(var(--primary-rgb))'
                                                : '1px solid var(--default-border)',
                                        fontSize: '12px',
                                        fontWeight: val === selectedMax ? 600 : 400,
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.07)'
                                    }}
                                    onClick={(e) => {
                                        const el = e.target
                                        const newMax = el.dataset;
                                        setSelectedMax((prev) =>
                                            newMax !== undefined && newMax.max !== undefined
                                                ? +newMax.max
                                                : prev
                                        );
                                    }}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: '15px'
                        }}
                    >
                        <p>Select range min:</p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, minmax(10px, 1fr))',
                                gridGap: '10px'
                            }}
                        >
                            {minOptions.map((val, idx) => (
                                <button
                                    key={`${idx}-${val}`}
                                    id={`_${idx}-${val}`}
                                    data-min={val}
                                    style={{
                                        backgroundColor: val === selectedMin ? 'rgb(var(--primary-rgb))' : 'var(--custom-white)',
                                        color: val === selectedMin ? '#fff' : 'var(--default-text-color)',
                                        padding: '5px 10px',
                                        border:
                                            val === selectedMin
                                                ? '1px solid rgb(var(--primary-rgb))'
                                                : '1px solid var(--default-border)',
                                        fontSize: '15px',
                                        fontWeight: val === selectedMin ? 600 : 400,
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.07)'
                                    }}
                                    onClick={(e) => {
                                        const el = e.target
                                        const newMin = el.dataset;
                                        setSelectedMin((prev) =>
                                            newMin !== undefined && newMin.min !== undefined
                                                ? +newMin.min
                                                : prev
                                        );
                                    }}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}
                    >
                        <p>Select step:</p>
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(5, minmax(10px, 1fr))',
                                gridGap: '10px'
                            }}
                        >
                            {stepOptions.map((val, idx) => (
                                <button key={`${idx}-${val}`} id={`_${idx}-${val}`} data-step={val}
                                    style={{
                                        backgroundColor: val === selectedStep ? 'rgb(var(--primary-rgb))' : 'var(--custom-white)',
                                        color: val === selectedStep ? '#fff' : 'var(--default-text-color)',
                                        padding: '5px 10px',
                                        border:
                                            val === selectedStep
                                                ? '1px solid rgb(var(--primary-rgb))'
                                                : '1px solid var(--default-border)',
                                        fontSize: '15px',
                                        fontWeight: val === selectedStep ? 600 : 400,
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.07)'
                                    }}
                                    onClick={(e) => {
                                        const el = e.target
                                        const newStep = el.dataset;
                                        setSelectedStep((prev) =>
                                            newStep !== undefined && newStep.step !== undefined
                                                ? +newStep.step
                                                : prev
                                        );
                                    }}
                                > {val} </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function MinMaxSlider() {
    const [value, setValue] = useState([20, 37]);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      
        <Slider value={value} onChange={handleChange} valueLabelDisplay="auto" />
      
    );
  }
  
  
  const marks = [
    {
      value: 0,
      label: '0',
    },
    {
      value: 50,
      label: '50',
    },
    {
      value: 100,
      label: '100',
    },
  ];
  
  
  export function StepSlider() {
    return (
        <Slider defaultValue={80} step={10} marks={marks} valueLabelDisplay="on" />
    );
  }