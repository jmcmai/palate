import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import Navbar from './Navbar';

interface TemplateProps {
  children: ReactNode;
}

const Template: React.FC<TemplateProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="row body">
        {children}
      </div>
    </>
  );
};

Template.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Template;
