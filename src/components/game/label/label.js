import React, { useContext } from 'react';
import { Slide, toast } from 'react-toastify';
import { PreferencesContext } from '../../../providers/preferencesProvider';
import './label.css';

function Label(props) {

    const { theme } = useContext(PreferencesContext);

    function handleClick() {
        if (props.info) {
            toast.info(props.info, {
                position: "top-center",
                autoClose: 2000,
				transition: Slide,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                pauseOnFocusLoss: true,
                draggable: true,
                progress: undefined,
                theme: theme
            });
        }
    };

    const value = props.value;
    const icon = props.icon?.toLowerCase();
    const labelClass = "label " + (props.variant ? props.variant : "");

    return (
        <div className={labelClass}>
            <button className={labelClass} onClick={handleClick}>
                {icon ? <img src={"../svg/labels/" + icon  + ".svg"} alt={value} /> : <strong>{value}</strong>}
            </button>
        </div>
    );
};

export default Label;
