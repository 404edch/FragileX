import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const ItemCadastro = ({ label, ...props }: Props) => {
  return (
    <div className="cadastro-item">
      <label className="cadastro-label">
        {label} {props.required && <span className="required-asterisk">*</span>}
      </label>
      <input className="cadastro-input" {...props} />
    </div>
  );
};

export default ItemCadastro;
