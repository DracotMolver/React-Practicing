/**
 * @author Diego Alberto Molina Vera
 * @copyright 2017 -2018
 */
// -========================== MODULES ==========================-
import React from 'react';
import PropTypes from 'prop-types';

// -========================== COMPONENTS ==========================-
const msgCSSClass = {
    error: 'msg-error',
    success: 'msg-success',
    warning: 'msg-warning'
};

/**
 * It will displays general messages.
 * - warnings
 * - erros
 * - success
 */
const Message = props => {
    const {
        messageType,
        messageText
    } = props;

    return (
        <div className="gird-100">
            <div className={messageType !== '' ? msgCSSClass[messageType] : ''}>
                {messageText}
            </div>
        </div>
    );
};

Message.propTypes = {
    messageText: PropTypes.string,
    messageType: PropTypes.string
};

export default Message;