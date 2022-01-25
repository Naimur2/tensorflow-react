/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import './form.css';

export default function SampleForm() {
    const formSubmithandler = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={formSubmithandler}>
            <div className="form-group">
                <label className="form-label" htmlFor="name">
                    Username
                </label>
                <input type="text" className="form-control" id="name" />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="email">
                    Email
                </label>
                <input type="email" className="form-control" id="email" />
            </div>
            <div className="form-group form-acrtion">
                <button disabled className="btn btn-dark" type="submit">
                    Submit
                </button>
            </div>
        </form>
    );
}
