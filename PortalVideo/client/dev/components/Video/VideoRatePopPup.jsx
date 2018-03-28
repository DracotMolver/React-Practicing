/**
 * @author Diego Alberto Molina Vera
 * @copyright 2017 - 2018
 *
 * This component will render a popup dialog to rate the video
 */
// -========================== MODULES ==========================-
import React from 'react';
import PropTypes from 'prop-types';
import SuperAgent from 'superagent';

// A common wrapper component as popup
const PopUpParent = props => {
    const {
        handleClickClose,
        name
    } = props;

    return (
        <div>
            <div className="grid-100">
                <div className="rate-close-popup"
                    onClick={handleClickClose}
                >
                    Close &#10005;
                </div>
            </div>
            <div className="grid-100">
                <h3>{name}</h3>
            </div>
            <div className="grid-100 grid-parent">
                {props.children}
            </div>
        </div>
    );
}

PopUpParent.propTypes = {
    name: PropTypes.string,
    handleClickClose: PropTypes.func
};

// ------------------------------------------------------------------------

const InitialMessage = props => {
    const {
        handleChangeRate,
        handleClickClose,
        handleClickDone
    } = props;

    let inputs = [];

    for (let i = 0; i < 5; i++) {
        inputs.push(
            <div key={`rate-${i}`}>
                <div className="grid-20 mobile-grid-20">
                    <input
                        className="option-input"
                        name="rateVideo"
                        type="radio"
                        value={`${i + 1}`}
                        onChange={handleChangeRate}
                    />
                    {`+${i + 1}`}
                </div>
            </div>
        )
    }

    return (
        <PopUpParent
            handleClickClose={handleClickClose}
            name="How much did you enjoy the video?"
        >
            <div>
                <div className="grid-100 rate-stars-input">
                    {inputs}
                </div>
                <div className="grid-100">
                    <div className="rate-button-container">
                        <button type="button"
                            className="button shadow"
                            onClick={handleClickDone}
                        >
                            Done!
                        </button>
                    </div>
                </div>
            </div>
        </PopUpParent>
    );
};

InitialMessage.propTypes = {
    handleChangeRate: PropTypes.func,
    handleClickClose: PropTypes.func,
    handleClickDone: PropTypes.func
};

// ------------------------------------------------------------------------

const SuccessMessage = props => {
    const {
        handleClickClose
    } = props;

    let time = setTimeout(() => {
        handleClickClose();
        clearTimeout(time);
    }, 2600);

    return <PopUpParent
        handleClickClose={handleClickClose}
        name="Thanks for rating the video! :)"
    />;
};

SuccessMessage.propTypes = {
    handleClickClose: PropTypes.func
};

// ------------------------------------------------------------------------

export default class VideoRatePopPup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSuccess: false,
            value: 0,
            id: '',
        };

        this.handleClickClose = this.handleClickClose.bind(this);
        this.handleChangeRate = this.handleChangeRate.bind(this);
        this.handleClickDone = this.handleClickDone.bind(this);
    }

    // -============================ OWN EVENTS ============================-

    handleChangeRate(e) {
        this.setState({
            value: e.currentTarget.value
        });
    }

    handleClickClose() {
        this.setState({
            isSuccess: false,
            value: 0,
            id: ''
        });

        // Belongs to the parent - VideoCardBigWrapper
        this.props.hidePopUp();
    }

    handleClickDone() {
        const {
            hidePopUp,
            idToRate
        } = this.props;

        SuperAgent.post('/video/ratings')
            .type('form')
            .query({
                'sessionId': JSON.parse(sessionStorage.getItem('userData')).sessionId
            })
            .send({
                'videoId': idToRate,
                'rating': this.state.value,
            })
            .end((err, res) => {
                if (err) {
                    this.setState({
                        isSuccess: false
                    });

                    hidePopUp();
                } else {
                    if (res.body.status === 'success') {
                        this.setState({
                            isSuccess: true
                        });
                    } else {
                        hidePopUp();
                    }
                }
            });
    }

    // -============================ REACT LIFECYLE ============================-

    render() {
        const {
            displayPopUp
        } = this.props;

        return (
            <div className={`rate-stars-container ${displayPopUp ? '' : 'hide'}`}>
                <div className="grid-container">
                    <div className={`rate-stars-popup shadow ${displayPopUp ? 'fadeInDown-anim' : ''}`}>
                        {
                            this.state.isSuccess
                                ? <SuccessMessage
                                    handleClickClose={this.handleClickClose}
                                />
                                : <InitialMessage
                                    handleClickClose={this.handleClickClose}
                                    handleChangeRate={this.handleChangeRate}
                                    handleClickDone={this.handleClickDone}
                                />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

VideoRatePopPup.propTypes = {
    hidePopUp: PropTypes.func,
    idToRate: PropTypes.string,
    displayPopUp: PropTypes.bool
};
