import React from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar'

function Template({children}) {
  return (
    <>
      <Navbar />
      <div className="row body">
        {children}
      </div>
    </>
  )
}

Template.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Template;